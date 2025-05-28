import { NextRequest, NextResponse } from "next/server";
import { getFAQSById } from "@/db/faq";
import { faqSchema } from "@/features/faq/schemas/schema";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;
    const faq = await getFAQSById(id);

    if (!faq) {
      return NextResponse.json(
        { message: "FAQ with id not found!", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: faq,
        success: true,
        message: "FAQ fetched successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch faq!", success: false, error: error },
      { status: 500 }
    );
  }
}

// PUT: Update an existing FAQ
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "FAQ Id required!", success: false },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsedData = faqSchema.parse(body);

    // Find the FAQ by ID
    const existingFAQ = await getFAQSById(id);

    if (!existingFAQ) {
      return NextResponse.json(
        { message: "FAQ not found!", success: false },
        { status: 404 }
      );
    }

    // Update the FAQ entry in prisma
    const updatedFAQ = await prisma.fAQ.update({
      where: { id },
      data: {
        question: parsedData.question,
        answer: parsedData.answer,
        category: parsedData.category,
        isActive: parsedData.isActive,
        order: parsedData.order,
        lastUpdatedById: parsedData.lastUpdatedById,
        createdById: parsedData.createdById,
      },
    });

    return NextResponse.json(
      { data: updatedFAQ, success: true, message: "FAQ updated successfully!" },
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
      { message: "Failed to update FAQ!", success: false, error: error },
      { status: 500 }
    );
  }
}

// DELETE: Delete an FAQ
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "FAQ Id required!", success: false },
        { status: 400 }
      );
    }

   

    // Find the FAQ by ID
    const existingFAQ = await getFAQSById(id);

    if (!existingFAQ) {
      return NextResponse.json(
        { message: "FAQ not found!", success: false },
        { status: 404 }
      );
    }
    const deletedFAQ = await prisma.fAQ.delete({
      where: { id },
    });

    if (!deletedFAQ) {
      return NextResponse.json(
        { message: "FAQ couldn't be deleted!", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: deletedFAQ, success: true, message: "FAQ deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete FAQ!", success: false, error: error },
      { status: 500 }
    );
  }
}
