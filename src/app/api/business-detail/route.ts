import { NextRequest, NextResponse } from "next/server";
import { businessDetailSchema } from "@/features/business-detail/schemas/schema";
import { BusinessDetail } from "@/features/business-detail/types/types";
import { ZodError } from "zod";
import {
  BusinessStatus,
  WeekDays,
  HolidayType,
  AvailabilityType,
} from "@/features/business-detail/types/types";

const businessDetails: BusinessDetail[] = [
  {
    id: "business-id-123",
    name: "Tech Solutions Pvt. Ltd.",
    industry: "IT Services",
    email: "contact@techsolutions.com",
    phone: "+977 1 4002000",
    website: "https://www.techsolutions.com",
    businessRegistrationNumber: "BRN-12345",
    status: BusinessStatus.ACTIVE,
    address: [
      {
        id: "address-id-1",
        street: "123 Main Street",
        city: "Kathmandu",
        country: "Nepal",
        zipCode: "44600",
        googleMap: "https://goo.gl/maps/1234xyz",
      },
      {
        id: "address-id-2",
        street: "456 Secondary Street",
        city: "Pokhara",
        country: "Nepal",
        zipCode: "33700",
        googleMap: "https://goo.gl/maps/abcd1234",
      },
    ],
    businessAvailability: [
      {
        id: "availability-id-1",
        weekDay: WeekDays.MONDAY,
        type: AvailabilityType.GENERAL, // Only 'GENERAL' for Business
        timeSlots: [
          {
            id: "time-slot-id-1",
            startTime: "2025-03-01T09:00:00Z",
            endTime: "2025-03-01T17:00:00Z",
          },
          {
            id: "time-slot-id-2",
            startTime: "2025-03-02T09:00:00Z",
            endTime: "2025-03-02T17:00:00Z",
          },
        ],
      },
    ],
    holiday: [
      {
        id: "holiday-id-1",
        holiday: WeekDays.SATURDAY,
        type: HolidayType.GENERAL, // Only 'GENERAL' for Business Holidays
        date: "2025-04-15T00:00:00Z",
      },
    ],
  },
];

// Create a new business detail
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = businessDetailSchema.parse(body);

    // Use prisma logic
   


    return NextResponse.json(
      { message: "Business created successfully" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fetch all business details
export async function GET() {
  try {
    if (businessDetails.length === 0) {
      return NextResponse.json(
        { error: "No business details found" },
        { status: 404 }
      );
    }
    return NextResponse.json(businessDetails, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch business details" },
      { status: 500 }
    );
  }
}

// Update an existing business detail
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = businessDetailSchema.parse(body);

    //replace with prisma logic
    const { id } = body;
    const businessIndex = businessDetails.findIndex(
      (business) => business.id === id
    );

    if (businessIndex === -1) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    
    //use prisma logic to update in db
      

    return NextResponse.json(
      { message: "Business updated successfully",  },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a business detail
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    //replace with prisma logic
    const businessIndex = businessDetails.findIndex(
      (business) => business.id === id
    );

    if (businessIndex === -1) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    businessDetails.splice(businessIndex, 1);

    return NextResponse.json(
      { message: "Business deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete business" },
      { status: 500 }
    );
  }
}
function generateId(): any {
    throw new Error("Function not implemented.");
}

