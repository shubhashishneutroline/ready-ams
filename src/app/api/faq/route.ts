import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { faqSchema } from "@/features/faq/schemas/schema";
import { prisma } from "@/lib/prisma";
import { getFAQSById } from "@/db/faq";

// POST: Create new FAQ
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedData = faqSchema.parse(body);

    // Create a new FAQ entry in prisma
    const newFAQ = await prisma.fAQ.create({
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
      {
        data: newFAQ,
        success: true,
        message: "FAQ created successfully!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
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
      { message: "Failed to create faq!", success: false, error: error },
      { status: 500 }
    );
  }
}

// GET: Retrieve all FAQs
export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany();

    // Check if there are any FAQs
    if (faqs.length === 0) {
      return NextResponse.json(
        { message: "No FAQs found!", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data: faqs, success: true, message: "Faqs fetched successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch FAQs!", success: false, error: error },
      { status: 500 }
    );
  }
}

