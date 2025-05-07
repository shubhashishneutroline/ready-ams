import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import sharp from "sharp";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const imageFile = formData.get("file") as File | null;

  if (!imageFile) {
    return NextResponse.json(
      { message: "No file uploaded.", success: false },
      { status: 400 }
    );
  }

  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Dynamically choose quality based on original size
  const originalSizeKB = buffer.length / 1024;
  let jpegQuality = 80;
  if (originalSizeKB < 20) jpegQuality = 60; // Lower quality for tiny images

  // Compress image using sharp
  let compressedBuffer;
  try {
    compressedBuffer = await sharp(buffer)
      .resize({ width: 1024, withoutEnlargement: true }) // Prevent upscaling
      .jpeg({ quality: jpegQuality, mozjpeg: true }) // Use mozjpeg for smaller files
      .toBuffer();
  } catch (err) {
    return NextResponse.json(
      { message: "Image processing failed", success: false },
      { status: 500 }
    );
  }

  // If compressed image is larger, use original
  if (compressedBuffer.length > buffer.length) {
    compressedBuffer = buffer;
  }
  try {
    const response = await imagekit.upload({
      file: compressedBuffer,
      fileName: imageFile.name,
      folder: "appointments", // optional
    });
    
    return NextResponse.json({
      success: true,
      data: response,
      message: "Image uploaded successfully",
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Upload failed", success: false, error: err },
      { status: 500 }
    );
  }
}
