"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { eventSchema } from "@/features/individual-event/schemas/schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const VIDEO_PROVIDERS = [
  { label: "Zoom", value: "ZOOM" },
  { label: "Google Meet", value: "GOOGLE_MEET" },
  { label: "Webex", value: "WEBEX" },
  { label: "Microsoft Teams", value: "MICROSOFT_TEAMS" },
  { label: "GoTo Meeting", value: "GOTO_MEETING" },
];

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Slugify function
function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

export default function EventFormPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    timezone: "",
    slug: "",
    // userId is set internally, not in the UI
    availability: [{ dayOfWeek: "", startTime: "", endTime: "", duration: "" }],
  });
  const userId = "cmaemhw500006vdawrh8umbqp"; // Set from your auth system or context
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };
    if (name === "title") {
      updatedForm.slug = slugify(value);
    }
    setForm(updatedForm);
  };

  const handleAvailabilityChange = (
    idx: number,
    field: "dayOfWeek" | "startTime" | "endTime" | "duration",
    value: string
  ) => {
    const updated = [...form.availability];
    updated[idx][field] = value;
    setForm({ ...form, availability: updated });
  };

  const addAvailability = () => {
    setForm({
      ...form,
      availability: [
        ...form.availability,
        { dayOfWeek: "", startTime: "", endTime: "", duration: "" },
      ],
    });
  };

  const removeAvailability = (idx: number) => {
    setForm({
      ...form,
      availability: form.availability.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Compose the payload with userId injected
    const payload = {
      ...form,
      userId,
       slug: form.slug,
      availability: form.availability.map((slot) => ({
        ...slot,
        dayOfWeek: DAYS_OF_WEEK.indexOf(slot.dayOfWeek), // convert day name to number
        duration: Number(slot.duration),
      })),
    };

    // Client-side validation
    try {
      eventSchema.parse(payload);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/individual-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("data",data);
      if (data.success) {
        setSuccess(true);
       
      } else {
        setError(data.message || "Failed to create event");
      }
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold mb-6">Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            name="title"
            placeholder="Event title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            placeholder="Event description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Video Provider
          </label>
          <select
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            required
            className="block w-full border rounded px-3 py-2"
          >
            <option value="">Select provider</option>
            {VIDEO_PROVIDERS.map((provider) => (
              <option key={provider.value} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>
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
        <div>
          <label className="block text-sm font-medium mb-1">Availability</label>
          {form.availability.map((slot, idx) => (
            <div key={idx} className="flex gap-2 items-end mb-2">
              <select
                name="dayOfWeek"
                value={slot.dayOfWeek}
                onChange={(e) =>
                  handleAvailabilityChange(idx, "dayOfWeek", e.target.value)
                }
                className="border rounded px-2 py-1"
                required
              >
                <option value="">Day</option>
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <Input
                type="time"
                name="startTime"
                value={slot.startTime}
                onChange={(e) =>
                  handleAvailabilityChange(idx, "startTime", e.target.value)
                }
                required
              />
              <Input
                type="time"
                name="endTime"
                value={slot.endTime}
                onChange={(e) =>
                  handleAvailabilityChange(idx, "endTime", e.target.value)
                }
                required
              />
              <Input
                type="number"
                name="duration"
                placeholder="Duration (min)"
                value={slot.duration}
                onChange={(e) =>
                  handleAvailabilityChange(idx, "duration", e.target.value)
                }
                required
                min={1}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeAvailability(idx)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addAvailability}>
            Add Availability
          </Button>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm">
            Event created! Redirecting...
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </div>
  );
}
