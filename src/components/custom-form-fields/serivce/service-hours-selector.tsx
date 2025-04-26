"use client"

import { useFormContext } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CalendarDays, Hourglass, Plus, Trash2, Info } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"

// Helper functions
import { timeOptions, toMin } from "@/lib/lib"

/* ────────────────────────────────────────────────────────────────── */
/* 1. Business Availability (from props)                            */
/* ────────────────────────────────────────────────────────────────── */
export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
export type BreakRecord = Record<WeekDay, [string, string][]>

/* ────────────────────────────────────────────────────────────────── */
/* 2. Constants & Helpers                                           */
/* ────────────────────────────────────────────────────────────────── */
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const

type Day = (typeof days)[number]
type Slot = [string, string]

/* Check if a time or slot overlaps with any break slot */
const overlapsBreak = (timeOrSlot: string | Slot, breaks: Slot[]) => {
  if (typeof timeOrSlot === "string") {
    const min = toMin(timeOrSlot)
    return breaks
      .map(([bStart, bEnd]) => {
        const bs = toMin(bStart)
        const be = toMin(bEnd)
        const overlap = min >= bs && min < be
        return overlap ? [bStart, bEnd] : null
      })
      .filter((b): b is Slot => b !== null)
  }
  const [start, end] = timeOrSlot.map(toMin)
  return breaks
    .map(([bStart, bEnd]) => {
      const bs = toMin(bStart)
      const be = toMin(bEnd)
      const overlap =
        (start >= bs && start < be) ||
        (end > bs && end <= be) ||
        (start <= bs && end >= be)
      return overlap ? [bStart, bEnd] : null
    })
    .filter((b): b is Slot => b !== null)
}

/* Get the next valid start time after a given time, respecting breaks */
const getNextValidStartTime = (
  endTime: string,
  breaks: Slot[],
  options: string[]
) => {
  if (!endTime || !options.includes(endTime)) return options[0] || ""
  const endMin = toMin(endTime)
  for (const time of options) {
    const timeMin = toMin(time)
    if (timeMin < endMin) continue
    const overlap = breaks.some(([bStart, bEnd]) => {
      const bs = toMin(bStart)
      const be = toMin(bEnd)
      return timeMin >= bs && timeMin < be
    })
    if (!overlap) return time
  }
  return options[0] || ""
}

/* Format break times for display */
const formatBreaks = (day: Day, breaks: Slot[]) => {
  if (!breaks || breaks.length === 0) {
    return `No breaks scheduled for ${day}.`
  }
  if (breaks.length === 1) {
    const [start, end] = breaks[0]
    return `Break on ${day} is from ${start} to ${end}.`
  }
  const breakStrings = breaks.map(([start, end]) => `${start} to ${end}`)
  const lastBreak = breakStrings.pop()
  return `Breaks on ${day} are from ${breakStrings.join(
    ", "
  )}, and ${lastBreak}.`
}

/* ────────────────────────────────────────────────────────────────── */
/* 3. Component                                                     */
/* ────────────────────────────────────────────────────────────────── */
interface Props {
  /** Field name in RHF, e.g., "serviceHours" */
  name: string
  /** Business break times */
  businessBreaks: BreakRecord
}

