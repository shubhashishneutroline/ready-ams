"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { individualSchema } from "@/features/individual/schemas/schema"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const ProfileForm = () => {
  const router = useRouter()
  const [form, setForm] = useState({
    bio: "",
    position: "",
    profileImage: "",
    country: "",
    timezone: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Client-side validation
    try {
      individualSchema.parse(form)
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid input")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/individual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/profile") // Redirect to profile page or wherever you want
        }, 1500)
      } else {
        setError(data.message || "Failed to create profile")
      }
    } catch (err) {
      setError("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }


  
  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-6">Create Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
         {/* Profile Image Preview */}
        <div className="flex justify-center mb-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={form.profileImage || undefined} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
            <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1">
            Bio
          </label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Tell us about yourself..."
            value={form.bio}
            onChange={handleChange}
          />
        </div>
        
         <div>
          <label htmlFor="position" className="block text-sm font-medium mb-1">
            Position
          </label>
          <Input
            id="position"
            name="position"
            placeholder="e.g. Product Designer"
            value={form.position}
            onChange={handleChange}
            required
          />
        </div>

       
        <div>
          <label htmlFor="profileImage" className="block text-sm font-medium mb-1">
            Profile Image URL
          </label>
          <Input
            id="profileImage"
            name="profileImage"
            placeholder="Paste image URL"
            value={form.profileImage}
            onChange={handleChange}
          />
        </div>
       
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            Country
          </label>
          <Input
            id="country"
            name="country"
            placeholder="e.g. United States"
            value={form.country}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="timezone" className="block text-sm font-medium mb-1">
            Timezone
          </label>
          <Input
            id="timezone"
            name="timezone"
            placeholder="e.g. UTC"
            value={form.timezone}
            onChange={handleChange}
            required
          />
        </div>
    

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">Profile created! Redirecting...</div>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Profile"}
        </Button>
      </form>
    </div>
  )
}

export default function Page() {
  return <ProfileForm />
}
