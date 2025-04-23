"use client"

import { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import InputField from "@/components/custom-form-fields/input-field"
import SelectField from "@/components/custom-form-fields/select-field"
import {
  CheckCircle,
  Building2,
  Mail,
  Phone,
  MapPin,
  Map,
  Calendar,
} from "lucide-react"
import BusinessHourSelector from "@/features/business-detail/components/business-hour-selector"
import HolidayField from "@/components/custom-form-fields/business-settings/business-holiday-field"

// Define holiday date options (mocked for now)
const dateOptions = [
  { value: "2025-01-01", label: "Jan 1, 2025" },
  { value: "2025-01-02", label: "Jan 2, 2025" },
  { value: "2025-12-25", label: "Dec 25, 2025" },
  { value: "2025-12-26", label: "Dec 26, 2025" },
]

const schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  supportEmail: z
    .string()
    .email("Invalid email address")
    .min(1, "Support email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Physical address is required"),
  googleMap: z.string().min(1, "Google Map URL is required"),
  businessHours: z.object({}).passthrough(), // BusinessHourSelector handles its own validation
  businessDays: z
    .array(z.string())
    .min(1, "At least one business day is required"),
  holidays: z.array(z.string()).optional(),
  //   holidayStart: z.string().min(1, "Holiday start date is required"),
  //   holidayEnd: z.string().min(1, "Holiday end date is required"),
})

const ContactInformationForm = () => {
  const [useBusinessInfo, setUseBusinessInfo] = useState(true)

  const form = useForm({
    defaultValues: {
      businessName: "",
      supportEmail: "",
      phone: "",
      address: "",
      googleMap: "",
      businessHours: {},
      businessDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      holidays: [],
      //   holidayStart: "",
      //   holidayEnd: "",
    },
    resolver: zodResolver(schema),
  })

  const { reset, watch } = form

  // Mock fetching business details
  const fetchBusinessDetails = () => {
    return {
      businessName: "My Business",
      supportEmail: "support@mybusiness.com",
      phone: "+1234567890",
      address: "123 Main St, City, State, ZIP",
      googleMap: "https://maps.google.com",
      businessHours: {
        Mon: {
          work: [["09:00 AM", "05:00 PM"]],
          break: [["12:00 PM", "01:00 PM"]],
        },
        Tue: {
          work: [["09:00 AM", "05:00 PM"]],
          break: [["12:00 PM", "01:00 PM"]],
        },
        Wed: {
          work: [["09:00 AM", "05:00 PM"]],
          break: [["12:00 PM", "01:00 PM"]],
        },
        Thu: {
          work: [["09:00 AM", "05:00 PM"]],
          break: [["12:00 PM", "01:00 PM"]],
        },
        Fri: {
          work: [["09:00 AM", "05:00 PM"]],
          break: [["12:00 PM", "01:00 PM"]],
        },
      },
      businessDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      holidays: ["Sat", "Sun"],
      //   holidayStart: "2025-12-25",
      //   holidayEnd: "2025-12-26",
    }
  }

  useEffect(() => {
    if (useBusinessInfo) {
      const businessDetails = fetchBusinessDetails()
      reset(businessDetails)
    }
  }, [useBusinessInfo, reset])

  const onSubmit = (data: any) => {
    console.log("Contact Information submitted:", data)
    if (!useBusinessInfo) {
      console.log("Saving as new support details")
    }
  }

  const businessDays = watch("businessDays")

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">What to Show?</h3>
          <p className="text-sm text-gray-500">
            What will be shown to users in About us and Support & help sections.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch
              checked={useBusinessInfo}
              onCheckedChange={setUseBusinessInfo}
            />
            <div className="flex items-center gap-2">
              <CheckCircle className="size-4 text-gray-500" />
              <Label>Use Business Info</Label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            📌 To let users know who to reach to for specific issues. Following
            details are taken from Business Settings &gt; Business Details.
          </p>
        </div>

        <div className="space-y-4">
          <InputField
            name="businessName"
            label="Company/Business Name"
            placeholder="Enter Name"
            icon={Building2}
          />
          <InputField
            name="supportEmail"
            label="Support Email"
            type="email"
            placeholder="Enter Support Email Address"
            icon={Mail}
          />
          <InputField
            name="phone"
            label="Phone Number (if available)"
            type="tel"
            placeholder="Enter Support Email Address"
            icon={Phone}
          />
          <InputField
            name="address"
            label="Physical Address (if applicable)"
            placeholder="Enter Support Email Address"
            icon={MapPin}
          />
          <InputField
            name="googleMap"
            label="Google Map (if applicable)"
            type="url"
            placeholder="Enter Support Email Address"
            icon={Map}
          />
        </div>

        {/* <div className="space-y-4"> */}
        <BusinessHourSelector name="businessHours" />
        {/* </div> */}

        <HolidayField name="holidays" disableFieldName="businessDays" />

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Save
        </Button>
      </form>
    </FormProvider>
  )
}

export default ContactInformationForm
