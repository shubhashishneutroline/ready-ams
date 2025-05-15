"use client"

import { useForm, FormProvider } from "react-hook-form"
import { useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import InputField from "@/components/custom-form-fields/input-field"
import TextAreaField from "@/components/custom-form-fields/textarea-field"
import ReminderSelectField from "./select-field"
import CheckboxGroupField from "./checbox-group-field"
import RadioGroupField from "./radio-group-field"
import {
  AudioWaveform,
  BetweenHorizonalStart,
  PenLine,
  Send,
  SlidersHorizontal,
  Trash2,
} from "lucide-react"
import { useServiceStore } from "@/app/(admin)/service/_store/service-store"
import ScheduleField from "./modified-schedule-field"

const reminderTypes = [
  "Upcoming",
  "Follow-up",
  "Cancellation",
  "Missed",
  "Custom",
]

const whenOptions = {
  Upcoming: [
    "48 hours before appointment",
    "24 hours before appointment",
    "1 hours before appointment",
  ],
  "Follow-up": [
    "1 hour after appointment",
    "1 days after appointment",
    "2 days after appointment",
  ],
  Missed: [
    "15 minutes after missed",
    "1 hour after missed",
    "24 hours after missed",
    "48 hours after missed",
  ],
  Cancellation: [
    "15 minutes after cancellation",
    "1 hour after cancellation",
    "24 hours after cancellation",
    "48 hours after cancellation",
  ],
  Custom: [],
}

const scheduleLabels = {
  Upcoming: "Schedule reminder",
  "Follow-up": "Schedule follow-up",
  Missed: "Schedule follow-up",
  Cancellation: "Schedule follow-up",
  Custom: "Schedule reminder",
}

const sendViaOptions = ["Email", "SMS", "Push Notification"]
const autoDeleteOptions = ["7 days", "30 days", "Never"]
const defaultMessages: Record<string, string> = {
  "Follow-up":
    "Thank you for visiting us on {selected_appointment_date} for {selected_service_name}. We value your feedback! Please take a moment to share your experience.",
  Upcoming:
    "You have an appointment scheduled on {selected_appointment_date} at {selected_appointment_time} for {selected_service_name}. Please be on time. If you need to reschedule, visit your dashboard.",
  Missed:
    "It looks like you missed your appointment on {selected_appointment_date}. Please contact us if you'd like to reschedule.",
  Cancellation:
    "Your appointment on {selected_appointment_date} was cancelled. Let us know if you'd like to rebook.",
  Custom: "Custom reminder for your appointment. Please check your schedule.",
  Default: "Reminder for your appointment. Please check your schedule.",
}

// Convert when option to minutes
const getOffsetFromWhen = (option: string): number => {
  const match = option.match(/^(\d+)\s*(minute|hour|day)s?/i)
  if (!match) {
    return option === "Same day after appointment" ? 0 : 0
  }
  const [_, value, unit] = match
  const numValue = parseInt(value)
  switch (unit.toLowerCase()) {
    case "minute":
      return numValue
    case "hour":
      return numValue * 60
    case "day":
      return numValue * 24 * 60
    default:
      return 0
  }
}

export default function ReminderForm() {
  const { serviceOptions, services, fetchServices, loading, hasFetched } =
    useServiceStore()

  // Fetch services if not already fetched
  useEffect(() => {
    console.log(
      "ReminderForm: Checking fetch, loading =",
      loading,
      "hasFetched =",
      hasFetched
    )
    if (!loading && !hasFetched) {
      console.log("ReminderForm: Triggering fetchServices")
      fetchServices()
    }
  }, [fetchServices, loading, hasFetched])

  // Debug services and serviceOptions
  useEffect(() => {
    console.log("ReminderForm: services =", services)
    console.log("ReminderForm: serviceOptions =", serviceOptions())
  }, [services, serviceOptions])

  const form = useForm({
    defaultValues: {
      type: "Upcoming",
      subject: "",
      description: "",
      message: defaultMessages["Upcoming"],
      service: "",
      when: [],
      isScheduled: false,
      scheduleDays: "",
      scheduleHours: "",
      scheduleMinutes: "",
      notifications: [...sendViaOptions],
      autoDelete: "7 days",
    },
  })

  const { watch, setValue, handleSubmit } = form
  const selectedType = watch("type")

  useEffect(() => {
    setValue(
      "message",
      defaultMessages[selectedType] || defaultMessages["Default"]
    )
  }, [selectedType, setValue])

  const onSubmit = (data: any) => {
    const isBefore = data.type === "Upcoming" || data.type === "Custom"
    const whenOffsets = data.when
      .filter((option: string) => !option.toLowerCase().includes("schedule"))
      .map((option: string) => ({
        offset: getOffsetFromWhen(option),
        sendBefore: isBefore,
      }))

    // Add custom schedule offset
    if (
      data.isScheduled &&
      (data.scheduleDays || data.scheduleHours || data.scheduleMinutes)
    ) {
      const days = parseInt(data.scheduleDays || "0")
      const hours = parseInt(data.scheduleHours || "0")
      const minutes = parseInt(data.scheduleMinutes || "0")
      const offset = days * 24 * 60 + hours * 60 + minutes
      if (offset > 0) {
        whenOffsets.push({
          offset,
          sendBefore: isBefore,
        })
      }
    }

    // Format data for submission
    const submittedData = {
      type: data.type,
      subject: data.subject,
      description: data.description || undefined,
      message: data.message || undefined,
      services: data.service ? [data.service] : [],
      notifications: data.notifications.map((method: string) => ({ method })),
      when: whenOffsets,
      autoDelete: data.autoDelete,
    }

    console.log("Reminder submitted:", JSON.stringify(submittedData, null, 2))
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-6">
          {/* Reminder Type */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <BetweenHorizonalStart className="size-4 text-gray-500" />
              <Label>Reminder Type</Label>
            </div>
            <Tabs defaultValue={selectedType} className="mt-2">
              <TabsList className="grid gap-1 grid-cols-5">
                {reminderTypes.map((type) => (
                  <TabsTrigger
                    key={type}
                    value={type}
                    className="text-xs"
                    onClick={() => {
                      setValue("type", type)
                      setValue("when", [])
                      setValue("isScheduled", false)
                      setValue("scheduleDays", "")
                      setValue("scheduleHours", "")
                      setValue("scheduleMinutes", "")
                    }}
                  >
                    {type}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedType === "Follow-up"
                ? "📌 Follow up with users after their appointment, requesting feedback or next steps."
                : selectedType === "Missed"
                  ? "📌 Reminder sent for missed appointments."
                  : selectedType === "Cancellation"
                    ? "📌 Notify users about cancelled appointments."
                    : selectedType === "Custom"
                      ? "📌 Create a custom reminder with flexible scheduling."
                      : "📌 Notify users about their upcoming appointments."}
            </p>
          </div>

          {/* Subject Field */}
          <InputField
            name="subject"
            label="Subject"
            placeholder="Enter subject"
            icon={PenLine}
          />

          {/* Description Field */}
          <TextAreaField
            name="description"
            label="Description"
            placeholder="Enter description"
          />

          {/* Appointment Selection */}
          {loading && !hasFetched ? (
            <div className="text-center text-muted-foreground">
              Loading services...
            </div>
          ) : (
            <>
              <ReminderSelectField
                name="service"
                label="Choose Service"
                options={serviceOptions()}
                placeholder="Select service to set reminder"
                icon={SlidersHorizontal}
                disabled={
                  loading || (!loading && serviceOptions().length === 0)
                }
              />
              {!loading && hasFetched && serviceOptions().length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  No active services available.
                </p>
              )}
            </>
          )}

          {/* When to Send */}
          <div className=" ">
            <div className="flex gap-1">
              <Send strokeWidth={1.5} className="size-4 text-gray-500" />
              <Label>When to send?</Label>
            </div>
            {whenOptions[selectedType]?.length > 0 && (
              <CheckboxGroupField
                name="when"
                label=""
                options={whenOptions[selectedType].filter(
                  (label) => !label.toLowerCase().includes("schedule")
                )}
              />
            )}
            <ScheduleField
              name="isScheduled"
              label={scheduleLabels[selectedType] || "Schedule reminder"}
              dayFieldName="scheduleDays"
              hourFieldName="scheduleHours"
              minuteFieldName="scheduleMinutes"
            />
          </div>

          {/* Send Via */}
          <CheckboxGroupField
            name="notifications"
            label="Send via"
            options={sendViaOptions.map((opt) => ({
              label: opt,
              value: opt,
            }))}
            icon={AudioWaveform}
          />

          {/* Auto Delete */}
          <RadioGroupField
            name="autoDelete"
            label="Auto-delete expired reminder after?"
            options={autoDeleteOptions}
            icon={Trash2}
            className="space-y-2"
          />

          {/* Message */}
          <TextAreaField
            name="message"
            label="Message"
            placeholder="Enter message"
          />

          <Button type="submit" className="w-full">
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
