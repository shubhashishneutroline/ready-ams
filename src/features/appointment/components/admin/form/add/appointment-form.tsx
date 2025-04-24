// app/(admin)/appointment-form.tsx
"use client";

import { useForm, FormProvider } from "react-hook-form";
import InputField from "@/components/custom-form-fields/input-field";
import SelectField from "@/components/custom-form-fields/select-field";
import TextAreaField from "@/components/custom-form-fields/textarea-field";
import PhoneInputField from "@/components/custom-form-fields/phone-field";
import TimePickerField from "@/components/custom-form-fields/time-field";
import { Button } from "@/components/ui/button";
import FormHeader from "@/components/admin/form-header";
import { useRouter } from "next/navigation";
import DatePickerField from "@/components/custom-form-fields/date-field";
import { Mail, SlidersHorizontal, UserPen } from "lucide-react";
import { getServices, type Service } from "@/features/service/api/api";
import {
  createAppointment,
  type AppointmentData,
} from "@/features/appointment/api/api";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

interface ServiceOption {
  label: string;
  value: string;
}

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
];

function convertToISODateTime(date: Date, time: string) {
  // Create a new date object from the selected date
  const selectedDate = new Date(date);

  // Parse the time string (e.g., "02:00 PM")
  const [timeStr, meridiem] = time.split(" ");
  const [hours, minutes] = timeStr.split(":");

  // Convert to 24-hour format
  let hour = parseInt(hours);
  if (meridiem === "PM" && hour !== 12) {
    hour += 12;
  } else if (meridiem === "AM" && hour === 12) {
    hour = 0;
  }

  // Set the time components on the selected date
  selectedDate.setHours(hour);
  selectedDate.setMinutes(parseInt(minutes));
  selectedDate.setSeconds(0);
  selectedDate.setMilliseconds(0);

  // Return ISO string
  return selectedDate.toISOString();
}

// Example usage
const formData = {
  date: "2025-04-26", // Date in YYYY-MM-DD format
  time: "12:00 PM", // Time in 12-hour format (12-hour clock with AM/PM)
};

export default function AppointmentForm() {
  const router = useRouter();

  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const services = await getServices();
        const options = services.map((service: Service) => ({
          label: service.title,
          value: service.id,
        }));
        setServiceOptions(options);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

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
  });

  const onSubmit = async (formData: any) => {
    try {
      const appointmentData: AppointmentData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        serviceId: formData.service,
        selectedDate: formData.date?.toISOString(),
        selectedTime: convertToISODateTime(formData.date, formData.time),
        message: formData.message,
        userId: "cm9gu8ms60000vdg0zdnsxb6z",
        isForSelf: false,
        bookedById: "cm9gu8ms60000vdg0zdnsxb6z",
        createdById: "cm9gu8ms60000vdg0zdnsxb6z",
        status: "SCHEDULED",
      };
      console.log(appointmentData, "appointmentData");
      await createAppointment(appointmentData);
      toast.success("Appointment created successfully");
      handleBack();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment");
    }
  };

  const handleBack = () => {
    router.push("/appointment");
  };

  return (
    <>
      <Toaster position="top-center" />
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
  );
}
