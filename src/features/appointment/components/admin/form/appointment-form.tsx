// app/(admin)/appointment-form.tsx
"use client"

import { useForm, FormProvider } from "react-hook-form"
import InputField from "@/components/custom-form-fields/input-field"
import SelectField from "@/components/custom-form-fields/select-field"
import TextAreaField from "@/components/custom-form-fields/textarea-field"
import PhoneInputField from "@/components/custom-form-fields/phone-field"
import TimePickerField from "@/components/custom-form-fields/time-field"
import { Button } from "@/components/ui/button"
import FormHeader from "@/components/admin/form-header"
import { useRouter } from "next/navigation"
import DatePickerField from "@/components/custom-form-fields/date-field"
import { Mail, SlidersHorizontal, UserPen } from "lucide-react"

const serviceOptions = [
  { label: "Consultation", value: "consultation" },
  { label: "Haircut", value: "haircut" },
  { label: "Massage", value: "massage" },
]

const availableTimeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

const AppointmentForm = () => {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      date: undefined,
      time: "",
      message: "",
    },
  })

  const router = useRouter()

  const onSubmit = (data: any) => {
    console.log("Appointment Form Submitted:", data)
    // Handle appointment submission (e.g., API calls)
  }

  const handleBack = () => {
    router.push("/admin/appointments")
  }

  return (
    <>
      <FormHeader
        title="Enter Appointment Details"
        description="View and manage your upcoming appointments"
      />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 ">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              name="firstName"
              label="First Name"
              placeholder="John"
              icon={UserPen}
            />
            <InputField
              name="lastName"
              label="Last Name"
              placeholder="Doe"
              icon={UserPen}
            />
          </div>

          <InputField
            name="email"
            label="Email"
            type="email"
            placeholder="john@example.com"
            icon={Mail}
          />

          <PhoneInputField
            name="phone"
            label="Phone Number"
            placeholder="Enter your number"
          />

          <SelectField
            name="service"
            label="Select a Service"
            options={serviceOptions}
            icon={SlidersHorizontal}
            placeholder="Select a service"
          />

          <div className="grid grid-cols-2 items-center gap-4">
            <DatePickerField
              name="date"
              label="Appointment Date"
              placeholder="Pick a date"
            />
            <TimePickerField
              name="time"
              label="Appointment Time"
              availableTimeSlots={availableTimeSlots}
            />
          </div>

          <TextAreaField
            name="message"
            label="Additional Notes"
            placeholder="Any special requests?"
          />

          <div className="flex flex-col gap-3 md:flex-row justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto hover:opacity-95 active:translate-y-0.5 transition-transform duration-200"
              onClick={handleBack}
            >
              ← Back
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto hover:opacity-95 active:translate-y-0.5 transition-transform duration-200"
            >
              Book Appointment
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default AppointmentForm
