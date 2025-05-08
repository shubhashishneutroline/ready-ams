import { NextRequest, NextResponse } from "next/server"

import { getUserById } from "@/db/user"
import { ZodError } from "zod"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import * as bcrypt from "bcryptjs"
import { z } from "zod"
import { userSchema } from "@/app/(admin)/customer/_schema/customer"

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json(
        { message: "User with id not found!", success: false },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        data: user,
        success: true,
        message: "User fetched successfully!",
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch user!", success: false, error: error },
      { status: 500 }
    )
  }
}

// PUT: Update an existing User
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const body = await req.json()

    const parsedData = userSchema.parse(body)

    const { password } = parsedData

    // Find the user by email (in a real scenario, use a unique identifier like userId)
    const existingUser = await getUserById(id)

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found!", success: false },
        { status: 404 }
      )
    }

    const updateData: Prisma.UserUpdateInput = {
      email: parsedData.email,
      name: parsedData.name,
      phone: parsedData.phone,
      address: parsedData.address && {
        update: {
          street: parsedData.address.street,
          city: parsedData.address.city,
          country: parsedData.address.country,
          zipCode: parsedData.address.zipCode,
        },
      },
      role: parsedData.role,
    }

    // Only hash and set password if a new one is provided
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10)
      updateData.password = hashedPassword
    }

    // Update the user in primsa
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(
      {
        data: updatedUser,
        success: true,
        message: "User updated successfully!",
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed!",
          error: error.errors[0].message,
          success: false,
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { message: "Failed to update user!", success: false, error: error },
      { status: 500 }
    )
  }
}

// DELETE: Delete a User
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    const existingUser = await getUserById(id)

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found!", success: false },
        { status: 404 }
      )
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "User deleted successfully!", success: false },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed!",
          error: error.errors[0].message,
          success: false,
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      {
        message: "Failed to delete user!",
        success: false,
        error: error,
      },
      { status: 500 }
    )
  }
}
