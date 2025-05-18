import { NextRequest, NextResponse } from "next/server";
import { getAnnouncementOrOfferById } from "@/db/announcement-offer";
import { getAppointmentById } from "@/db/appointment";
import { getTicketById } from "@/db/ticket";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { ticketSchema } from "@/features/ticket/schemas/schema";

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;
    const ticket = await getTicketById(id);

    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket with id not found!", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { data: ticket, success: true, message: "Ticket fetched successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch ticket!", success: false, error: error },
      { status: 500 }
    );
  }
}

// Update an existing ticket (PUT)
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Ticket Id required!", success: false },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsedData = ticketSchema.parse(body); // Validate incoming data

    const existingTicket = await getTicketById(id);

    if (!existingTicket) {
      return NextResponse.json(
        { message: "Ticket not found!", success: false },
        { status: 404 }
      );
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
    });

    return NextResponse.json(
      {
        data: updatedTicket,
        success: true,
        message: "Ticket updated successfully!",
      },
      { status: 200 }
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
      { message: "Failed to update ticket!", success: false, error: error },
      { status: 500 }
    );
  }
}

// Delete a ticket (DELETE)
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Ticket Id required!", success: false },
        { status: 400 }
      );
    }

    const existingTicket = await getTicketById(id);

    if (!existingTicket) {
      return NextResponse.json(
        { message: "Ticket not found!", success: false },
        { status: 404 }
      );
    }

    const deletedTicket = await prisma.ticket.delete({
      where: { id },
    });

    if (!deletedTicket) {
      return NextResponse.json(
        { message: "Ticket couldn't be deleted!", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: deletedTicket,
        success: true,
        message: "Ticket deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete ticket!", success: false, error: error},
      { status: 500 }
    );
  }
}
