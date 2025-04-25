import { getBaseUrl } from "@/lib/baseUrl";
import axios from "axios";

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});
console.log(api.defaults.baseURL);
interface SupportTicket {
  assignedTo: string;
  category: string;
  initiatedById: string;
  priority: string;
  proofFiles: string | null;
  resolutionDescription: string | null;
  status: string;
  subject: string;
  ticketDescription: string;
  userId: string;
  userType: string;
}

async function createTicket(ticketData: SupportTicket) {
  try {
    const { data } = await api.post("/api/ticket", ticketData);
    return data;
  } catch (error) {
    console.error("Error creating ticket:", error);
    throw error;
  }
}

export { createTicket };
