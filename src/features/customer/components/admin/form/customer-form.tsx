"use client"

import { useState } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import InputField from "@/components/custom-form-fields/input-field"
import SelectField from "@/components/custom-form-fields/select-field"
import { User, Mail, Phone, UserCheck, Lock, Eye, EyeOff } from "lucide-react"
import PhoneField from "@/components/custom-form-fields/phone-field"

type FormData = {
  fullName: string
  email: string
  phone: string
  role: string
  password: string
}

interface CustomerFormProps {
  onSubmit: (data: FormData) => void
}

// Validation schema for create mode
const createSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
  password: z.string().min(1, "Password is required"),
})

const roleOptions = [
  { value: "customer", label: "Customer" },
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
]

const CustomerForm = () => {
  const [showPassword, setShowPassword] = useState(false)

  // Initialize form with create schema
  const form = useForm<FormData>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "95129871987391",
      role: "",
      password: "",
    },
  })

  // Handle form submission
  const handleSubmit = (data: FormData) => {
    console.log("Customer Form submitted:", data)
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6 h-full"
      >
        <div className="space-y-4">
          <InputField
            name="fullName"
            label="Full Name"
            placeholder="Enter Service Name"
            icon={User}
          />
          <InputField
            name="email"
            label="Email"
            type="email"
            placeholder="Enter Email Address"
            icon={Mail}
          />
          <PhoneField name="phone" label="Phone" />
          <SelectField
            name="role"
            label="Role"
            placeholder="Select a Role"
            options={roleOptions}
            icon={UserCheck}
          />
          <div className="relative">
            <InputField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              icon={Lock}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-6 rounded-full"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4 text-gray-500" />
              ) : (
                <Eye className="size-4 text-gray-500" />
              )}
            </Button>
          </div>
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          Create
        </Button>
      </form>
    </FormProvider>
  )
}

export default CustomerForm
