"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" // Assuming you're using a Select component
import { Ticket } from "@/features/ticket/types/types"
import { DialogTrigger } from "@radix-ui/react-dialog"
import { updateTicket } from "../api/api"
import { Toaster, toast } from "sonner"
import FormHeader from "@/components/admin/form-header"

interface TicketEditModalProps {
  ticket: Ticket | null
  onClose: () => void
}

const TicketEditModal: React.FC<TicketEditModalProps> = ({
  ticket,
  onClose,
}) => {
  const [subject, setSubject] = useState(ticket ? ticket.subject : "")

  const [ticketDescription, setTicketDescription] = useState(
    ticket ? ticket.ticketDescription : ""
  )
  const [status, setStatus] = useState(ticket ? ticket.status : "OPEN")
  const [priority, setPriority] = useState(ticket ? ticket.priority : "LOW")
  const [category, setCategory] = useState(ticket ? ticket.category : "LOW")

  useEffect(() => {
    if (ticket) {
      setSubject(ticket.subject)
      setTicketDescription(ticket.ticketDescription)
      setStatus(ticket.status)
    }
  }, [ticket])

  const handleSave = async () => {
    try {
      const updatedData = {
        subject: subject,
        ticketDescription: ticketDescription,
        category: category,
        status: status,
        priority: priority,
        assignedTo: ticket?.assignedTo ?? "",
        initiatedById: ticket?.initiatedById ?? "",
        proofFile: ticket?.proofFiles ?? null,
      }

      const updatedTicket = { ...ticket, ...updatedData }
      console.log(updatedTicket, "updatedTicket")
      const { submit } = await updateTicket(updatedTicket)
      toast.success("Customer Ticket edited successfully")

      onClose() // Close the modal after saving
    } catch (error) {
      console.error("Error creating appointment:", error)
      toast.error("Failed to create appointment")
    }
  }

  return (
    <>
      {/* <Toaster position="top-center" /> */}
      <Dialog
        open={!!ticket}
        //   onOpenChange={onClose}
      >
        <DialogContent>
          <DialogHeader>
            <FormHeader
              title="Enter Appointment Details"
              description="View and manage your upcoming appointments"
            />
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter FAQ question"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                placeholder="Enter FAQ answer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TECHNICAL">Techincal</SelectItem>
                    <SelectItem value="BILLING">Billing</SelectItem>
                    <SelectItem value="ACCOUNT">Account</SelectItem>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="SUPPORT">Support</SelectItem>
                    <SelectItem value="SECURITY">Security</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintainance</SelectItem>
                    <SelectItem value="FEEDBACK">Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="w-full" onClick={handleSave}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TicketEditModal
