import { NextResponse } from "next/server";
import { deleteImageFromStorage } from "@/lib/image-management";

export async function DELETE(req: Request) {
  const { fileId } = await req.json(); // Get the fileId from the client request

  if (!fileId) {
    return NextResponse.json(
      { message: "No fileId provided", success: false },
      { status: 400 }
    );
  }

  try {
    const result = await deleteImageFromStorage(fileId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete image", success: false, error: error },
      { status: 500 }
    );
  }
}
