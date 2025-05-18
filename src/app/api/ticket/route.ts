import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ticketSchema } from "@/features/ticket/schemas/schema";
import { Ticket } from "@/features/ticket/types/types";
import {
  Role,
  TicketCategory,
  Priority,
  TicketStatus,
} from "@/features/ticket/types/types";
import { prisma } from "@/lib/prisma";
import { getTicketById } from "@/db/ticket";

// Create a new ticket (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = ticketSchema.parse(body); // Validate incoming data

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
    });

    return NextResponse.json(
      {
        data: newTicket,
        success: true,
        message: "Ticket created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed!",
          error: error.errors[0].message,
          success: false,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create ticket!", success: false, error: error },
      { status: 500 }
    );
  }
}

// Fetch all tickets (GET)
export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany();

    if (tickets.length === 0) {
      return NextResponse.json(
        { message: "No tickets found!", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: tickets,
        success: true,
        message: "Tickets fetched successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch tickets!", success: false, error: error },
      { status: 500 }
    );
  }
}

