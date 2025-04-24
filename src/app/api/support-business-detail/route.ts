import { NextRequest, NextResponse } from "next/server";
import { SupportBusinessDetailSchema } from "@/features/support-detail/schemas/schema"; // Adjust the path accordingly
import { ZodError } from "zod";
import { SupportBusinessDetail } from "@/features/support-detail/types/types";
import { AvailabilityType, Holiday, HolidayType, WeekDays } from "@/features/business-detail/types/types";

// Dummy database for support business details
let supportDetails: SupportBusinessDetail[] = [
    {
        id: "support-id-123",
        supportBusinessName: "Tech Solutions Support",
        supportEmail: "support@techsolutions.com",
        supportPhone: "+977 1 4002100",
        supportAddress: "789 Support Street, Kathmandu, Nepal",
        supportGoogleMap: "https://goo.gl/maps/5678abc",
        supportAvailability: [
          {
            id: "support-availability-id-1",
            weekDay: WeekDays.MONDAY,
            type: AvailabilityType.SUPPORT, // Only 'SUPPORT' for Support-specific Availability
            timeSlots: [
              {
                id: "support-time-slot-id-1",
                startTime: "2025-03-01T08:00:00Z",
                endTime: "2025-03-01T16:00:00Z",
              },
            ],
          },
        ],
        supportHoliday: [
          {
            id: "support-holiday-id-1",
            holiday:  WeekDays.SUNDAY,
            type: HolidayType.SUPPORT, // Only 'SUPPORT' for Support Holidays
            date: "2025-04-20T00:00:00Z",
          },
        ],
        businessId: "business-id-123", // Link to the primary business
      }
];


  
  

// **CREATE SupportBusinessDetail**
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = SupportBusinessDetailSchema.parse(body);

    // User prisma logic
   

    return NextResponse.json(
      { message: "Support Business Detail created successfully", },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// **READ all SupportBusinessDetails**
export async function GET() {
  try {
    if (supportDetails.length === 0) {
      return NextResponse.json({ error: "No support details found" }, { status: 404 });
    }
    return NextResponse.json(supportDetails, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch support details" }, { status: 500 });
  }
}

// **UPDATE SupportBusinessDetail**
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = SupportBusinessDetailSchema.parse(body);

    const { businessId } = body;
    
    //Use prisma logic
    const index = supportDetails.findIndex((detail) => detail.businessId === businessId);

    if (index === -1) {
      return NextResponse.json({ error: "Support Business Detail not found" }, { status: 404 });
    }

   

    return NextResponse.json(
      { message: "Support Business Detail updated successfully", supportDetail: supportDetails[index] },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// **DELETE SupportBusinessDetail**
export async function DELETE(req: NextRequest) {
  try {
    const { businessId } = await req.json();

    const index = supportDetails.findIndex((detail) => detail.businessId === businessId);

    if (index === -1) {
      return NextResponse.json({ error: "Support Business Detail not found" }, { status: 404 });
    }

    supportDetails.splice(index, 1);

    return NextResponse.json({ message: "Support Business Detail deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete support detail" }, { status: 500 });
  }
}
