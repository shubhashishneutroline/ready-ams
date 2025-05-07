import ImageKit from "imagekit";
import { NextResponse } from "next/server";

// Initialize ImageKit once
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

/**
 * Deletes an image from ImageKit by fileId
 * @param fileId The ImageKit file ID to delete
 * @returns The result from ImageKit or null if fileId is empty
 */
export async function deleteImageFromStorage(fileId: string) {
  if (!fileId) {
    return null;
  }

  try {
    return await imagekit.deleteFile(fileId);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete image", success: false, error: error },
      { status: 500 }
    );
  }
}
