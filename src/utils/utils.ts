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
