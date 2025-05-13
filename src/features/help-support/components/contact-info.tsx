

"use client"

import { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import InputField from "@/components/custom-form-fields/input-field"
import { CheckCircle, Building2, Mail, Phone, MapPin, Map } from "lucide-react"
import BusinessHourSelector from "@/app/(admin)/business-settings/_components/business-hour-selector"
import { transformSupportDetailForForm, transformBusinessDataForSupportDetail, transformFormDataForSupportDetail, useSupportTabsStore } from "@/app/(admin)/support/_store/support-store"
import { useBusinessStore } from "@/app/(admin)/business-settings/_store/business-store"
import BusinessDaysField from "@/components/custom-form-fields/business-settings/business-day-field"
import HolidayField from "@/components/custom-form-fields/business-settings/business-holiday-field"
import { createSupportDetail, updateSupportDetail } from "@/app/(admin)/support/_api-call/support-api-call"

const schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  supportEmail: z
    .string()
    .email("Invalid email address")
    .min(1, "Support email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Physical address is required"),
  googleMap: z.string().min(1, "Google Map URL is required"),
  businessHours: z.object({}).passthrough(),
  businessDays: z
    .array(z.string())
    .min(1, "At least one business day is required"),
  holidays: z.array(z.string()).optional(),
})

const ContactInformationForm = () => {
  const { supportDetail, getSupportBusinessDetailById, setSupportDetail } = useSupportTabsStore()
  const { selectedBusiness } = useBusinessStore()
  const [useBusinessInfo, setUseBusinessInfo] = useState(!supportDetail)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    defaultValues: {
      businessName: "",
      supportEmail: "",
      phone: "",
      address: "",
      googleMap: "",
      businessHours: {
        Mon: { work: [["09:00 AM", "04:00 PM"]], break: [["12:00 PM", "01:00 PM"]] },
        Tue: { work: [["09:00 AM", "04:00 PM"]], break: [["12:00 PM", "01:00 PM"]] },
        Wed: { work: [["09:00 AM", "04:00 PM"]], break: [["12:00 PM", "01:00 PM"]] },
        Thu: { work: [["09:00 AM", "04:00 PM"]], break: [["12:00 PM", "01:00 PM"]] },
        Fri: { work: [["09:00 AM", "04:00 PM"]], break: [["12:00 PM", "01:00 PM"]] },
        Sat: { work: [], break: [] },
        Sun: { work: [], break: [] },
      },
      businessDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      holidays: ["Sat", "Sun"],
    },
    resolver: zodResolver(schema),
  })

  const { reset, watch } = form
  const businessDays = watch("businessDays")

  useEffect(() => {
    if (selectedBusiness?.id) {
      console.log("Fetching support details for business ID:", selectedBusiness.id)
      getSupportBusinessDetailById(selectedBusiness.id)
    }
  }, [selectedBusiness?.id, getSupportBusinessDetailById])

  useEffect(() => {
    console.log("useBusinessInfo:", useBusinessInfo, "supportDetail:", supportDetail, "selectedBusiness:", selectedBusiness)
    if (useBusinessInfo && selectedBusiness) {
      console.log("Populating form with transformed business data:", selectedBusiness)
      reset(transformBusinessDataForSupportDetail(selectedBusiness))
    } else if (!useBusinessInfo && supportDetail) {
      console.log("Populating form with support detail:", supportDetail)
      reset(transformSupportDetailForForm(supportDetail))
    }
  }, [useBusinessInfo, supportDetail, selectedBusiness, reset])

  const onSubmit = async (data: any) => {
    console.log("Contact Information submitted:", JSON.stringify(data, null, 2))
    if (!selectedBusiness?.id) {
      toast.error("No business selected")
      return
    }
    setIsSubmitting(true)
    try {
      const transformedData = transformFormDataForSupportDetail({
        ...data,
        businessId: selectedBusiness.id,
      })
      console.log("Transformed data:", JSON.stringify(transformedData, null, 2))

      let response
      if (supportDetail?.id) {
        console.log("Updating support detail with ID:", supportDetail.id)
        response = await updateSupportDetail(supportDetail.id, transformedData)
        toast.success("Support details updated successfully!")
      } else {
        console.log("Creating new support detail")
        response = await createSupportDetail(transformedData)
        toast.success("Support details created successfully!")
      }

      if (response.data) {
        setSupportDetail(response.data)
      } else {
        throw new Error("Failed to save support details")
      }
    } catch (error: any) {
      console.error("Error saving support details:", error)
      toast.error(`Failed to save support details: ${error.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

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
              onCheckedChange={() => setUseBusinessInfo(!useBusinessInfo)}
            />
            <div className="flex items-center gap-2">
              <CheckCircle className="size-4 text-gray-500" />
              <Label>Use Business Info</Label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            📌 To let users know who to reach to for specific issues. Following
            details are taken from Business Settings > Business Details.
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
            placeholder="Enter Phone Number"
            icon={Phone}
          />
          <InputField
            name="address"
            label="Physical Address (if applicable)"
            placeholder="Enter Physical Address"
            icon={MapPin}
          />
          <InputField
            name="googleMap"
            label="Google Map (if applicable)"
            type="url"
            placeholder="Enter Google Map URL"
            icon={Map}
          />
        </div>

        <BusinessDaysField name="businessDays" holidayFieldName="holidays" />
        <BusinessHourSelector name="businessHours" />
        <HolidayField name="holidays" disableFieldName="businessDays" />

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? supportDetail?.id
              ? "Updating..."
              : "Creating..."
            : supportDetail?.id
            ? "Update"
            : "Create"}
        </Button>
      </form>
    </FormProvider>
  )
}

export default ContactInformationForm
