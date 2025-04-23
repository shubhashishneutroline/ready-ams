"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import InputField from "@/components/custom-form-fields/input-field"
import SelectField from "@/components/custom-form-fields/select-field"
import {
  Building2,
  Briefcase,
  Mail,
  Phone,
  Globe,
  MapPin,
  Map,
  FileText,
  Upload,
  Image,
  Eye,
  LocateFixed,
  MapPinHouse,
  Pin,
  MapPinned,
} from "lucide-react"
import FileUploadField from "@/components/custom-form-fields/image-upload"

const industryOptions = [
  { value: "retail", label: "Retail" },
  { value: "hospitality", label: "Hospitality" },
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
]

const visibilityOptions = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
]

const schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry selection is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().optional(),
  city: z.string().min(1, "City is required"),
  street: z.string().min(1, "Street is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  googleMap: z.string().optional(),
  registrationNumber: z
    .string()
    .min(1, "Business registration number is required"),
  taxId: z.any().optional(),
  logo: z.any().refine((file) => file !== null, "Business logo is required"),
  visibility: z.string().min(1, "Visibility selection is required"),
})

const BusinessDetailForm = () => {
  const form = useForm({
    defaultValues: {
      businessName: "",
      industry: "",
      email: "",
      phone: "",
      website: "",
      city: "",
      street: "",
      state: "",
      zipCode: "",
      country: "",
      googleMap: "",
      registrationNumber: "",
      taxId: null,
      logo: null,
      visibility: "",
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: any) => {
    console.log("Business Detail Form submitted:", data)
  }

  const onSaveAndExit = () => {
    console.log("Save and exit clicked")
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="businessName"
              label="Business Name"
              placeholder="Enter your business name"
              icon={Building2}
            />
            <SelectField
              name="industry"
              label="Industry/Category"
              placeholder="Select Industry Type"
              options={industryOptions}
              icon={Briefcase}
            />
            <InputField
              name="email"
              label="Email"
              type="email"
              placeholder="Enter business email address"
              icon={Mail}
            />
            <InputField
              name="phone"
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone"
              icon={Phone}
            />
            <InputField
              name="website"
              label="Website"
              type="url"
              placeholder="Your business website URL"
              icon={Globe}
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* Business Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Business Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="city"
              label="City"
              placeholder="Enter city"
              icon={MapPinHouse}
            />
            <InputField
              name="street"
              label="Street"
              placeholder="Enter street"
              icon={LocateFixed}
            />
            <InputField
              name="state"
              label="State"
              placeholder="Enter State"
              icon={MapPinned}
            />
            <InputField
              name="zipCode"
              label="ZIP Code"
              placeholder="Enter ZIP code"
              icon={Pin}
            />
            <InputField
              name="country"
              label="Country"
              placeholder="Enter Country"
              icon={MapPin}
            />
            <InputField
              name="googleMap"
              label="Google Map"
              type="url"
              placeholder="Enter google map url"
              icon={Map}
            />
          </div>
        </div>

        {/* Legal & Compliance */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Legal & Compliance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="registrationNumber"
              label="Business Registration Number"
              placeholder="Enter Business Registration Number"
              icon={FileText}
            />
            <FileUploadField
              name="taxId"
              label="Tax ID / EIN / PAN"
              placeholder="Upload Tax ID / EIN / PAN document"
              icon={Upload}
            />
          </div>
        </div>

        {/* Branding & Visibility */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Branding & Visibility</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploadField
              name="logo"
              label="Logo / Business Image"
              placeholder="Upload Business Logo"
              icon={Image}
            />
            <SelectField
              name="visibility"
              label="Visibility (Public/Private)"
              placeholder="Select Visibility"
              options={visibilityOptions}
              icon={Eye}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Proceed
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-gray-400 text-gray-700 hover:bg-gray-100"
            onClick={onSaveAndExit}
          >
            Save and exit
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

export default BusinessDetailForm
