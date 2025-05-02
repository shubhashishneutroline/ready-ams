import { format, parseISO } from "date-fns"
export function capitalizeFirstChar(word: string) {
  if (word.length === 0) return word // Return the word if it's empty
  return word.charAt(0).toUpperCase() + word.slice(1)
}

export function capitalizeOnlyFirstLetter(str: string) {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
export const getFormErrorMsg = (errors: any, inputName: string) => {
  const message = errors?.[inputName]?.message
  return message ? message.toString() : ""
}

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format appointment date
 * @param selectedDate - ISO date string with time (e.g. "2025-04-20T00:00:00.000Z")
 * @returns Formatted date string (e.g. "20 April 2025")
 */
export const formatAppointmentDate = (selectedDate: string): string => {
  const date = parseISO(selectedDate)
  return format(date, "dd MMMM yyyy")
}

/**
 * Format appointment time
 * @param selectedTime - ISO date string with time (e.g. "2025-04-16T18:15:00.000Z")
 * @returns Formatted time string (e.g. "06:15 PM")
 */
export const formatAppointmentTime = (selectedTime: string): string => {
  const time = parseISO(selectedTime)
  return format(time, "hh:mm a")
}
