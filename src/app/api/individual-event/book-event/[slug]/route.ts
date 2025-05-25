import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ParamsProps {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  const { slug } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: { slug }, // Search by slug
      include: { availability: true, individual: true, user: true },
    });
    if (!event) {
      return NextResponse.json(
        { message: "Event not found", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: event, success: true });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch event", error, success: false },
      { status: 500 }
    );
  }
}
