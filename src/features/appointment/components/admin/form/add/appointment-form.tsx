// // app/(admin)/appointment/create/page.tsx (or relevant form file)
// "use client"

// import { useForm, FormProvider } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import InputField from "@/components/custom-form-fields/input-field"
// import SelectField from "@/components/custom-form-fields/select-field"
// import TextAreaField from "@/components/custom-form-fields/textarea-field"
// import PhoneInputField from "@/components/custom-form-fields/phone-field"
// import TimePickerField from "@/components/custom-form-fields/time-field"
// import { Button } from "@/components/ui/button"
// import FormHeader from "@/components/admin/form-header"
// import { useRouter, useParams } from "next/navigation"
// import DatePickerField from "@/components/custom-form-fields/date-field"
// import { Mail, SlidersHorizontal, UserPen } from "lucide-react"

// // Import TYPEs
// import { PostAppoinmentData } from "@/features/appointment/api/api"

// import { useEffect, useState, useMemo } from "react" // Added useMemo
// import { toast } from "sonner"
// import {
//   isoToNormalTime,
//   normalOrFormTimeToIso,
//   normalDateToIso,
// } from "@/utils/utils"
// import { useAppointmentStore } from "@/app/(admin)/appointment/_store/appointment-store"
// import { useServiceStore } from "@/app/(admin)/service/_store/service-store"

// interface ServiceOption {
//   label: string
//   value: string
// }

// const appointmentSchema = z.object({
//   // ... (schema remains the same)
//   firstName: z.string().min(1, "First name is required"),
//   lastName: z.string().min(1, "Last name is required"),
//   email: z.string().email("Invalid email address").min(1, "Email is required"),
//   phone: z.string().min(1, "Phone number is required"),
//   service: z.string().min(1, "Service is required"),
//   date: z.date({ required_error: "Date is required" }),
//   time: z.string().min(1, "Time is required"),
//   message: z.string().optional(),
// })

// type FormData = z.infer<typeof appointmentSchema>

// const availableTimeSlots = [
//   // ... (time slots remain the same)
//   "09:00 AM",
//   "10:00 AM",
//   "10:15 AM",
//   "11:00 AM",
//   "12:00 PM",
//   "01:00 PM",
//   "02:00 PM",
//   "03:00 PM",
//   "04:00 PM",
//   "05:00 PM",
// ]

// export default function AppointmentForm() {
//   const router = useRouter()
//   const params = useParams()
//   const id = params?.id as string | undefined
//   const isEditMode = !!id

//   // --- Get actions/state from Appointment Store ---
//   const {
//     createAppointment: storeCreateAppointment,
//     updateAppointment: storeUpdateAppointment,
//     getAppointmentById: storeGetAppointmentById,
//   } = useAppointmentStore()

//   // --- Get state/actions from Service Store ---
//   const {
//     services, // The array of service objects
//     fetchServices, // Action to fetch services
//     loading: isLoadingServices, // Use the store's loading state
//     hasFetched: hasFetchedServices, // Check if store has already fetched
//   } = useServiceStore()

//   // State for this form specifically
//   const [isLoadingAppointment, setIsLoadingAppointment] = useState(isEditMode)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const form = useForm<FormData>({
//     resolver: zodResolver(appointmentSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       phone: "",
//       service: "",
//       date: undefined,
//       time: "",
//       message: "",
//     },
//   })

//   // *** Fetch services using the Service Store ***
//   useEffect(() => {
//     // Only fetch if the store hasn't fetched them yet
//     if (!isLoadingServices && !hasFetchedServices) {
//       console.log("AppointmentForm: Triggering fetchServices via store.")
//       fetchServices()
//     }
//     // Dependencies ensure this runs once on mount or if these specific store flags change
//   }, [fetchServices, hasFetchedServices, isLoadingServices])

//   // *** Derive serviceOptions from the store's services state ***
//   const serviceOptions = useMemo<ServiceOption[]>(() => {
//     if (!Array.isArray(services)) {
//       console.warn(
//         "AppointmentForm: services from store is not an array:",
//         services
//       )
//       return [] // Return empty array if services is not as expected
//     }
//     return services
//       .filter((service) => service.status === "ACTIVE") // Optional: Filter for active services if needed
//       .map((service) => ({
//         label: service.title, // Assuming 'title' is the display name
//         value: service.id, // Assuming 'id' is the value
//       }))
//   }, [services]) // Re-run only when the services array from the store changes

//   // Fetch appointment data for edit mode (Keep this as is, uses Appointment Store)
//   useEffect(() => {
//     if (isEditMode && id) {
//       const fetchAppointment = async () => {
//         // ... (existing logic using storeGetAppointmentById is correct)
//         try {
//           setIsLoadingAppointment(true)
//           const appointment = await storeGetAppointmentById(id)
//           console.log("Fetched appointment via store:", appointment)

//           if (appointment && appointment.customerName) {
//             const date = appointment.selectedDate
//             const time = isoToNormalTime(appointment.selectedTime)
//             const [firstName, ...lastNameParts] = appointment.customerName
//               .trim()
//               .split(" ")

//             form.reset({
//               firstName: firstName || "",
//               lastName: lastNameParts.join(" ") || "",
//               email: appointment.email || "",
//               phone: appointment.phone || "",
//               service: appointment.serviceId || "",
//               date: isNaN(date.getTime()) ? undefined : date,
//               time: time || "",
//               message: appointment.message || "",
//             })
//             console.log("Form populated with:", {
//               /* ... */
//             })
//           } else {
//             console.warn("Appointment not found or invalid data for ID:", id)
//             toast.error("Could not load appointment data to edit.") // More specific feedback
//           }
//         } catch (error: any) {
//           console.error("Error fetching appointment in form:", error)
//           // Toast handled by store method
//         } finally {
//           setIsLoadingAppointment(false)
//         }
//       }
//       fetchAppointment()
//     }
//   }, [id, isEditMode, form, storeGetAppointmentById])

