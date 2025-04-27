"use client"
import TableFilterTabs from "@/components/shared/table/table-filter-tabs"
import TablePageHeader from "@/components/shared/table/table-page-header"
import { announcementColumns } from "@/features/reminder/components/announcment/columns"
import { DataTable } from "@/features/reminder/components/reminder/data-table"

import React, { useEffect, useState } from "react"
import { ticketColumns } from "./columns"
import { retieveTicket } from "../api/api"
import { fetchTicket } from "../action/action"

import { Ticket } from "@/features/ticket/types/types"
import TicketEditModal from "./ticket-modal"

const CustomerTicketPage = () => {
  const [ticketData, setTicketData] = useState<any[]>([]) // initialize with empty array
  const [loading, setLoading] = useState(true)
  const [editTicket, setEditTicket] = useState<any | null>(null)

  useEffect(() => {
    const getTickets = async () => {
      const data = await fetchTicket()
      setTicketData(data)
      setLoading(false)
    }

    getTickets()
  }, [])

  const handleModalClose = () => {
    setEditTicket(null)
  }

  if (loading) return <div>Loading tickets...</div> // optional loading UI
  return (
    <div>
      <TablePageHeader
        title="Customer Tickey"
        description="Manage and Customize your customer ticket"
      />
      <DataTable columns={ticketColumns(setEditTicket)} data={ticketData} />
      {editTicket && (
        <>
          <TicketEditModal ticket={editTicket} onClose={handleModalClose} />
        </>
      )}
    </div>
  )
}

export default CustomerTicketPage