export default function ServiceHourSelector({ name, businessBreaks }: Props) {
  const { watch, setValue } = useFormContext()

  /* -------- RHF values -------- */
  const serviceDays: Day[] = watch("serviceDays") || []
  const serviceHours: Record<Day, Slot[]> = watch(name) || {}

  /* -------- UI state ---------- */
  const [activeDay, setActiveDay] = useState<Day>(serviceDays[0] ?? "Mon")

  /* -------- Filter options to exclude break times, but allow boundaries -------- */
  const workTimeOptions = useMemo(() => {
    const breaks = businessBreaks[activeDay] ?? []
    return timeOptions.filter((t) => {
      const min = toMin(t)
      // Exclude times strictly inside a break (allow start/end boundaries)
      return !breaks.some(([s, e]) => {
        const startMin = toMin(s)
        const endMin = toMin(e)
        return min > startMin && min < endMin
      })
    })
  }, [activeDay, businessBreaks])

  /* -------- Helpers ---------------------------------------------- */
  const getAvailableTimes = (
    afterTime: string | undefined,
    options: string[],
    isEnd: boolean = false
  ) => {
    if (!afterTime || !options.includes(afterTime)) return options
    const index = options.indexOf(afterTime)
    return isEnd ? options.slice(index + 1) : options.slice(index)
  }

  // Update the time slot
  const update = (idx: number, pos: 0 | 1, val: string) => {
    const updated = { ...serviceHours }
    const slots = [...(updated[activeDay] || [])]
    const slot = slots[idx] ? [...slots[idx]] : ["", ""]
    const prevValue = slot[pos]

    // Validate start time
    if (pos === 0) {
      const breaks = businessBreaks[activeDay] ?? []
      const overlappingBreaks = overlapsBreak(val, breaks)
      if (overlappingBreaks.length > 0) {
        const [breakStart, breakEnd] = overlappingBreaks[0]
        toast.error(
          `Break starts at ${breakStart}, not available until ${breakEnd}.`,
          {
            description: "Please choose a start time outside break hours.",
            duration: 5000,
          }
        )
        return
      }
    }

    // Update slot temporarily to validate
    slot[pos] = val

    // Validate full slot if both start and end are set
    const breaks = businessBreaks[activeDay] ?? []
    if (slot[0] && slot[1]) {
      const overlappingBreaks = overlapsBreak(slot as Slot, breaks)
      if (overlappingBreaks.length > 0) {
        const [breakStart, breakEnd] = overlappingBreaks[0]
        const message =
          pos === 0
            ? `Break starts at ${breakStart}, not available until ${breakEnd}.`
            : `Not available due to break from ${breakStart} to ${breakEnd}.`
        toast.error(message, {
          description: "Please choose a time outside break hours.",
          duration: 5000,
        })
        slot[pos] = prevValue // Revert to previous value
        return
      }
    }

    slots[idx] = slot as Slot
    updated[activeDay] = slots
    setValue(name, updated, { shouldDirty: true })
  }

  // Add new time slot
  const addSlot = () => {
    const updated = { ...serviceHours }
    const prevSlots = updated[activeDay] || []
    const prevEnd = prevSlots.at(-1)?.[1] ?? ""
    const breaks = businessBreaks[activeDay] ?? []
    const nextStart = getNextValidStartTime(prevEnd, breaks, workTimeOptions)
    updated[activeDay] = [...prevSlots, [nextStart, ""]]
    setValue(name, updated, { shouldDirty: true })
  }

  // Remove the time slot
  const removeSlot = (idx: number) => {
    const updated = { ...serviceHours }
    updated[activeDay] = updated[activeDay].filter((_, i) => i !== idx)
    setValue(name, updated, { shouldDirty: true })
  }

  /* -------- Render ----------------------------------------------- */
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex gap-2 items-center">
        <Hourglass className="size-4 text-gray-500" />
        <Label>Service Hour / day</Label>
      </div>

      {/* Day buttons */}
      <div className="flex gap-2 items-center">
        <CalendarDays className="size-5 text-gray-500" />
        <div className="flex flex-wrap gap-3">
          {serviceDays.map((d) => (
            <Button
              type="button"
              key={d}
              variant={d === activeDay ? "default" : "outline"}
              className={cn(
                "min-w-[72px] px-6",
                d === activeDay && "shadow-[inset_0_2px_4px_#001F5280]"
              )}
              onClick={() => setActiveDay(d)}
            >
              {d}
            </Button>
          ))}
        </div>
      </div>

      {/* Slots */}
      <div className="space-y-4 flex flex-col items-center">
        {(serviceHours[activeDay] || []).map((slot, idx) => {
          // Auto-heal blank start values
          if (!slot[0] && idx > 0) slot[0] = serviceHours[activeDay][idx - 1][1]

          const prevEnd = idx > 0 ? serviceHours[activeDay][idx - 1][1] : ""
          const startList = getAvailableTimes(prevEnd, workTimeOptions)
          const endList = getAvailableTimes(slot[0], workTimeOptions, true)

          return (
            <div key={idx} className="flex gap-4 items-center">
              {/* Start */}
              <Select
                value={slot[0] || undefined}
                onValueChange={(v) => update(idx, 0, v)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Start" />
                </SelectTrigger>
                <SelectContent>
                  {startList.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* End */}
              <div className="relative">
                <Select
                  value={slot[1] || undefined}
                  onValueChange={(v) => update(idx, 1, v)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="End" />
                  </SelectTrigger>
                  <SelectContent>
                    {endList.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {idx > 0 && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute -right-8 top-0"
                    onClick={() => removeSlot(idx)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          )
        })}

        <Button
          type="button"
          variant="outline"
          className="text-xs gap-1"
          onClick={addSlot}
        >
          <Plus className="w-3 h-3" /> Add Time Slot
        </Button>

        {/* Break Time Note */}
        <div className="mt-2 flex items-start gap-2 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground max-w-md">
          <Info className="size-4 mt-0.5 flex-shrink-0" />
          <p>{formatBreaks(activeDay, businessBreaks[activeDay] ?? [])}</p>
        </div>
      </div>
    </div>
  )
}