//   // onSubmit function (Keep this as is, uses Appointment Store actions)
//   const onSubmit = async (formData: FormData) => {
//     // ... (existing logic using storeCreateAppointment/storeUpdateAppointment is correct)
//     try {
//       setIsSubmitting(true)
//       const appointmentData: PostAppoinmentData = {
//         customerName: `${formData.firstName} ${formData.lastName}`.trim(),
//         email: formData.email,
//         phone: formData.phone,
//         serviceId: formData.service,
//         selectedDate: normalDateToIso(formData.date),
//         selectedTime: normalOrFormTimeToIso(formData.date, formData.time),
//         message: formData.message,
//         userId: "cm9gu8ms60000vdg0zdnsxb6z",
//         isForSelf: false,
//         bookedById: "cm9gu8ms60000vdg0zdnsxb6z",
//         createdById: "cm9gu8ms60000vdg0zdnsxb6z",
//         status: "SCHEDULED",
//       }
//       console.log("Submitting appointment via store:", appointmentData)

//       if (isEditMode && id) {
//         await storeUpdateAppointment(id, appointmentData)
//       } else {
//         await storeCreateAppointment(appointmentData)
//       }
//       handleBack()
//     } catch (error: any) {
//       console.error(
//         `Error ${isEditMode ? "updating" : "creating"} appointment in form:`,
//         error
//       )
//       // Toast is handled by store method
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleBack = () => {
//     router.push("/appointment")
//   }

//   // --- Return JSX ---
//   return (
//     <>
//       <FormHeader
//         title={isEditMode ? "Edit Appointment" : "Enter Appointment Details"}
//         description={
//           isEditMode
//             ? "Update existing appointment details"
//             : "View and manage your upcoming appointments"
//         }
//       />
//       {/* Show loading indicator if either appointment OR initial service list is loading */}
//       {isLoadingAppointment || (isLoadingServices && !hasFetchedServices) ? (
//         <div className="flex justify-center items-center py-20 text-muted-foreground">
//           {isLoadingAppointment
//             ? "Loading appointment..."
//             : "Loading services..."}
//         </div>
//       ) : (
//         <FormProvider {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-5"
//             aria-busy={isSubmitting}
//           >
//             {/* ... (Input fields for name, email, phone remain the same) ... */}
//             <div className="grid grid-cols-2 gap-4">
//               <InputField
//                 name="firstName"
//                 label="First Name"
//                 placeholder="John"
//                 icon={UserPen}
//               />
//               <InputField
//                 name="lastName"
//                 label="Last Name"
//                 placeholder="Doe"
//                 icon={UserPen}
//               />
//             </div>

//             <InputField
//               name="email"
//               label="Email"
//               type="email"
//               placeholder="john@example.com"
//               icon={Mail}
//             />

//             <PhoneInputField
//               name="phone"
//               label="Phone Number"
//               placeholder="Enter your number"
//             />

//             {/* *** Updated SelectField *** */}
//             <SelectField
//               name="service"
//               label="Select a Service"
//               options={serviceOptions} // Use derived options
//               icon={SlidersHorizontal}
//               placeholder={
//                 isLoadingServices ? "Loading services..." : "Select a service"
//               }
//               // Disable while loading services OR if no options are available after loading
//               disabled={
//                 isLoadingServices ||
//                 (!isLoadingServices && serviceOptions.length === 0)
//               }
//             />

//             {/* Display message if services loaded but none are available */}
//             {!isLoadingServices &&
//               serviceOptions.length === 0 &&
//               hasFetchedServices && (
//                 <p className="text-sm text-muted-foreground text-center">
//                   No services currently available.
//                 </p>
//               )}

//             {/* ... (Date, Time, Message fields remain the same) ... */}
//             <div className="grid grid-cols-2 items-center gap-4">
//               <DatePickerField
//                 name="date"
//                 label="Appointment Date"
//                 placeholder="Pick a date"
//               />
//               <TimePickerField
//                 name="time"
//                 label="Appointment Time"
//                 availableTimeSlots={availableTimeSlots}
//               />
//             </div>

//             <TextAreaField
//               name="message"
//               label="Additional Notes"
//               placeholder="Any special requests?"
//             />

//             {/* ... (Buttons remain the same, update disabled state) ... */}
//             <div className="flex flex-col gap-3 md:flex-row justify-between mt-6">
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="w-full sm:w-auto hover:opacity-95 active:translate-y-0.5 transition-transform duration-200"
//                 onClick={handleBack}
//                 disabled={isSubmitting}
//               >
//                 ← Back
//               </Button>
//               <Button
//                 type="submit"
//                 className="w-full sm:w-auto hover:opacity-95 active:translate-y-0.5 transition-transform duration-200"
//                 // Disable submit if services are loading, appointment is loading, or submitting
//                 disabled={
//                   isLoadingServices || isLoadingAppointment || isSubmitting
//                 }
//               >
//                 {isEditMode
//                   ? isSubmitting
//                     ? "Updating..."
//                     : "Update Appointment"
//                   : isSubmitting
//                     ? "Creating..."
//                     : "Book Appointment"}
//               </Button>
//             </div>
//           </form>
//         </FormProvider>
//       )}
//     </>
//   )
// }
