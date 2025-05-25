"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Event } from "@/features/individual-event/types/types";

export default function BookingPage() {
  const { slug } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 22)); // July 22, 2025
  const [selectedTime, setSelectedTime] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      try {
        const res = await fetch(`/api/individual-event/book-event/${slug}`);
        const data = await res.json();
        console.log("data is", data);
        setEvent(data.data); // adjust this depending on your API response
      } catch (e) {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }
    if (slug) fetchEvent();
  }, [slug]);

  if (loading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  const handleTimeClick = (slot: string) => {
    setSelectedTime(slot);
    setShowForm(true);
  };

const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!event || !selectedDate || !selectedTime) {
    // Optionally show an error to the user
    return;
  }

  // Find the slot object for the selected time
  const slot = slotsForSelectedDate.find(
    s => `${s.startTime} - ${s.endTime}` === selectedTime
  );

  if (!slot) {
    // Optionally show an error to the user
    return;
  }

  // Construct the timeSlot as a Date object (combine selectedDate and slot.startTime)
  const [hour, minute] = slot.startTime.split(":").map(Number);
  const timeSlot = new Date(selectedDate);
  timeSlot.setHours(hour, minute, 0, 0);

  // Prepare the payload
  const payload = {
    eventId: event.id,
    timeSlot: timeSlot.toISOString(),
    duration: slot.duration,
    bookedByName: "", // Add a field for user to enter their name if needed
    bookedByEmail: email,
    comment,
  };

  try {
    const response = await fetch("/api/meeting", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('data is',data)

    if (response.ok) {
      // Success: show a success message, reset form, etc.
      alert("Meeting booked successfully!");
      setShowForm(false);
      setSelectedTime(null);
      setEmail("");
      setComment("");
    } else {
      // Error: show error message
      alert(data.error || "Failed to book meeting");
    }
  } catch (err) {
    alert("Network error. Please try again.");
  }
};

  function getAvailableDates(availability: any[]): Date[] {
    const result: Date[] = [];
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const nextMonth = (month + 1) % 12;
    const endMonth = nextMonth === 0 ? 12 : nextMonth;
    const endDate = new Date(year, endMonth, 1);

    for (
      let d = new Date(year, month, today.getDate());
      d < endDate;
      d.setDate(d.getDate() + 1)
    ) {
      for (const slot of availability) {
        if (d.getDay() === slot.dayOfWeek) {
          result.push(new Date(d));
          break;
        }
      }
    }
    return result;
  }

  function getTimeSlotsForDate(date: Date, availability: any[]) {
    return availability.filter((a) => date.getDay() === a.dayOfWeek);
  }

  const availableDates = event?.availability
    ? getAvailableDates(event.availability)
    : [];
  const slotsForSelectedDate =
    selectedDate && event?.availability
      ? getTimeSlotsForDate(selectedDate, event.availability)
      : [];
  const isDateAvailable =
    selectedDate &&
    availableDates.some(
      (d) =>
        d.getFullYear() === selectedDate.getFullYear() &&
        d.getMonth() === selectedDate.getMonth() &&
        d.getDate() === selectedDate.getDate()
    );

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 justify-center">
        {/* Left: Event Info */}
        <Card className="shadow-lg border border-gray-200 bg-white rounded-xl w-full max-w-xs md:w-[320px]">
          <CardHeader className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <img src={event.individual.profileImage || ""} alt="image" />
            </div>
            <div className="font-semibold text-lg">{event?.user?.name}</div>
            <div className="text-2xl font-bold text-center">{event?.title}</div>
            <div className="text-2xl font-bold text-center">
              {event?.individual?.position}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            <div className="flex flex-col items-center gap-2 text-gray-500 mt-2">
              <div className="flex items-center gap-2">
                <span className="material-icons text-base">schedule</span>
                <span className="font-medium">
                  {" "}
                  {event?.availability?.map((a) => a.duration)} min
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-icons text-base">videocam</span>
                <span className="font-medium">{event?.location}</span>
              </div>
            </div>
            <div className="mt-4 space-y-2 w-full">
              <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              <div className="h-3 bg-gray-100 rounded w-5/6"></div>
            </div>
          </CardContent>
        </Card>

        {/* Center: Calendar */}
        <div className="w-full max-w-md md:w-[340px] flex flex-col items-center bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="mb-2 font-semibold text-lg text-center">
            Select a Date &amp; Time
          </div>
          <Calendar
            mode="single"
            required
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border shadow w-full"
            classNames={{
              months: "flex flex-row gap-2 w-full justify-center", // horizontal layout
              month: "flex flex-col gap-2 w-full", // remove gap-4
              table: "w-full border-collapse",
              head_row: "flex w-full",
              head_cell:
                "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "relative p-0 text-center text-sm w-10 h-10", // wider day cells
              day: "w-10 h-10 p-0 font-normal aria-selected:opacity-100",
            }}
            modifiers={{
              available: availableDates,
            }}
            modifiersClassNames={{
              available: "bg-blue-100 text-blue-700",
            }}
          />
          <div className="mt-4 text-sm text-gray-500 flex items-center gap-1">
            <span>
              Time zone:{" "}
              <span className="font-medium">
                Eastern time – US &amp; Canada
              </span>
            </span>
          </div>
        </div>

        {/* Right: Time Slots */}
        <div className="w-full max-w-xs md:w-[320px] flex flex-col items-center bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="mb-4 text-lg font-semibold text-center">
            {!selectedDate
              ? "Select a date to book your meeting"
              : selectedDate.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
          </div>
          {/* Show booking form if a slot is selected and showForm is true */}
          {showForm ? (
            <form
              onSubmit={handleFormSubmit}
              className="flex flex-col gap-3 w-full"
            >
              <div>
                <strong>Selected Time:</strong> {selectedTime}
              </div>
              <div>
                <label className="block mb-1">Email:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1">Comment:</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 text-white">
                Book meeting
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowForm(false)}
              >
                Back
              </Button>
            </form>
          ) : !selectedDate ? (
            <div className="text-gray-500 text-center">
              Select a date to book your meeting
            </div>
          ) : isDateAvailable && slotsForSelectedDate.length > 0 ? (
            <div className="flex flex-col gap-3 w-full">
              {slotsForSelectedDate.map((slot, idx) => (
                <Button
                  key={idx}
                  onClick={() =>
                    handleTimeClick(`${slot.startTime} - ${slot.endTime}`)
                  }
                  className="w-full"
                >
                  {slot.startTime} - {slot.endTime} ({slot.duration} min)
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center">
              No meetings for this date
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
