"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Event } from "@/features/individual-event/types/types";
import { Edit, Trash2 } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/individual-event");
        const data = await res.json();
        setEvents(data.data || []);
      } catch (err) {
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

const handleCopy = (slug: string) => {
  // Use NEXT_PUBLIC_ORIGIN for frontend environment variables
  const origin = process.env.ORIGIN || window.location.origin;
  const fullUrl = `${origin}/event/${slug}`;
  navigator.clipboard.writeText(fullUrl);
  setCopiedSlug(slug);
  setTimeout(() => setCopiedSlug(null), 1200);
};

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/individual-event/${id}`, { method: "DELETE" });
      console.log('res',res);
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(events => events.filter(event => event.id !== id));
    } catch (err) {
      setError("Failed to delete event");
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/event/edit/${id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {events.map(event => (
        <Card key={event.id}>
          <CardHeader className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-sm text-muted-foreground">{event.location}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(event.id)}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Edit"
              >
                <Edit size={18} className="text-gray-500 hover:text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Delete"
              >
                <Trash2 size={18} className="text-gray-500 hover:text-red-600" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <p>{event.description}</p>
            <div className="mt-2">
              <strong>Duration:</strong>{" "}
              {event.availability && event.availability.length > 0
                ? `${event.availability[0].duration} min`
                : "N/A"}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 items-start">
            <button
              onClick={() => handleCopy(event.slug)}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
            >
              {copiedSlug === event.slug ? "Copied!" : "Copy link"}
            </button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
