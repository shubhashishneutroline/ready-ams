"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import InputField from "@/components/custom-form-fields/input-field";
import TextAreaField from "@/components/custom-form-fields/textarea-field";
import ImageUploadField from "@/components/custom-form-fields/image-upload";
import AvailabilityTabs from "@/components/custom-form-fields/availability-tabs";
import ServiceDaySelector from "@/components/custom-form-fields/serivce/service-day-selector";
import ServiceHoursSelector from "@/components/custom-form-fields/serivce/service-hours-selector";
import ToggleSwitch from "@/components/custom-form-fields/toggle-switch";
import DurationSelect from "@/components/custom-form-fields/duration-select";
import {
  CalendarClock,
  ImageUp,
  ScrollText,
  UserRoundCog,
  Info,
} from "lucide-react";
import { Toaster } from "sonner";

// Business availability data
export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type BusinessAvailability = {
  breaks: Record<WeekDay, [string, string][]>;
  holidays: WeekDay[];
};

// Default business availability (for testing, can be overridden by prop)
const defaultBusinessAvailability: BusinessAvailability = {
  breaks: {
    Mon: [
      ["12:00 PM", "01:00 PM"],
      ["02:00 PM", "03:00 PM"],
      ["04:00 PM", "05:00 PM"],
    ],
    Tue: [["02:00 PM", "04:00 PM"]],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  },
  holidays: ["Sat", "Sun"],
};

/* Format availability settings note */
const formatAvailabilityNote = () => {
  return "Holidays and break times are set in Business Availability. Update in Business Settings > Business Availability.";
};

interface Props {
  businessAvailability?: BusinessAvailability;
}

export default function ServiceForm({
  businessAvailability = defaultBusinessAvailability,
}: Props) {
  const days: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Dynamically set default serviceDays to exclude holidays
  const defaultServiceDays = days.filter(
    (day) => !businessAvailability.holidays.includes(day)
  );

  // Dynamically set default serviceHours, empty for holidays
  const defaultServiceHours = days.reduce(
    (acc, day) => ({
      ...acc,
      [day]: businessAvailability.holidays.includes(day)
        ? []
        : [["09:00 AM", "05:00 PM"]],
    }),
    {} as Record<WeekDay, [string, string][]>
  );

  const form = useForm({
    defaultValues: {
      serviceName: "",
      description: "",
      image: null,
      availabilityMode: "default",
      serviceDays: defaultServiceDays,
      serviceHours: defaultServiceHours,
      isAvailable: true,
      duration: "",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Submitted Data:", data);
  };

  return (
    <FormProvider {...form}>
      <Toaster position="top-right" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="">
          <div className="space-y-6">
            <InputField
              name="serviceName"
              label="Service Name"
              icon={UserRoundCog}
            />
            <TextAreaField
              name="description"
              label="Description"
              icon={ScrollText}
            />
            <ImageUploadField
              name="image"
              label="Cover Picture"
              icon={ImageUp}
            />
            <AvailabilityTabs name="availabilityMode" icon={CalendarClock} />
            {/* Availability Settings Note */}
            <div className="flex items-start gap-2 rounded-md bg-muted/50 py-2 px-3 text-xs text-muted-foreground max-w-md">
              <Info className="size-4 mt-0.5 flex-shrink-0" />
              <p>{formatAvailabilityNote()}</p>
            </div>
            <ServiceDaySelector
              name="serviceDays"
              businessAvailability={businessAvailability}
            />
            <ServiceHoursSelector
              name="serviceHours"
              businessBreaks={businessAvailability.breaks}
            />
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <ToggleSwitch name="isAvailable" label="Availability" />
              <DurationSelect name="duration" label="Duration:" />
            </div>
            <Button type="submit" className="w-full">
              Save
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
