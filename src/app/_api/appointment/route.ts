import { NextRequest, NextResponse } from "next/server"
import { appointmentSchema } from "@/features/appointment/schemas/schema"
import {
  Appointment,
  AppointmentStatus,
} from "@/features/appointment/types/types"
import { ZodError } from "zod"
import { prisma } from "@/lib/prisma"
import { getAppointmentById } from "@/db/appointment"

// Dummy Data Example

const appointments: Appointment[] = [
  {
    id: "2",
    customerName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    status: AppointmentStatus.SCHEDULED, // Required
    userId: "user123", // Optional (if booking for themselves)
    bookedById: "user456", // Optional (if someone else booked)
    serviceId: "srv789", // Required
    selectedDate: "2025-04-10T10:00:00Z", // Required (ISO date string)
    selectedTime: "2025-04-10T10:00:00Z", // Required (ISO time string)
    message: "Looking forward to the service!", // Optional
    isForSelf: true, // Required
    createdById: "user123", // Required (ID of the user who created the appointment)
    resourceId: "res987", // Optional (if relevant)
  },
]

//create new appointment
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json()

    // Validate the request body
    const parsedData = appointmentSchema.parse(body)

    // Create a new appointment in prisma
    const newAppointment = await prisma.appointment.create({
      data: {
        customerName: parsedData.customerName,
        email: parsedData.email,
        phone: parsedData.phone,
        status: parsedData.status,
        userId: parsedData.userId,
        bookedById: parsedData.bookedById,
        serviceId: parsedData.serviceId,
        selectedDate: parsedData.selectedDate,
        selectedTime: parsedData.selectedTime,
        message: parsedData.message,
        isForSelf: parsedData.isForSelf,
        createdById: parsedData.createdById,
        resourceId: parsedData.resourceId,
      },
    })

    if (!newAppointment) {
      return NextResponse.json(
        { error: "Failed to create appointment" },
        { status: 500 }
      )
    }

    // Return a success response
    return NextResponse.json(
      {
        message: "Appointment booked successfully",
        appointment: newAppointment,
      },
      { status: 201 }
    )
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors[0].message },
        { status: 400 }
      )
    }
    // Handle other errors
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    )
  }
}

//read all appointment
export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany()
    if (appointments.length === 0) {
      return NextResponse.json(
        { error: "No appointments found" },
        { status: 404 }
      )
    }

    return NextResponse.json(appointments, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch appointments",
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}

//edit or  update appointment
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const parsedData = appointmentSchema.parse(body)

    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: "Appointment Id required!" },
        { status: 400 }
      )
    }
    // Find the service by ID
    const existingAppointment = await getAppointmentById(id)

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    // update appointment in prisma database
    const updatedService = await prisma.appointment.update({
      where: { id },
      data: {
        customerName: parsedData.customerName,
        email: parsedData.email,
        phone: parsedData.phone,
        status: parsedData.status,
        userId: parsedData.userId,
        bookedById: parsedData.bookedById,
        serviceId: parsedData.serviceId,
        selectedDate: parsedData.selectedDate,
        selectedTime: parsedData.selectedTime,
        message: parsedData.message,
        isForSelf: parsedData.isForSelf,
        createdById: parsedData.createdById,
        resourceId: parsedData.resourceId,
      },
    })

    if (!updatedService) {
      return NextResponse.json(
        { error: "Failed to update appointment" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Appointment updated successfully", service: updatedService },
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
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    )
  }
}

//delete appointment
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    const appIndex = appointments.findIndex((app) => app.id === id) //replace with prisma id logic

    if (appIndex === -1) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    appointments.splice(appIndex, 1)

    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete appointment",
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
