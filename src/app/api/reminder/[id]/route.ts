import { NextRequest, NextResponse } from "next/server";
import { getAnnouncementOrOfferById } from "@/db/announcement-offer";
import { getAppointmentById } from "@/db/appointment";
import { getReminderById } from "@/db/reminder";
import { ReminderSchema } from "@/features/reminder/schemas/schema";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { syncNewReminderOffset } from "@/lib/appointment";

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;
    const reminder = await getReminderById(id);

    if (!reminder) {
      return NextResponse.json(
        { message: "Reminder with id not found!", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
         reminder,
        success: true,
        message: "Reminder fetched successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch reminder!", success: false, error: error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Reminder Id required!", success: false },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsedData = ReminderSchema.parse(body);

    const existingReminder = await getReminderById(id);

    if (!existingReminder) {
      return NextResponse.json(
        { message: "Reminder not found!", success: false },
        { status: 404 }
      );
    }

    const existingOffsets = await prisma.reminderOffset.findMany({
      where: { reminderId: id },
      select: { id: true },
    });
    const offsetIds = existingOffsets.map((offset) => offset.id);

    // Delete related AppointmentReminderOffsets
    await prisma.appointmentReminderOffset.deleteMany({
      where: {
        reminderOffsetId: { in: offsetIds },
      },
    });

    //  Delete existing nested records
    await prisma.notification.deleteMany({ where: { reminderId: id } });
    await prisma.reminderOffset.deleteMany({ where: { reminderId: id } });

    // Update reminder and recreate nested records
    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: {
        type: parsedData.type,
        title: parsedData.title,
        description: parsedData.description,
        message: parsedData.message,
        services: {
          set: [], // clear existing
          connect: parsedData.services.map((serviceId) => ({ id: serviceId })),
        },
        notifications: {
          create: parsedData.notifications.map((notification) => ({
            method: notification.method,
          })),
        },
        reminderOffset: {
          create: parsedData.reminderOffset.map((offset) => ({
            sendOffset: offset.sendOffset,
            sendBefore: offset.sendBefore,
          })),
        },
      },
      include: {
        services: true,
        notifications: true,
        reminderOffset: true,
      },
    });

    for (const offset of updatedReminder.reminderOffset) {
      await syncNewReminderOffset(offset.id);
    }

    return NextResponse.json(
      {
        reminder: updatedReminder,
        success: true,
        message: "Reminder updated successfully!",
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
      { message: "Failed to update reminder!", success: false, error: error },
      { status: 500 }
    );
  }
}

// Delete a reminder
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Reminder Id required!", success: false },
        { status: 400 }
      );
    }

    const existingReminder = await getReminderById(id);

    if (!existingReminder) {
      return NextResponse.json(
        { message: "Reminder not found!", success: false },
        { status: 404 }
      );
    }

    const deletedReminder = await prisma.reminder.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        data: deletedReminder,
        success: true,
        message: "Reminder deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete reminder!", success: false, error: error },
      { status: 500 }
    );
  }
}
