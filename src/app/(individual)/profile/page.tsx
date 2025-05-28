// "use client"
// import React, { useState } from "react"
// import { useRouter } from "next/navigation"
// import { z } from "zod"
// import { individualSchema } from "@/features/individual/schemas/schema"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// export default function ProfileForm () {
//   const router = useRouter()
//   const [form, setForm] = useState({
//     bio: "",
//     position: "",
//     profileImage: "",
//     country: "",
//     timezone: "",
//   })
//   const [error, setError] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [success, setSuccess] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setSuccess(false)

//     // Client-side validation
//     try {
//       individualSchema.parse(form)
//     } catch (err: any) {
//       setError(err.errors?.[0]?.message || "Invalid input")
//       return
//     }

//     setLoading(true)
//     try {
//       const res = await fetch("/api/individual", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       })
//       const data = await res.json()
//       if (data.success) {
//         setSuccess(true)
//         setTimeout(() => {
//           router.push("/profile") // Redirect to profile page or wherever you want
//         }, 1500)
//       } else {
//         setError(data.message || "Failed to create profile")
//       }
//     } catch (err) {
//       setError("Something went wrong!")
//     } finally {
//       setLoading(false)
//     }
//   }


  
//   return (
//     <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow p-8">
//       <h2 className="text-2xl font-bold mb-6">Create Your Profile</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//          {/* Profile Image Preview */}
//         <div className="flex justify-center mb-4">
//           <Avatar className="w-20 h-20">
//             <AvatarImage src={form.profileImage || undefined} />
//             <AvatarFallback>U</AvatarFallback>
//           </Avatar>
//         </div>
//             <div>
//           <label htmlFor="bio" className="block text-sm font-medium mb-1">
//             Bio
//           </label>
//           <Textarea
//             id="bio"
//             name="bio"
//             placeholder="Tell us about yourself..."
//             value={form.bio}
//             onChange={handleChange}
//           />
//         </div>
        
//          <div>
//           <label htmlFor="position" className="block text-sm font-medium mb-1">
//             Position
//           </label>
//           <Input
//             id="position"
//             name="position"
//             placeholder="e.g. Product Designer"
//             value={form.position}
//             onChange={handleChange}
//             required
//           />
//         </div>

       
//         <div>
//           <label htmlFor="profileImage" className="block text-sm font-medium mb-1">
//             Profile Image URL
//           </label>
//           <Input
//             id="profileImage"
//             name="profileImage"
//             placeholder="Paste image URL"
//             value={form.profileImage}
//             onChange={handleChange}
//           />
//         </div>
       
//         <div>
//           <label htmlFor="country" className="block text-sm font-medium mb-1">
//             Country
//           </label>
//           <Input
//             id="country"
//             name="country"
//             placeholder="e.g. United States"
//             value={form.country}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="timezone" className="block text-sm font-medium mb-1">
//             Timezone
//           </label>
//           <Input
//             id="timezone"
//             name="timezone"
//             placeholder="e.g. UTC"
//             value={form.timezone}
//             onChange={handleChange}
//             required
//           />
//         </div>
    

//         {error && <div className="text-red-600 text-sm">{error}</div>}
//         {success && <div className="text-green-600 text-sm">Profile created! Redirecting...</div>}

//         <Button type="submit" className="w-full" disabled={loading}>
//           {loading ? "Creating..." : "Create Profile"}
//         </Button>
//       </form>
//     </div>
//   )
// }

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod"; // Assuming you still want Zod for type inference if not direct parsing here
import { individualSchema } from "@/features/individual/schemas/schema"; // Path to your schema
import { Individual } from "@/features/individual/types/types";
import HeadingIndividual from "@/components/individual/individual-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Your original component uses <label>, this is from shadcn
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserSquare } from "lucide-react"; // Icon for the heading

interface ProfileFormState {
  bio: string;
  position: string;
  profileImage: string;
  country: string;
  timezone: string;
}


