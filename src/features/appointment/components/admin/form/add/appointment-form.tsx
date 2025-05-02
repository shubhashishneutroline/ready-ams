// app/(admin)/appointment-form.tsx
"use client"

import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import InputField from "@/components/custom-form-fields/input-field"
import SelectField from "@/components/custom-form-fields/select-field"
import TextAreaField from "@/components/custom-form-fields/textarea-field"
import PhoneInputField from "@/components/custom-form-fields/phone-field"
import TimePickerField from "@/components/custom-form-fields/time-field"
import { Button } from "@/components/ui/button"
import FormHeader from "@/components/admin/form-header"
import { useRouter, useParams } from "next/navigation"
import DatePickerField from "@/components/custom-form-fields/date-field"
import { Mail, SlidersHorizontal, UserPen } from "lucide-react"
import { getServices } from "@/features/service/api/api"
import {
  createAppointment,
  updateAppointment,
  getAppointmentById,
  type AppointmentData,
} from "@/features/appointment/api/api"
import { useEffect, useState } from "react"
import { Toaster, toast } from "sonner"
import { Service } from "../../../../../service/api/api"
import {
  isoToNormalDate,
  isoToNormalTime,
  normalOrFormTimeToIso,
  normalDateToIso,
  formatAppointmentDate,
} from "@/utils/utils"

interface ServiceOption {
  label: string
  value: string
}

// Validation schema
const appointmentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  service: z.string().min(1, "Service is required"),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, "Time is required"),
  message: z.string().optional(),
})

type FormData = z.infer<typeof appointmentSchema>

const availableTimeSlots = [
  "09:00 AM",
  "10:00 AM",
  "10:15 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

export default function AppointmentForm() {
  // Get router and params
  const router = useRouter()
  const params = useParams()

  // Get ID from params
  const id = params?.id as string | undefined

  // Check if we're in edit mode
  const isEditMode = !!id

  // Debug: Log params and mode
  useEffect(() => {
    console.log("URL params:", params)
    console.log("Appointment ID:", id)
    console.log("isEditMode:", isEditMode)
  }, [params, id, isEditMode])

  // Serive options
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([])
  // Service Loading states
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  // Appointment Loading states
  const [isLoadingAppointment, setIsLoadingAppointment] = useState(isEditMode)
  // Form Loading states
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form
  const form = useForm<FormData>({
    resolver: zodResolver(appointmentSchema),
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

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true)
        const services = await getServices()
        const options = services.map((service: Service) => ({
          label: service.title,
          value: service.id,
        }))
        setServiceOptions(options as ServiceOption[])
      } catch (error) {
        console.error("Error fetching services:", error)
        toast.error("Failed to load services")
      } finally {
        setIsLoadingServices(false)
      }
    }
    fetchServices()
  }, [])

  // Fetch appointment data for edit mode
  useEffect(() => {
    // Check if we're in edit mode
    if (isEditMode && id) {
      // Fetch appointment
      const fetchAppointment = async () => {
        try {
          setIsLoadingAppointment(true)
          const { data: appointment } = await getAppointmentById(id)
          console.log("Raw appointment response:", appointment)

          if (!appointment || !appointment.customerName) {
            throw new Error("Invalid appointment data: customerName is missing")
          }

          const date = new Date(isoToNormalDate(appointment.selectedDate))
          const time = isoToNormalTime(appointment.selectedTime)
          const [firstName, ...lastNameParts] = appointment.customerName
            .trim()
            .split(" ")
          form.reset({
            firstName: firstName || "",
            lastName: lastNameParts.join(" ") || "",
            email: appointment.email || "",
            phone: appointment.phone || "",
            service: appointment.serviceId || "",
            date: isNaN(date.getTime()) ? undefined : date,
            time: time || "",
            message: appointment.message || "",
          })
          console.log("Form populated with:", {
            firstName,
            lastName: lastNameParts.join(" "),
            email: appointment.email,
            phone: appointment.phone,
            service: appointment.serviceId,
            date: formatAppointmentDate(appointment.selectedDate),
            time,
            message: appointment.message,
            rawSelectedDate: appointment.selectedDate,
            rawSelectedTime: appointment.selectedTime,
          })
        } catch (error: any) {
          console.error("Error fetching appointment:", error)
          toast.error(error.message || "Failed to load appointment data")
        } finally {
          setIsLoadingAppointment(false)
        }
      }
      fetchAppointment()
    }
  }, [id, isEditMode, form])

  const onSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true)
      const appointmentData: AppointmentData = {
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        serviceId: formData.service,
        selectedDate: normalDateToIso(formData.date),
        selectedTime: normalOrFormTimeToIso(formData.date, formData.time),
        message: formData.message,
        userId: "cm9gu8ms60000vdg0zdnsxb6z",
        isForSelf: false,
        bookedById: "cm9gu8ms60000vdg0zdnsxb6z",
        createdById: "cm9gu8ms60000vdg0zdnsxb6z",
        status: "SCHEDULED",
      }
      console.log("Submitting appointment:", appointmentData)

      if (isEditMode) {
        await updateAppointment(id as string, appointmentData)
        toast.success("Appointment updated successfully")
      } else {
        await createAppointment(appointmentData)
        toast.success("Appointment created successfully")
      }
      handleBack()
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} appointment:`,
        error
      )
      const errorMessage = error.message.includes("already exists")
        ? "This email is already registered for an appointment"
        : error.message ||
          `Failed to ${isEditMode ? "update" : "create"} appointment`
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push("/appointment")
  }

  return (
    <>
      <FormHeader
        title={isEditMode ? "Edit Appointment" : "Enter Appointment Details"}
        description={
          isEditMode
            ? "Update existing appointment details"
            : "View and manage your upcoming appointments"
        }
      />
      {isLoadingAppointment ? (
        <div className="flex justify-center items-center py-20 text-muted-foreground">
          Loading appointment...
        </div>
      ) : (
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            aria-busy={isSubmitting}
          >
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
              disabled={isLoadingServices || serviceOptions.length === 0}
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
                disabled={isSubmitting}
              >
                ← Back
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto hover:opacity-95 active:translate-y-0.5 transition-transform duration-200"
                disabled={isLoadingServices || isSubmitting}
              >
                {isEditMode
                  ? isSubmitting
                    ? "Updating..."
                    : "Update Appointment"
                  : isSubmitting
                    ? "Creating..."
                    : "Book Appointment"}
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
    </>
  )
}
