"use client"

import { useForm, FormProvider } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import InputField from "@/components/custom-form-fields/input-field"
import TextAreaField from "@/components/custom-form-fields/textarea-field"
import RadioGroupField from "@/components/custom-form-fields/reminder/radio-group-field"
import CheckboxGroupField from "@/components/custom-form-fields/reminder/checbox-group-field"
import AnnouncementRadioScheduleField from "./radio-schecule-field"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Delete,
  Megaphone,
  MessageSquareDot,
  Pen,
  PenLine,
  ShieldUser,
} from "lucide-react"

const targetAudienceOptions = ["All", "Appointments Users", "Cancelled Users"]
const showOnOptions = ["Top Banner", "Push Notification", "Email", "All"]
const autoDeleteOptions = ["1 days", "3 days", "7 days", "30 days", "Never"]
const scheduleOptions = ["Immediately", "Schedule"]

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  targetAudience: z.string().min(1, "Target audience selection is required"),
  schedule: z.string().min(1, "Schedule option is required"),
  scheduleDate: z
    .string()
    .optional()
    .refine(
      (value, ctx) => {
        if (ctx.parent.schedule === "Schedule" && !value) {
          return false
        }
        return true
      },
      { message: "Schedule date is required" }
    ),
  scheduleTime: z
    .string()
    .optional()
    .refine(
      (value, ctx) => {
        if (ctx.parent.schedule === "Schedule" && !value) {
          return false
        }
        return true
      },
      { message: "Schedule time is required" }
    ),
  showOn: z
    .array(z.string())
    .min(1, "At least one show on option must be selected"),
  autoDelete: z.string().min(1, "Auto-delete option is required"),
})

export default function AnnouncementForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      message: "",
      targetAudience: "",
      schedule: "Immediately",
      scheduleDate: "",
      scheduleTime: "",
      showOn: [],
      autoDelete: "7 days",
    },
    resolver: zodResolver(schema),
  })

  const { handleSubmit } = form

  const onSubmit = (data: any) => {
    console.log("Announcement submitted:", data)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-6">
          {/* Title */}
          <InputField
            name="title"
            label="Title"
            placeholder="Enter Service Name"
            icon={PenLine}
          />

          {/* Message */}
          <TextAreaField
            name="message"
            label="Message"
            placeholder="Details about your service for users to view..."
          />

          {/* Target Audience */}
          <RadioGroupField
            name="targetAudience"
            label="Target Audience"
            options={targetAudienceOptions}
            icon={ShieldUser}
          />

          <div className="flex flex-col gap-8">
            {/* Schedule Announcements */}
            <AnnouncementRadioScheduleField
              name="schedule"
              label="Schedule Announcements"
              dateFieldName="scheduleDate"
              timeFieldName="scheduleTime"
              options={scheduleOptions}
              icon={Megaphone}
            />

            {/* Show On */}
            <CheckboxGroupField
              name="showOn"
              label="Show on"
              options={showOnOptions}
              icon={MessageSquareDot}
            />

            {/* Auto Delete */}
            <RadioGroupField
              name="autoDelete"
              label="Auto-delete expired reminder after?"
              options={autoDeleteOptions}
              icon={Delete}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
