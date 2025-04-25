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
import { toast, Toaster } from "sonner";
import { toDate } from "date-fns";
import { updateService } from "@/features/service/api/api";

// Business availability data
export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type BusinessAvailability = {
  breaks: Record<WeekDay, [string, string][]>;
  holidays: WeekDay[];
};

// Default business availability (fallback)
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

export const toFullDay = (day: string): string => {
  const map: Record<string, string> = {
    Mon: "MONDAY",
    Tue: "TUESDAY",
    Wed: "WEDNESDAY",
    Thu: "THURSDAY",
    Fri: "FRIDAY",
    Sat: "SATURDAY",
    Sun: "SUNDAY",
  };

  return map[day] ?? "MONDAY"; // Fallback to MONDAY just in case
};

const formatAvailabilityNote = () =>
  "Holidays and break times are set in Business Availability. Update in Business Settings > Business Availability.";

interface Props {
  businessAvailability?: BusinessAvailability;
  defaultServiceHours?: Record<WeekDay, [string, string][]>;
  serviceData?: any;
  businessId?: string;
}

export default function EditServiceForm({
  businessAvailability = defaultBusinessAvailability,
  defaultServiceHours = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  }, // passed from server
  serviceData,
  businessId,
}: Props) {
  const days: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const defaultServiceDays = days.filter(
    (day) => !businessAvailability.holidays.includes(day)
  );

  console.log(serviceData.serviceAvailability, "serviceData");

  const form = useForm({
    defaultValues: {
      serviceName: serviceData?.title || "",
      description: serviceData?.description || "",
      image: null,
      availabilityMode: serviceData?.availabilityMode || "default",
      serviceDays: serviceData?.serviceDays || [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
      ],
      serviceHours: defaultServiceHours,
      isAvailable: serviceData?.isAvailable || true,
      duration: serviceData?.duration || "30",
    },
  });

  const onSubmit = async (data: {
    serviceName: string;
    description: string;
    image: File | null;
    availabilityMode: string;
    serviceDays: WeekDay[];
    serviceHours: Record<WeekDay, [string, string][]>;
    isAvailable: boolean;
    duration: string;
  }) => {
    try {
      const serviceEditedData = {
        title: data.serviceName,
        description: data.description,
        estimatedDuration: parseInt(data.duration),
        status: data.isAvailable ? "ACTIVE" : "INACTIVE",
        serviceAvailability: data.serviceDays.map((day) => ({
          weekDay: toFullDay(day),
          timeSlots: (data.serviceHours[day] || []).map(
            ([startTime, endTime]) => ({
              startTime: toDate(startTime),
              endTime: toDate(endTime),
            })
          ),
        })),
        businessId: businessId,
      };
      console.log(serviceEditedData, "servicedata inside onSubmit");
      await updateService(serviceData.id, serviceEditedData);
      toast.success("Service created successfully");
      form.reset();
    } catch (error) {
      toast.error("Failed to create service");
      console.error("Error creating service:", error);
    }
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

// "use client";

// import { useForm, FormProvider } from "react-hook-form";
// import {
//   createService,
//   getServiceById,
//   updateService,
// } from "@/features/service/api/api";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import InputField from "@/components/custom-form-fields/input-field";
// import TextAreaField from "@/components/custom-form-fields/textarea-field";
// import ImageUploadField from "@/components/custom-form-fields/image-upload";
// import AvailabilityTabs from "@/components/custom-form-fields/availability-tabs";
// import ServiceDaySelector from "@/components/custom-form-fields/serivce/service-day-selector";
// import ServiceHoursSelector from "@/components/custom-form-fields/serivce/service-hours-selector";
// import ToggleSwitch from "@/components/custom-form-fields/toggle-switch";
// import DurationSelect from "@/components/custom-form-fields/duration-select";
// import {
//   CalendarClock,
//   ImageUp,
//   ScrollText,
//   UserRoundCog,
//   Info,
// } from "lucide-react";
// import { Toaster } from "sonner";
// import { useEffect, useState } from "react";
// import { getBusinesses } from "@/features/business-detail/api/api";
// import { BusinessDetail } from "@/features/business-detail/types/types";

// import { toDate } from "@/lib/lib";
// import { useRouter, useParams } from "next/navigation";

// // Weekdays Interface for data for API
// export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

// // Business availability data
// export type BusinessAvailability = {
//   breaks: Record<WeekDay, [string, string][]>;
//   holidays: WeekDay[];
// };

// export const toFullDay = (day: string): string => {
//   const map: Record<string, string> = {
//     Mon: "MONDAY",
//     Tue: "TUESDAY",
//     Wed: "WEDNESDAY",
//     Thu: "THURSDAY",
//     Fri: "FRIDAY",
//     Sat: "SATURDAY",
//     Sun: "SUNDAY",
//   };

//   return map[day] ?? "MONDAY"; // Fallback to MONDAY just in case
// };

// type ServiceFormData = {
//   serviceDays: WeekDay[];
//   serviceHours: Record<WeekDay, [string, string][]>;
// };

// const toShortDay = (day: string): WeekDay => {
//   const map: Record<string, WeekDay> = {
//     MONDAY: "Mon",
//     TUESDAY: "Tue",
//     WEDNESDAY: "Wed",
//     THURSDAY: "Thu",
//     FRIDAY: "Fri",
//     SATURDAY: "Sat",
//     SUNDAY: "Sun",
//   };
//   return map[day] ?? "Mon";
// };

// // Default business availability (for testing, can be overridden by prop)
// const defaultBusinessAvailability: BusinessAvailability = {
//   breaks: {
//     Mon: [
//       ["12:00 PM", "01:00 PM"],
//       ["02:00 PM", "03:00 PM"],
//       ["04:00 PM", "05:00 PM"],
//     ],
//     Tue: [["02:00 PM", "04:00 PM"]],
//     Wed: [],
//     Thu: [],
//     Fri: [],
//     Sat: [],
//     Sun: [],
//   },
//   holidays: ["Sat", "Sun"],
// };

// /* Format availability settings note */
// const formatAvailabilityNote = () => {
//   return "Holidays and break times are set in Business Availability. Update in Business Settings > Business Availability.";
// };

// interface Props {
//   businessAvailability?: BusinessAvailability;
// }

// export default function EditServiceForm({
//   businessAvailability = defaultBusinessAvailability,
// }: Props) {
//   const router = useRouter();
//   const params = useParams();
//   const id = params.id as string;
//   const [businessId, setBusinessId] = useState<string | null>(null);
//   const [businessAvailabilityData, setBusinessAvailabilityData] =
//     useState<BusinessAvailability>(businessAvailability);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await getServiceById(id);
//         console.log(data, "data");
//         console.log(data.BusinessDetail, "businessDetail");

//         console.log(data, "data");
//         const transformed = transformBusinessAvailabilityData(
//           data.BusinessDetail
//         );
//         console.log(transformed, "transformed");
//         setBusinessId(data.BusinessDetail.id);

//         setBusinessAvailabilityData(transformed);
//         const formCompatibileAvailability = transformServiceAvailabilityToForm(
//           data.serviceAvailability
//         );
//         // Reset form default values based on API data
//         const newServiceDays = days.filter(
//           (day) => !transformed.holidays?.includes(day)
//         );
//         const newServiceHours = days.reduce(
//           (acc, day) => ({
//             ...acc,
//             [day]: transformed.holidays?.includes(day)
//               ? []
//               : [["09:00 AM", "05:00 PM"]],
//           }),
//           {} as Record<WeekDay, [string, string][]>
//         );
//         console.log(formCompatibileAvailability, "newServiceHours");
//         form.reset({
//           serviceName: data.title || "",
//           description: data.description || "",
//           image: null,
//           availabilityMode: "default",
//           serviceDays: newServiceDays,
//           serviceHours: newServiceHours,
//           isAvailable: data.status === "ACTIVE" ? true : false,
//           duration: data.estimatedDuration || "",
//         });
//       } catch (error) {
//         console.error("Failed to load business availability", error);
//       }
//     };

//     fetchData();
//   }, [id]);
//   const days: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//   function toShortDay(day: string): WeekDay {
//     const map: Record<string, WeekDay> = {
//       Monday: "Mon",
//       MONDAY: "Mon",
//       Tuesday: "Tue",
//       TUESDAY: "Tue",
//       Wednesday: "Wed",
//       WEDNESDAY: "Wed",
//       Thursday: "Thu",
//       THURSDAY: "Thu",
//       Friday: "Fri",
//       FRIDAY: "Fri",
//       Saturday: "Sat",
//       SATURDAY: "Sat",
//       Sunday: "Sun",
//       SUNDAY: "Sun",
//     };

//     return map[day] ?? "Mon"; // fallback just in case
//   }

//   // Dynamically set default serviceDays to exclude holidays
//   const defaultServiceDays = days.filter(
//     (day) => !businessAvailability.holidays.includes(day)
//   );

//   // Dynamically set default serviceHours, empty for holidays
//   const defaultServiceHours = days.reduce(
//     (acc, day) => ({
//       ...acc,
//       [day]: businessAvailability.holidays.includes(day)
//         ? []
//         : [["09:00 AM", "05:00 PM"]],
//     }),
//     {} as Record<WeekDay, [string, string][]>
//   );

//   const form = useForm({
//     defaultValues: {
//       serviceName: "",
//       description: "",
//       image: null,
//       availabilityMode: "default",
//       serviceDays: defaultServiceDays,
//       serviceHours: defaultServiceHours,
//       isAvailable: true,
//       duration: "",
//     },
//   });

// const onSubmit = async (data: {
//   serviceName: string;
//   description: string;
//   image: File | null;
//   availabilityMode: string;
//   serviceDays: WeekDay[];
//   serviceHours: Record<WeekDay, [string, string][]>;
//   isAvailable: boolean;
//   duration: string;
// }) => {
//   try {
//     const serviceData = {
//       title: data.serviceName,
//       description: data.description,
//       estimatedDuration: parseInt(data.duration),
//       status: data.isAvailable ? "ACTIVE" : "INACTIVE",
//       serviceAvailability: transformToServiceAvailability({
//         serviceDays: data.serviceDays,
//         serviceHours: data.serviceHours,
//       }),
//       businessId: businessId,
//     };
//     console.log(data, "data inside onSubmit");
//     console.log(serviceData, "serviceData inside onSubmit");

//     await updateService(id, serviceData);
//     toast.success("Service created successfully");
//     form.reset();
//   } catch (error) {
//     toast.error("Failed to updated service");
//     console.error("Error creating service:", error);
//   }
// };

//   // Function to change the business Availability into break and holiday
//   function transformBusinessAvailabilityData(
//     apiData: BusinessDetail
//   ): BusinessAvailability {
//     const { businessAvailability: businessAvailabilities, holiday } = apiData;

//     // Initialize breaks with empty arrays for each day
//     const breaks: Record<WeekDay, [string, string][]> = {
//       Mon: [],
//       Tue: [],
//       Wed: [],
//       Thu: [],
//       Fri: [],
//       Sat: [],
//       Sun: [],
//     };

//     // Process each availability entry from API data
//     businessAvailabilities?.forEach((availability) => {
//       const day = toShortDay(availability.weekDay); // Convert full day name to short form (Mon, Tue, etc.)

//       // Initialize the array for the day if it doesn't exist
//       if (!breaks[day]) {
//         breaks[day] = [];
//       }

//       availability.timeSlots.forEach((slot) => {
//         // Check if the type is "BREAK"
//         if (slot.type === "BREAK") {
//           const start = new Date(slot.startTime).toISOString().slice(11, 16); // Extract start time
//           const end = new Date(slot.endTime).toISOString().slice(11, 16); // Extract end time
//           breaks[day].push([start, end]); // Add the time slot to the respective day
//         }
//       });
//     });

//     // Map holidays from API data to WeekDay format
//     const holidays: WeekDay[] = holiday?.map((h) => toShortDay(h.holiday));
//     console.log(breaks, holiday, "inside the function");
//     return { breaks, holidays };
//   }

//   // Function to map the service availability to form
//   function transformServiceAvailabilityToForm(serviceAvailability: any[]) {
//     const result: Record<WeekDay, [string, string][]> = {
//       Mon: [],
//       Tue: [],
//       Wed: [],
//       Thu: [],
//       Fri: [],
//       Sat: [],
//       Sun: [],
//     };

//     serviceAvailability.forEach((availability) => {
//       const shortDay = toShortDay(availability.weekDay);
//       const slots = availability.timeSlots.map((slot: any) => {
//         const start = new Date(slot.startTime)
//           .toLocaleTimeString("en-US", {
//             hour: "2-digit",
//             minute: "2-digit",
//           })
//           .replace(/^0/, "");
//         const end = new Date(slot.endTime)
//           .toLocaleTimeString("en-US", {
//             hour: "2-digit",
//             minute: "2-digit",
//           })
//           .replace(/^0/, "");
//         return [start, end] as [string, string];
//       });

//       result[shortDay].push(...slots);
//     });

//     return result;
//   }

//   // Function to map the form day and timeslot into the onSubmit
//   function transformToServiceAvailability(formData: ServiceFormData) {
//     return formData.serviceDays
//       .filter((day) => (formData.serviceHours[day] ?? []).length > 0)
//       .map((day) => {
//         return {
//           weekDay: toFullDay(day),
//           timeSlots: formData.serviceHours[day].map(([start, end]) => ({
//             startTime: toDate(start),
//             endTime: toDate(end),
//           })),
//         };
//       });
//   }

//   const fetchData = async () => {
//     const data = await getBusinesses();
//     return data;
//   };

//   return (
//     <FormProvider {...form}>
//       <Toaster position="top-right" />
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         <div className="">
//           <div className="space-y-6">
//             <InputField
//               name="serviceName"
//               label="Service Name"
//               icon={UserRoundCog}
//             />
//             <TextAreaField
//               name="description"
//               label="Description"
//               icon={ScrollText}
//             />
//             <ImageUploadField
//               name="image"
//               label="Cover Picture"
//               icon={ImageUp}
//             />
//             <AvailabilityTabs name="availabilityMode" icon={CalendarClock} />
//             {/* Availability Settings Note */}
//             <div className="flex items-start gap-2 rounded-md bg-muted/50 py-2 px-3 text-xs text-muted-foreground max-w-md">
//               <Info className="size-4 mt-0.5 flex-shrink-0" />
//               <p>{formatAvailabilityNote()}</p>
//             </div>
//             <ServiceDaySelector
//               name="serviceDays"
//               businessAvailability={businessAvailabilityData}
//             />
//             <ServiceHoursSelector
//               name="serviceHours"
//               businessBreaks={businessAvailabilityData.breaks}
//             />
//             <div className="flex flex-col md:flex-row gap-4 justify-between">
//               <ToggleSwitch name="isAvailable" label="Availability" />
//               <DurationSelect name="duration" label="Duration:" />
//             </div>
//             <Button type="submit" className="w-full">
//               Save
//             </Button>
//           </div>
//         </div>
//       </form>
//     </FormProvider>
//   );
// }
