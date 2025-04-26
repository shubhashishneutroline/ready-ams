import { getBusinesses } from "../api/api";

export const business = await getBusinesses();

type TimeSlotType = "WORK" | "BREAK";

interface TimeSlot {
  id?: string;
  businessAvailabilityId?: string;
  startTime: string; // ISO
  endTime: string; // ISO
  type: TimeSlotType;
}

interface BusinessAvailability {
  id?: string;
  businessId: string;
  weekDay: string; // MONDAY, TUESDAY...
  type: string; // e.g. "GENERAL"
  supportBusinessDetailId?: string | null;
  timeSlots: TimeSlot[];
}

interface Holiday {
  id?: string;
  businessId: string;
  supportBusinessDetailId?: string | null;
  type: string;
  date: string; // ISO
  holiday: string;
}

interface FormData {
  businessDays: string[]; // ["Mon", "Tue", ...]
  businessHours: Record<string, { work: string[][]; break: string[][] }>;
  holidays: string[]; // ["Sat", "Sun"]
  timeZone: string;
}

function convertToISO(day: string, time: string): string {
  // Pick any fixed date, adjust to local time
  const baseDate = new Date("2025-03-01"); // default base
  const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayIndex = daysMap.indexOf(day);
  const date = new Date(baseDate);
  date.setDate(baseDate.getDate() + ((dayIndex - baseDate.getDay() + 7) % 7));
  const [hourMin, period] = time.split(" ");
  let [hour, minute] = hourMin.split(":").map(Number);
  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function transformFormData(
  formData: FormData,
  existingAvailability: BusinessAvailability[],
  businessId: string,
  type: string = "GENERAL"
): {
  businessAvailability: BusinessAvailability[];
  holiday: Holiday[];
} {
  const updatedAvailabilityMap: Record<string, BusinessAvailability> = {};

  for (const [day, { work, break: breaks }] of Object.entries(
    formData.businessHours
  )) {
    const weekDay = day.toUpperCase(); // e.g., MONDAY

    const existing = existingAvailability.find(
      (entry) => entry.weekDay === weekDay
    );

    const timeSlots: TimeSlot[] = [];

    work.forEach(([start, end]) => {
      timeSlots.push({
        type: "WORK",
        startTime: convertToISO(day, start),
        endTime: convertToISO(day, end),
      });
    });

    breaks.forEach(([start, end]) => {
      timeSlots.push({
        type: "BREAK",
        startTime: convertToISO(day, start),
        endTime: convertToISO(day, end),
      });
    });

    updatedAvailabilityMap[weekDay] = {
      id: existing?.id,
      businessId,
      supportBusinessDetailId: existing?.supportBusinessDetailId ?? null,
      weekDay,
      type,
      timeSlots: timeSlots.map((slot) => ({
        ...slot,
        businessAvailabilityId: existing?.id,
      })),
    };
  }

  const businessAvailability = Object.values(updatedAvailabilityMap);

  const holiday = formData.holidays.map((day) => {
    return {
      businessId,
      supportBusinessDetailId: null,
      type,
      date: convertToISO(day, "12:00 AM"),
      holiday: day.toUpperCase(),
    };
  });

  return {
    businessAvailability,
    holiday,
  };
}
