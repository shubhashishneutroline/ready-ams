import { individualSchema } from "@/features/individual/schemas/schema";
import { Individual } from "@/features/individual/types/types";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

// GET endpoint to fetch a single individual by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {message: "Individual ID is required!",success:false },
        { status: 400 }
      );
    }

    // Fetch the individual profile
    const individual = await prisma.individual.findUnique({
      where: { id: id },
      include: {
        // Include related data if needed
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            // Add other user fields you want to include
          },
        },
        // Optionally include events
        events: true,
      },
    });

    if (!individual) {
      return NextResponse.json(
        {message: "Individual not found!",success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Individual profile retrieved successfully!",
        data: individual,
        success: true
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching individual!",error: error, success: false },
      { status: 500 }
    );
  }
}

//PUT request using params
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = "cmaemhw500006vdawrh8umbqp"; // fetch userId from clerk authentication
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found!", success: false },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Individual ID is required!", success: false },
        { status: 400 }
      );
    }

    const body = await req.json();
    const parsedData = individualSchema.parse(body);

    // Fetch the existing individual to check if it exists
    const existingIndividual = await prisma.individual.findUnique({
      where: { id: id },
    });

    if (!existingIndividual) {
      return NextResponse.json(
        { message: "Individual profile not found!", success: false },
        { status: 404 }
      );
    }

    // Verify that the user owns this profile
    if (existingIndividual.userId !== userId) {
      return NextResponse.json(
        {
          message: "Unauthorized: You cannot update this profile!",
          success: false,
        },
        { status: 403 }
      );
    }

    // Update individual profile
    const updatedIndividual: Individual = await prisma.individual.update({
      where: { id: id },
      data: {
        bio: parsedData.bio,
        position: parsedData.position,
        profileImage: parsedData.profileImage,
        country: parsedData.country,
        timezone: parsedData.timezone,
      },
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully!",
        data: updatedIndividual,
        success: true,
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
      { message: "Failed to update profile!", error: error, success: false },
      { status: 500 }
    );
  }
}

//delete individual
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = "cmaemhw500006vdawrh8umbqp"; // Get from your auth system
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized!", success: false },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Individual Id is required!", success: false },
        { status: 400 }
      );
    }

    // Fetch the existing individual to check if it exists
    const existingIndividual = await prisma.individual.findUnique({
      where: { id: id },
    });

    if (!existingIndividual) {
      return NextResponse.json(
        { message: "Individual not found!", success: false },
        { status: 404 }
      );
    }

    // Verify ownership
    if (existingIndividual.userId !== userId) {
      return NextResponse.json(
        { message: "You don't have permission to delete this record!", success: false },
        { status: 403 }
      );
    }

    // Delete the individual profile
    const deletedIndividual = await prisma.individual.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { message: "Individual profile deleted successfully!", data: deletedIndividual, success:true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete individual profile!", success: false, error: error },
      { status: 500 }
    );
  }
}
