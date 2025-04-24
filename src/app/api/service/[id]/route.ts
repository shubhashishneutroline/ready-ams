import { NextRequest, NextResponse } from "next/server"
import { getAnnouncementOrOfferById } from "@/db/announcement-offer"
import { getAppointmentById } from "@/db/appointment"
import { getServiceById } from "@/db/service"
import { prisma } from "@/lib/prisma"
import { ZodError } from "zod"
import { serviceSchema } from "@/features/service/schemas/schema"

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const announcement = await getServiceById(id)

    if (!announcement) {
      return NextResponse.json(
        { error: "Service with id not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(announcement, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch service" },
      { status: 500 }
    )
  }
}

//edit or  update service
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Service Id required!" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const parsedData = serviceSchema.parse(body)

    const existingService = await getServiceById(id)

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // update service
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title: parsedData.title,
        description: parsedData.description,
        estimatedDuration: parsedData.estimatedDuration,
        status: parsedData.status,
        businessDetailId: parsedData.businessDetailId,
        serviceAvailability: {
          create: parsedData.serviceAvailability?.map((availability) => ({
            weekDay: availability.weekDay,
            timeSlots: {
              create: availability.timeSlots?.map((timeSlot) => ({
                startTime: timeSlot.startTime,
                endTime: timeSlot.endTime,
              })),
            },
          })),
        },
      },
    })

    return NextResponse.json(
      { message: "Service updated successfully", service: updatedService },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    )
  }
}

//delete service
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Service Id required!" },
        { status: 400 }
      )
    }

    const existingService = await getServiceById(id)

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    const deletedService = await prisma.service.delete({
      where: { id },
    })

    if (!deletedService) {
      return NextResponse.json(
        { error: "Service could not be deleted" },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete service", message: error },
      { status: 500 }
    )
  }
}
