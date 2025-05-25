import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/features/individual-event/schemas/schema";

interface ParamsProps {
  params: Promise<{ id: string }>;
}

// GET /api/individual-event/[id]
export async function GET(req: NextRequest, { params }: ParamsProps)  {
  const { id } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: { availability: true },
    });
    if (!event) {
      return NextResponse.json({ message: "Event not found", success: false }, { status: 404 });
    }
    return NextResponse.json({ data: event, success: true });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch event", error, success: false }, { status: 500 });
  }
}

// PUT /api/individual-event/[id]
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  const { id } = await params;
  const body = await req.json();
  try {
    const parsedData = eventSchema.parse(body);
    const { availability, ...eventData } = parsedData;

    if (!availability) {
  return NextResponse.json({ message: "No availability provided", success: false }, { status: 400 });
}

    // Remove availabilities not present in the update
  const keepIds = availability
  .map(a => a.id)
  .filter((id): id is string => typeof id === "string");
    await prisma.availability.deleteMany({
      where: {
        eventId: id,
        id: { notIn: keepIds }
      }
    });

    // Update or create availabilities
  const upsertAvailabilities = (availability ?? [])
  .filter(slot => slot.id)
  .map(slot => ({
    where: { id: slot.id! },
    update: {
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: slot.duration,
    },
    create: {
      dayOfWeek: slot.dayOfWeek,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: slot.duration,
    },
  }));

const createAvailabilities = (availability ?? [])
  .filter(slot => !slot.id)
  .map(slot => ({
    dayOfWeek: slot.dayOfWeek,
    startTime: slot.startTime,
    endTime: slot.endTime,
    duration: slot.duration,
  }));

const updatedEvent = await prisma.event.update({
  where: { id },
  data: {
    ...eventData,
    availability: {
      upsert: upsertAvailabilities,
      create: createAvailabilities,
    },
  },
  include: { availability: true },
});

    return NextResponse.json({ data: updatedEvent, success: true });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update event!", error, success: false }, { status: 500 });
  }
}

// DELETE /api/individual-event/[id]
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  const { id } = await params;
  try {
    // Delete related avail'abilities first
    await prisma.availability.deleteMany({
      where: { eventId: id }
    });

    // Now delete the event
    await prisma.event.delete({ where: { id } });

    return NextResponse.json({ message: "Event deleted successfully", success: true });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete event", error, success: false }, { status: 500 });
  }
}