export default function ProfileForm() {
  // Renamed to avoid confusion if both exist
  const router = useRouter();
  const [form, setForm] = useState<ProfileFormState>({
    // Using the explicit interface
    bio: "",
    position: "",
    profileImage: "",
    country: "",
    timezone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Added type for 'e'
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Client-side validation 
    try {
      individualSchema.parse(form); // This will throw if validation fails
    } catch (err: any) {
    
      if (err instanceof z.ZodError) {
        setError(err.errors?.[0]?.message || "Invalid input in form fields.");
      } else {
        setError("Invalid input.");
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/individual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setForm({
          bio: "",
          position: "",
          profileImage: "",
          country: "",
          timezone: "",
        }); // Clear form
       
        // setTimeout(() => {
        //   router.push("/profile"); // Or your desired redirect path
        // }, 1500);
      } else {
        setError(data.message || "Failed to create profile");
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  
  const themeColor = "blue";
  const themeAccentText = `text-${themeColor}-700 dark:text-${themeColor}-400`;
  const themeAccentBorder = `border-${themeColor}-300 dark:border-${themeColor}-600`;
  const themeAccentRing = `focus:ring-${themeColor}-600 dark:focus:ring-${themeColor}-500 focus:border-${themeColor}-600 dark:focus:border-${themeColor}-500`;
  const themeButtonBg = `bg-${themeColor}-600 dark:bg-${themeColor}-500`;
  const themeButtonHoverBg = `hover:bg-${themeColor}-700 dark:hover:bg-${themeColor}-600`;

  return (
    <div className="space-y-6">
      {" "}
      {/* Outer container from the styled page */}
      {/* Heading from the styled page */}
      <HeadingIndividual 
        title="My Profile"
        description="Create or update your personal information."
        icon={<UserSquare className={`w-7 h-7 ${themeAccentText}`} />} // Apply theme color
      />
      {/* Card styling from the styled page */}
      <Card
        className={`w-full max-w-2xl mx-auto ${themeAccentBorder} shadow-lg dark:bg-slate-800`}
      >
        <CardHeader>
          <CardTitle className={`${themeAccentText}`}>
            Create Your Profile
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Fill in your details to complete your profile. Your information
            helps others connect with you.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-4">
            {/* Avatar from the styled page */}
            <div className="flex justify-center mb-4">
              <Avatar className={`w-24 h-24 border-2 ${themeAccentBorder}`}>
                <AvatarImage
                  src={form.profileImage || undefined}
                  alt={`${form.position || "User"}'s profile image`}
                />
                <AvatarFallback
                  className={`text-2xl bg-slate-100 dark:bg-slate-700 ${themeAccentText}`}
                >
                  {form.position
                    ? form.position.substring(0, 1).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Form fields using Label and Input from shadcn/ui, styled like the target page */}
            <div className="space-y-1.5">
              <Label
                htmlFor="profileImage"
                className="text-slate-700 dark:text-slate-300 font-medium"
              >
                Profile Image URL
              </Label>
              <Input
                id="profileImage"
                name="profileImage"
                type="url"
                placeholder="https://example.com/your-image.png"
                value={form.profileImage}
                onChange={handleChange}
                disabled={loading} // Use your 'loading' state
                className={`${themeAccentRing} dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-400`}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="position"
                className="text-slate-700 dark:text-slate-300 font-medium"
              >
                Position
              </Label>
              <Input
                id="position"
                name="position"
                placeholder="e.g., Software Engineer, Product Manager"
                value={form.position}
                onChange={handleChange}
                disabled={loading}
                // required // Retained from your original code
                className={`${themeAccentRing} dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-400`}
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="bio"
                className="text-slate-700 dark:text-slate-300 font-medium"
              >
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us a bit about yourself, your skills, or professional interests..."
                value={form.bio}
                onChange={handleChange}
                rows={4}
                disabled={loading}
                className={`${themeAccentRing} dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-400`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="country"
                  className="text-slate-700 dark:text-slate-300 font-medium"
                >
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="e.g., United States"
                  value={form.country}
                  onChange={handleChange}
                  disabled={loading}
                  // required
                  className={`${themeAccentRing} dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-400`}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="timezone"
                  className="text-slate-700 dark:text-slate-300 font-medium"
                >
                  Timezone
                </Label>
                <Input
                  id="timezone"
                  name="timezone"
                  placeholder="e.g., America/New_York, UTC"
                  value={form.timezone}
                  onChange={handleChange}
                  disabled={loading}
                  // required
                  className={`${themeAccentRing} dark:bg-slate-700 dark:text-slate-50 dark:placeholder-slate-400`}
                />
              </div>
            </div>
            {/* Displaying your original error/success messages */}
            {error && (
              <div className="text-sm font-medium text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/30 rounded-md border border-red-300 dark:border-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="text-sm font-medium text-green-600 dark:text-green-400 p-3 bg-green-50 dark:bg-green-900/30 rounded-md border border-green-300 dark:border-green-700">
                Profile created successfully!
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-6">
            <Button
              type="submit"
              disabled={loading}
              className={`w-full md:w-auto ${themeButtonBg} ${themeButtonHoverBg} text-white`}
            >
              {loading ? "Processing..." : "Create Profile"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
