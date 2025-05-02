// app/(admin)/customer/create/CustomerForm.tsx
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
import { useRouter } from "next/navigation"
import { createCustomer } from "@/features/customer/api/api"
import { toast, Toaster } from "sonner"
import FormHeader from "@/components/admin/form-header"
import { Role } from "@/features/customer/types/types"

type FormData = {
  fullName: string
  email: string
  phone: string
  role: string
  password: string
}

const createSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const roleOptions = [
  { value: Role.USER, label: "Customer" },
  { value: Role.ADMIN, label: "Admin" },
  { value: Role.SUPERADMIN, label: "Super Admin" },
]

const CustomerForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false) // Add loading state
  const router = useRouter()

  const form = useForm<FormData>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      role: Role.USER, // Default to USER
      password: "",
    },
  })

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const customerdata = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role as Role, // Use form role
        password: formData.password,
        isActive: true,
      }
      const res = await createCustomer(customerdata)
      if (res.success) {
        toast.success("Customer created successfully")
        router.push("/customer")
      } else {
        toast.error(res.message || "Failed to create customer")
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create customer")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push("/customer")
  }

  return (
    <>
      {/* <Toaster position="top-right" /> */}
      <FormHeader
        title="Enter Customer Details"
        description="Create a new customer account"
      />
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 h-full"
        >
          <div className="space-y-4">
            <InputField
              name="fullName"
              label="Full Name"
              placeholder="Enter full name"
              icon={User}
            />
            <InputField
              name="email"
              label="Email"
              type="email"
              placeholder="Enter email address"
              icon={Mail}
            />
            <PhoneField name="phone" label="Phone" />

            <div className="relative">
              <InputField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
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
          <div className="flex flex-col gap-3 md:flex-row justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto hover:opacity-95 active:translate-y-0.5 transition-transform duration-200"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              ← Back
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto hover:opacity-95 active:translate-y-0.5 transition-transform duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create User"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default CustomerForm
