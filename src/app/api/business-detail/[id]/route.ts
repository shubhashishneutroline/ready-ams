import { NextRequest, NextResponse } from "next/server";
import { getAnnouncementOrOfferById } from "@/db/announcement-offer";
import { getAppointmentById } from "@/db/appointment";
import { getBusinessDetailById } from "@/db/businessDetail";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";
import { businessDetailSchema } from "@/features/business-detail/schemas/schema";

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;
    const businessDetails = await getBusinessDetailById(id);

    if (!businessDetails) {
      return NextResponse.json(
        { message: "Business Detail with id not found!", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: businessDetails,
        success: true,
        message: "Business fetched successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch business-detail!", success: false, error: error },
      { status: 500 }
    );
  }
}

// Update an existing business detail
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params; // or Get the ID from the request body
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Business ID is required!", success: false },
        { status: 400 }
      );
    }

    const parsedData = businessDetailSchema.parse(body);

    // Log parsed data for debugging
    console.log("Parsed Data:", JSON.stringify(parsedData, null, 2));

    const business = await getBusinessDetailById(id);

    if (!business) {
      return NextResponse.json(
        { message: "Business Detail with id not found!", success: false },
        { status: 404 }
      );
    }

    // Store related services/resources before deletion
    const existingServices = await prisma.service.findMany({
      where: { businessDetailId: id },
    });

    const existingResources = await prisma.resource.findMany({
      where: { businessId: id },
    });

    const deletedBusiness = await prisma.businessDetail.delete({
      where: { id },
    });
    if (deletedBusiness) {
      const updatedBusiness = await prisma.businessDetail.create({
        data: {
          id: id,
          name: parsedData.name,
          industry: parsedData.industry,
          email: parsedData.email,
          phone: parsedData.phone,
          website: parsedData.website,
          businessRegistrationNumber: parsedData.businessRegistrationNumber,
          status: parsedData.status,

          // Handle addresses
          address: {
            create: parsedData.address.map((address) => ({
              street: address.street,
              city: address.city,
              country: address.country,
              zipCode: address.zipCode,
              googleMap: address.googleMap || "",
            })),
          },
          // Handle business availability
          businessAvailability: {
            create: parsedData.businessAvailability.map((availability) => ({
              weekDay: availability.weekDay,
              type: availability.type,
              timeSlots: {
                create: availability.timeSlots.map((slot) => ({
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                  type: slot.type,
                })),
              },
            })),
          },

          // Handle holidays
          holiday: {
            create: parsedData.holiday.map((holiday) => ({
              holiday: holiday.holiday,
              type: holiday.type,
              date: holiday.date,
            })),
          },
        },
        include: {
          address: true,
          businessAvailability: {
            include: {
              timeSlots: true,
            },
          },
          holiday: true,
        },
      });

      // Reconnect Services
      await Promise.all(
        existingServices.map((service) =>
          prisma.service.update({
            where: { id: service.id },
            data: { businessDetailId: updatedBusiness.id },
          })
        )
      );

      // Reconnect Resources
      await Promise.all(
        existingResources.map((resource) =>
          prisma.resource.update({
            where: { id: resource.id },
            data: { businessId: updatedBusiness.id },
          })
        )
      );

      if (updatedBusiness) {
        return NextResponse.json(
          {
            data: updatedBusiness,
            success: true,
            message: "Business updated successfully!",
          },
          { status: 200 }
        );
      }
    }
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
      { message: "Failed to update business!", success: false, error: error },
      { status: 500 }
    );
  }
}

// Delete a business detail
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Business ID is required!", success: false },
        { status: 400 }
      );
    }

    const existingBusiness = await getBusinessDetailById(id);

    if (!existingBusiness) {
      return NextResponse.json(
        { message: "Business not found!", success: false },
        { status: 404 }
      );
    }

    const deletedBusiness = await prisma.businessDetail.delete({
      where: { id },
    });

    if (!deletedBusiness) {
      return NextResponse.json(
        { message: "Business couldn't be deleted!", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: deletedBusiness,
        success: true,
        message: "Business deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete business!", success: false, error: error },
      { status: 500 }
    );
  }
}
