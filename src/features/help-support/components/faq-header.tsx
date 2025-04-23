"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"

import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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
    <div>
      {/* Header */}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">What to Include?</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleAddFAQ}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="size-4" />
              New FAQ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFAQ ? "Edit FAQ" : "Add New FAQ"}
              </DialogTitle>
              <DialogDescription>
                {editingFAQ
                  ? "Edit the question and answer for this FAQ."
                  : "Enter the question and answer for a new FAQ."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Enter FAQ question"
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Enter FAQ answer"
                />
              </div>
              <Button onClick={handleSaveFAQ} className="w-full">
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <h4 className="text-sm italic text-gray-500">
        📌 Following queries will be displayed to users in FAQs section
      </h4>
    </div>
  )
}

export default FAQSection
