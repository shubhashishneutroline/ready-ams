"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import FAQHeader from "./faq-header";
import {
  createFAQ,
  deleteFAQ,
  getFAQs,
  updateFAQ,
} from "@/features/faq/api/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQSection = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const fetchFaqs = async () => {
    try {
      const fetchedFaqs = await getFAQs();
      setFaqs(fetchedFaqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAddFAQ = () => {
    setEditingFAQ(null);
    setNewQuestion("");
    setNewAnswer("");
    setDialogOpen(true);
  };

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
    setDialogOpen(true);
  };

  const handleDeleteFAQ = async (faq: any) => {
    try {
      console.log(faq, "inside delete");
      const deleted = await deleteFAQ(faq);
      setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq.id !== faq.id));
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  const handleSaveFAQ = async () => {
    const faqData = {
      question: newQuestion,
      answer: newAnswer,
      category: "SUPPORT",
      isActive: true,
      lastUpdatedById: "cm9p5clgp0008vdfwn01046su",
      createdById: "cm9p5clgp0008vdfwn01046su",
    };

    try {
      if (editingFAQ) {
        const updated = await updateFAQ(editingFAQ.id, faqData);
      } else {
        const created = await createFAQ({ id: "", ...faqData });
      }
      setDialogOpen(false);
      setNewQuestion("");
      setNewAnswer("");
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  return (
    <div className="space-y-6">
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
                    e.stopPropagation();
                    handleEditFAQ(faq);
                  }}
                >
                  <Pencil className="size-4 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFAQ(faq);
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
  );
};

export default FAQSection;
