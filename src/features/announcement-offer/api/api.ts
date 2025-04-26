import { getBaseUrl } from "@/lib/baseUrl";

import axios from "axios";
import { ExpirationDuration, Showon, TargetAudience } from "../types/types";

export interface AnnouncementOrOffer {
  id?: string;
  title: string; // Required field for the title of the announcement or offer
  description?: string; // Optional: Description of the announcement or offer
  message?: string; // Optional: Custom message for the announcement or offer
  audience: string; // Required: Target audience for the announcement
  isImmediate: boolean; // Required: Indicates if the announcement or offer is immediate
  scheduledAt: string; // Required: ISO string for the scheduled date and time
  showOn: string; // Required: Where the announcement should show (e.g., banner, push notification, email)
  expiredAt: string; // Required: Expiration duration or "never"
}

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Get all announcements
async function getAnnouncement() {
  try {
    const { data } = await api.get("/api/announcement-offer");
    return data;
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return [];
  }
}

// Get announcement by id
async function getAnnouncementById(id: string) {
  try {
    const { data } = await api.get("/api/announcement-offer", {
      params: { id },
    });
    const announcement = data.find(
      (announcement: AnnouncementOrOffer) => announcement.id === id
    );
    return announcement;
  } catch (error) {
    console.error("Error fetching reminder by id:", error);
    throw error;
  }
}

// Create announcement
async function createAnnouncement(announcementData: AnnouncementOrOffer) {
  try {
    const { data } = await api.post(
      "/api/announcement-offer",
      announcementData
    );
    return data;
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw error;
  }
}

// Update announcement
async function updateAnnouncement(
  id: string,
  announcementData: Omit<AnnouncementOrOffer, "id">
) {
  try {
    const { data } = await api.put("/api/announcement-offer", {
      ...announcementData,
      id,
    });
    console.log(data, "inside Update func");
    return data;
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw error;
  }
}

// Delete announcement
async function deleteAnnouncement(id: string) {
  try {
    const { data } = await api.delete(`/api/announcement-offer`, {
      data: { id },
    });
    return data;
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
}

// Export properly
export {
  getAnnouncement,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
