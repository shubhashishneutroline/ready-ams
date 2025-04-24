"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/custom-form-fields/input-field";
import SelectField from "@/components/custom-form-fields/select-field";
import { User, Mail, Phone, UserCheck, Lock, Eye, EyeOff } from "lucide-react";
import PhoneField from "@/components/custom-form-fields/phone-field";
import { useRouter } from "next/navigation";
import { createCustomer } from "@/features/customer/api/api";
import { toast, Toaster } from "sonner";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
};

interface CustomerFormProps {
  onSubmit: (data: FormData) => void;
}

// Validation schema for create mode
const createSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  role: z.string().min(1, "Role is required"),
  password: z.string().min(1, "Password is required"),
});

const roleOptions = [
  { value: "user", label: "Customer" },
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
];

const CustomerForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

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
  });

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    try {
      const customerdata = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role.toUpperCase(),
        password: formData.password,
        isActive: true,
      };
      console.log(customerdata, "customerdata");
      await createCustomer(customerdata);
      toast.success("Appointment created successfully");
      handleBack();
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Failed to create appointment");
    }
  };

  const handleBack = () => {
    router.push("/customer");
  };

  return (
    <>
      <Toaster position="top-center" />
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

          <div className="flex flex-col gap-3 md:flex-row justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto hover:opacity-95 active:translate-y-0.5 transition-transform duration-200"
              onClick={handleBack}
            >
              ← Back
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto hover:opacity-95 active:translate-y-0.5 transition-transform duration-200"
            >
              Create User
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default CustomerForm;
