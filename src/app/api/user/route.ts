import { NextRequest, NextResponse } from "next/server"
import { userSchema } from "@/features/customer/schemas/schema"
import { User, Role } from "@/features/customer/types/types"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { getUserByEmail, getUserById } from "@/db/user"

let users: User[] = [
  {
    id: "1",
    email: "john.doe@example.com",
    password: "SecurePass123!",
    name: "John Doe",
    phone: "+1234567890",
    role: Role.USER,
    address: {
      street: "123 Main St",
      city: "New York",
      country: "USA",
      zipCode: "10001",
    },
  },
]

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as User
    const { email, password, name, phone, address, role } =
      userSchema.parse(body)

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists!" },
        { status: 400 }
      )
    }

    // TODO: Hash password here (e.g., await bcrypt.hash(password, 10))

    const newUser = await prisma.user.create({
      data: {
        email,
        password, // Replace with hashedPassword later
        name,
        phone,
        address: address ? { create: { ...address } } : undefined,
        role,
      },
    })

    return NextResponse.json(
      { message: "User created successfully", data: newUser },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", message: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error", message: String(error) },
      { status: 500 }
    )
  }
}

// GET: Retrieve all Users
export async function GET() {
  try {
    // get all users
    const users = await prisma.user.findMany()

    // Check if there are any users
    if (users.length === 0) {
      return NextResponse.json({ error: "No users found!" }, { status: 404 })
    }

    // Return the users
    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    // Handle errors
    return NextResponse.json(
      { error: "Failed to fetch users!" },
      { status: 500 }
    )
  }
}

// PUT: Update an existing User
export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as User

    const parsedData = userSchema.parse(body)

    const { id } = body

    // Find the user by email (in a real scenario, use a unique identifier like userId)
    const existingUser = await getUserById(id)

    if (!existingUser) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 })
    }

    // Update the user in primsa
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        email: parsedData.email,
        password: parsedData.password,
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
      },
    })

    return NextResponse.json(
      { message: "User updated successfully!", user: updatedUser },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", message: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    )
  }
}

// DELETE: Delete a User
export async function DELETE(req: NextRequest) {
  try {
    const body = (await req.json()) as User

    const { id } = body

    const existingUser = await getUserById(id)

    if (!existingUser) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 })
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", message: error.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      {
        error: "Failed to delete appointment",
        details: (error as Error).message,
      },
      { status: 500 }
    )
  }
}
