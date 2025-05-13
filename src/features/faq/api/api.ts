import { getBaseUrl } from "@/lib/baseUrl"
import axios from "axios"

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
})
export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  isActive: boolean
  order?: number
  createdAt?: string // or Date if you parse it
  updatedAt?: string // or Date
  createdById?: string
  lastUpdatedById?: string
}

async function getFAQs() {
  try {
    const { data } = await api.get("/api/faq")
    return data
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    return []
  }
}

async function getFAQById(id: string) {
  try {
    const { data } = await api.get("/api/faq", {
      params: { id },
    })
    const faq = data.find((faq: FAQ) => faq.id === id)

    return faq
  } catch (error) {
    console.error("Error fetching FAQs:", error)
    throw error
  }
}

async function createFAQ(faqData: FAQ) {
  try {
    const { data } = await api.post("/api/faq", faqData)
    return data
  } catch (error) {
    console.error("Error creating FAQs:", error)
    throw error
  }
}

async function updateFAQ(id: string, faqData: Omit<FAQ, "id">) {
  try {
    const { data } = await api.put(`/api/faq`, {
      ...faqData,
      id,
    })
    console.log(data, "inside Update func")
    return data
  } catch (error) {
    console.error("Error updating FAQS:", error)
    throw error
  }
}

async function deleteFAQ(id: string) {
  try {
    const { data } = await api.delete(`/api/faq/${id}`)
    return data
  } catch (error) {
    console.error("Error deleting FAQs:", error)
    throw error
  }
}

export { getFAQs, getFAQById, createFAQ, updateFAQ, deleteFAQ }
