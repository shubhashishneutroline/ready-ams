"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

import { Pencil, Trash2, Plus } from "lucide-react"
import FAQHeader from "./faq-header"

interface FAQ {
  id: string
  question: string
  answer: string
}

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: "1",
      question: "Will I receive a reminder for my appointment?",
      answer:
        "Yes, you will receive reminders via email, SMS, or push notification based on your settings.",
    },
    {
      id: "2",
      question: "What happens if I miss my appointment?",
      answer:
        "If you miss an appointment, you may receive a follow-up. Rescheduling policies depend on the business.",
    },
    {
      id: "3",
      question: "Can I cancel or reschedule my appointment?",
      answer:
        "Yes, you can manage your appointments from your profile. Some services may have a cancellation policy.",
    },
    {
      id: "4",
      question: "How do I check my appointment details?",
      answer:
        "Appointment details are available in the 'My Appointments' section.",
    },
    {
      id: "5",
      question: "Will I get notified about offers and announcements?",
      answer:
        "Yes, offers and announcements appear as notifications and/or as banners in the app.",
    },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")

  const handleAddFAQ = () => {
    setEditingFAQ(null)
    setNewQuestion("")
    setNewAnswer("")
    setDialogOpen(true)
  }

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq)
    setNewQuestion(faq.question)
    setNewAnswer(faq.answer)
    setDialogOpen(true)
  }

  const handleDeleteFAQ = (id: string) => {
    setFaqs(faqs.filter((faq) => faq.id !== id))
  }

  const handleSaveFAQ = () => {
    if (editingFAQ) {
      setFaqs(
        faqs.map((faq) =>
          faq.id === editingFAQ.id
            ? { ...faq, question: newQuestion, answer: newAnswer }
            : faq
        )
      )
    } else {
      setFaqs([
        ...faqs,
        {
          id: (faqs.length + 1).toString(),
          question: newQuestion,
          answer: newAnswer,
        },
      ])
    }
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <FAQHeader />

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <div className="flex justify-between items-center py-2 px-4">
              <AccordionTrigger className="flex items-center gap-2 w-full text-left">
                <span className="text-blue-600">🟢</span>
                <span className="font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditFAQ(faq)
                  }}
                >
                  <Pencil className="size-4 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteFAQ(faq.id)
                  }}
                >
                  <Trash2 className="size-4 text-red-600" />
                </Button>
              </div>
            </div>
            <AccordionContent>
              <p className="pl-6 w-full">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default FAQSection
