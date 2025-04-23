import { NextRequest, NextResponse } from "next/server";
import { ResourceSchema } from "@/features/resource/schemas/schema"; // Adjust the path accordingly
import { ZodError } from "zod";
import { Resource } from "@/features/resource/types/types";

//this array should match the resource interface format while using prisma logic
//  currently it is linked in too many business interface so i am commenting Resource[]
//you can check format in  resource types
const resources/* : Resource[]  */ = {
    id: "12345",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main Street, Anytown, USA",
    isActive: true,
  };

// **CREATE Resource**
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = ResourceSchema.parse(body);

    // User prisma logic 
    const newResource = { ...parsedData, id: String(Date.now()) };

    return NextResponse.json(
      { message: "Resource created successfully", resource: newResource },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// **READ all Resources**
export async function GET() {
  try {

    //use prisma logic
    
    /* if (resources.length === 0) {
      return NextResponse.json({ error: "No resources found" }, { status: 404 });
    } */
    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}

// **UPDATE Resource**
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = ResourceSchema.parse(body);

    const { id } = body;

    //use prisma
    /* const index = resources.findIndex((res) => res.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    } */


    return NextResponse.json(
      { message: "Resource updated successfully",},
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// **DELETE Resource**
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    //use prisma logic

   /*  const index = resources.findIndex((res) => res.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    resources.splice(index, 1); */

    return NextResponse.json({ message: "Resource deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete resource" }, { status: 500 });
  }
}
