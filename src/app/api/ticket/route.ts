import { NextRequest, NextResponse } from "next/server"
import { ZodError } from "zod"
import { ticketSchema } from "@/features/ticket/schemas/schema"
import { Ticket } from "@/features/ticket/types/types"
import {
  Role,
  TicketCategory,
  Priority,
  TicketStatus,
} from "@/features/ticket/types/types"
import { prisma } from "@/lib/prisma"
import { getTicketById } from "@/db/ticket"


// Create a new ticket (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsedData = ticketSchema.parse(body) // Validate incoming data

    // create ticket in prisma
    const newTicket = await prisma.ticket.create({
      data: {
        userType: parsedData.userType,
        subject: parsedData.subject,
        ticketDescription: parsedData.ticketDescription,
        category: parsedData.category,
        priority: parsedData.priority,
        status: parsedData.status,
        assignedTo: parsedData.assignedTo,
        resolutionDescription: parsedData.resolutionDescription || "",
        proofFiles: parsedData.proofFiles,
        initiatedById: parsedData.initiatedById,
        userId: parsedData.userId,
      },
    })

    return NextResponse.json(
      { message: "Ticket created successfully", ticket: newTicket },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      console.log('a',error)
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    )
  }
}

// Fetch all tickets (GET)
export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany()

    if (tickets.length === 0) {
      return NextResponse.json({ error: "No tickets found" }, { status: 404 })
    }
    return NextResponse.json(tickets, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tickets" , details: error },
      { status: 500 }
    )
  }
}

// Update an existing ticket (PUT)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const parsedData = ticketSchema.parse(body) // Validate incoming data

    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: "Ticket Id required!" },
        { status: 400 }
      )
    }

    const existingTicket = await getTicketById(id)

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        userType: parsedData.userType,
        subject: parsedData.subject,
        ticketDescription: parsedData.ticketDescription,
        category: parsedData.category,
        priority: parsedData.priority,
        status: parsedData.status,
        assignedTo: parsedData.assignedTo,
        resolutionDescription: parsedData.resolutionDescription || "",
        proofFiles: parsedData.proofFiles,
        initiatedById: parsedData.initiatedById,
        userId: parsedData.userId,
      },
    })

    return NextResponse.json(
      { message: "Ticket updated successfully", ticket: updatedTicket },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" , details: error},
      { status: 500 }
    )
  }
}

// Delete a ticket (DELETE)
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "Ticket Id required!" },
        { status: 400 }
      )
    }

    const existingTicket = await getTicketById(id)

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const deletedTicket = await prisma.ticket.delete({
      where: { id },
    })

    if (!deletedTicket) {
      return NextResponse.json(
        { error: "Ticket couldn't be deleted" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Ticket deleted successfully", ticket: deletedTicket },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete ticket", details: error },
      { status: 500 }
    )
  }
}
