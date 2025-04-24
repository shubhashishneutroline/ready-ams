"use client";

import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputField from "@/components/custom-form-fields/input-field";
import SelectField from "@/components/custom-form-fields/select-field";
import {
  Building2,
  Briefcase,
  Mail,
  Phone,
  Globe,
  MapPin,
  Map,
  FileText,
  Upload,
  Image,
  Eye,
  LocateFixed,
  MapPinHouse,
  Pin,
  MapPinned,
} from "lucide-react";
import FileUploadField from "@/components/custom-form-fields/image-upload";
import { getBusinesses } from "../api/api";
import { useEffect, useState } from "react";

const industryOptions = [
  { label: "Salon & Spa", value: "Salon & Spa" },
  { label: "Medical & Health", value: "Medical & Health" },
  { label: "Automotive Services", value: "Automotive Services" },
  { label: "Home Repair & Maintenance", value: "Home Repair & Maintenance" },
  { label: "Fitness & Wellness", value: "Fitness & Wellness" },
  { label: "Education & Training", value: "Education & Training" },
  { label: "Legal & Consulting", value: "Legal & Consulting" },
  { label: "IT Services", value: "IT Services" },
];

const visibilityOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Pending", value: "PENDING" },
  { label: "Suspended", value: "SUSPENDED" },
];

const addressSchema = z.object({
  city: z.string().min(1, "City is required"),
  street: z.string().min(1, "Street is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  googleMap: z.string().optional(),
});

const schema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry selection is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().optional(),
  city: z.string().min(1, "City is required"),
  street: z.string().min(1, "Street is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  googleMap: z.string().optional(),
  registrationNumber: z
    .string()
    .min(1, "Business registration number is required"),
  taxId: z.any().optional(),
  logo: z.any().refine((file) => file !== null, "Business logo is required"),
  visibility: z.string().min(1, "Visibility selection is required"),
  addresses: z.array(addressSchema), // This allows an array of address objects
});

const BusinessDetailForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addressLength, setaddressLength] = useState(0);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const business = await getBusinesses();
        const dataToEdit = business[0];
        const formData = {
          businessName: dataToEdit.name || "",
          industry: dataToEdit.industry || "",
          phone: dataToEdit.phone || "",
          email: dataToEdit.email || "",
          website: dataToEdit.website || "",
          registrationNumber: dataToEdit.businessRegistrationNumber || "",
          taxId: dataToEdit.taxId || null,
          logo: dataToEdit.logo || null,
          visibility: dataToEdit.status || "",
          addresses:
            dataToEdit.addresses?.length > 0
              ? dataToEdit.addresses
              : [
                  {
                    city: "",
                    street: "",
                    state: "",
                    zipCode: "",
                    country: "",
                    googleMap: "",
                  },
                ],
        };
        form.reset(formData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // toast.error("Failed to load appointment data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBusinessDetails();
  }, []);

  const form = useForm({
    defaultValues: {
      businessName: "",
      industry: "",
      email: "",
      phone: "",
      website: "",
      city: "",
      street: "",
      state: "",
      zipCode: "",
      country: "",
      googleMap: "",
      registrationNumber: "",
      taxId: null,
      logo: null,
      visibility: "",
      addresses: [
        {
          city: "",
          street: "",
          state: "",
          zipCode: "",
          country: "",
          googleMap: "",
        },
      ],
    },
    resolver: zodResolver(schema),
  });
  const { control, reset } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const onSubmit = (data: any) => {
    console.log("Business Detail Form submitted:", data);
  };

  const onSaveAndExit = () => {
    console.log("Save and exit clicked");
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Business Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="businessName"
              label="Business Name"
              placeholder="Enter your business name"
              icon={Building2}
            />
            <SelectField
              name="industry"
              label="Industry/Category"
              placeholder="Select Industry Type"
              options={industryOptions}
              icon={Briefcase}
            />
            <InputField
              name="email"
              label="Email"
              type="email"
              placeholder="Enter business email address"
              icon={Mail}
            />
            <InputField
              name="phone"
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone"
              icon={Phone}
            />
            <InputField
              name="website"
              label="Website"
              type="url"
              placeholder="Your business website URL"
              icon={Globe}
              className="md:col-span-2"
            />
          </div>
        </div>

        {/* Business Address */}
        <div className="space-y-4">
          {/* <h3 className="text-lg font-semibold">Business Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="city"
              label="City"
              placeholder="Enter city"
              icon={MapPinHouse}
            />
            <InputField
              name="street"
              label="Street"
              placeholder="Enter street"
              icon={LocateFixed}
            />
            <InputField
              name="state"
              label="State"
              placeholder="Enter State"
              icon={MapPinned}
            />
            <InputField
              name="zipCode"
              label="ZIP Code"
              placeholder="Enter ZIP code"
              icon={Pin}
            />
            <InputField
              name="country"
              label="Country"
              placeholder="Enter Country"
              icon={MapPin}
            />
            <InputField
              name="googleMap"
              label="Google Map"
              type="url"
              placeholder="Enter google map url"
              icon={Map}
            /> */}
          {fields.map((field, index) => {
            console.log(field, "fields");
            return (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <InputField
                  name={`addresses[${index}].city`}
                  label="City"
                  placeholder="Enter city"
                />
                <InputField
                  name={`addresses[${index}].street`}
                  label="Street"
                  placeholder="Enter street"
                />
                <InputField
                  name={`addresses[${index}].state`}
                  label="State"
                  placeholder="Enter state"
                />
                <InputField
                  name={`addresses[${index}].zipCode`}
                  label="ZIP Code"
                  placeholder="Enter ZIP code"
                />
                <InputField
                  name={`addresses[${index}].country`}
                  label="Country"
                  placeholder="Enter country"
                />
                <InputField
                  name={`addresses[${index}].googleMap`}
                  label="Google Map"
                  placeholder="Google Map URL"
                />
              </div>
            );
          })}
        </div>

        {/* Legal & Compliance */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Legal & Compliance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              name="registrationNumber"
              label="Business Registration Number"
              placeholder="Enter Business Registration Number"
              icon={FileText}
            />
            <FileUploadField
              name="taxId"
              label="Tax ID / EIN / PAN"
              placeholder="Upload Tax ID / EIN / PAN document"
              icon={Upload}
            />
          </div>
        </div>

        {/* Branding & Visibility */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Branding & Visibility</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FileUploadField
              name="logo"
              label="Logo / Business Image"
              placeholder="Upload Business Logo"
              icon={Image}
            />
            <SelectField
              name="visibility"
              label="Visibility (Public/Private)"
              placeholder="Select Visibility"
              options={visibilityOptions}
              icon={Eye}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Proceed
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full border-gray-400 text-gray-700 hover:bg-gray-100"
            onClick={onSaveAndExit}
          >
            Save and exit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default BusinessDetailForm;
