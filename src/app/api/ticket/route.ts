import { ticketSchema } from "@/features/ticket/schemas/schema";
import { Ticket, TicketCategory } from "@/features/ticket/types/types";
import { Role, Priority, TicketStatus } from "@prisma/client";

import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";


let tickets: Ticket[] = [
    {
      id: "1",
      userType: Role.USER,
      subject: "Unable to log in",
      ticketDescription:
        "I cannot log in to my account despite entering the correct credentials.",
      category: TicketCategory.ACCOUNT,
      priority: Priority.HIGH,
      status: TicketStatus.OPEN,
      assignedTo: "admin123",
      resolutionDescription: null, // Not resolved yet
      proofFiles: null, // No files uploaded
      initiatedById: "user001",
      userId: "user001",
    },
    {
      id: "2",
      userType: Role.ADMIN,
      subject: "Billing issue for subscription",
      ticketDescription:
        "Customer was charged twice for the same subscription. Please investigate.",
      category: TicketCategory.BILLING,
      priority: Priority.MEDIUM,
      status: TicketStatus.IN_PROGRESS,
      assignedTo: "support001",
      resolutionDescription: null, // Not resolved yet
      proofFiles: "http://example.com/proof/screenshot1.png", // Example proof file
      initiatedById: "admin123",
      userId: "customer456",
    },
    {
      id: "3",
      userType: Role.CUSTOMER,
      subject: "Feedback on new feature",
      ticketDescription:
        "I would like to provide feedback about the new search feature that was rolled out last week.",
      category: TicketCategory.FEEDBACK,
      priority:  Priority.LOW,
      status: TicketStatus.RESOLVED,
      assignedTo: null, // No agent assigned (resolved without assignment)
      resolutionDescription:
        "The feedback was reviewed and is being considered for future updates.",
      proofFiles: null, // No files uploaded
      initiatedById: "user789",
      userId: "user789",
    },
    {
      id: "4",
      userType: Role.ADMIN,
      subject: "Account security breach",
      ticketDescription:
        "It seems like someone attempted to breach a user's account. Please review the logs.",
      category: TicketCategory.SECURITY,
      priority: Priority.URGENT,
      status: TicketStatus.CLOSED,
      assignedTo: "security001",
      resolutionDescription:
        "The breach attempt was thwarted, and the user account was secured.",
      proofFiles: "http://example.com/proof/securityLog.pdf", // Example proof file
      initiatedById: "admin234",
      userId: "user123",
    },
  ];

  // Create a new ticket (POST)
export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const parsedData = ticketSchema.parse(body); // Validate incoming data
  
      // Generate a unique ID for the new ticket
      const newTicket = {
        ...parsedData,
        id: String(Date.now()), // Unique ID (using timestamp)
      };
  
      tickets.push(newTicket); // Add new ticket to the array
  
      return NextResponse.json(
        { message: "Ticket created successfully", ticket: newTicket },
        { status: 201 }
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.errors[0].message },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  
  // Fetch all tickets (GET)
  export async function GET() {
    try {
      if (tickets.length === 0) {
        return NextResponse.json({ error: "No tickets found" }, { status: 404 });
      }
      return NextResponse.json(tickets, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
    }
  }
  
  // Update an existing ticket (PUT)
  export async function PUT(req: NextRequest) {
    try {
      const body = await req.json();
      const parsedData = ticketSchema.parse(body); // Validate incoming data
  
      const { id } = body;
      const ticketIndex = tickets.findIndex((ticket) => ticket.id === id);
  
      if (ticketIndex === -1) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
      }
  
      const updatedTicket = { ...tickets[ticketIndex], ...parsedData };
      tickets[ticketIndex] = updatedTicket;
  
      return NextResponse.json(
        { message: "Ticket updated successfully", ticket: updatedTicket },
        { status: 200 }
      );
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed", details: error.errors[0].message },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
  
  // Delete a ticket (DELETE)
  export async function DELETE(req: NextRequest) {
    try {
      const { id } = await req.json();
  
      const ticketIndex = tickets.findIndex((ticket) => ticket.id === id);
  
      if (ticketIndex === -1) {
        return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
      }
  
      tickets.splice(ticketIndex, 1); // Remove the ticket from the array
  
      return NextResponse.json({ message: "Ticket deleted successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
    }
  }