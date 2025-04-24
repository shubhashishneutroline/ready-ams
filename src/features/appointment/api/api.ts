import { getBaseUrl } from "@/lib/baseUrl";
import axios from "axios";

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});
console.log(api.defaults.baseURL) ;
export interface AppointmentData {
  id?: string;
  customerName: string;
  email: string;
  phone: string;
  serviceId: string;
  selectedDate: string;
  selectedTime: string;
  message?: string;
  userId?: string;
  isForSelf?: boolean;
  bookedById?: string;
  createdById?: string;
  status?: string;
}

async function getAppointments() {
  try {
    const { data } = await api.get("/api/appointment");
    return data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

async function getAppointmentById(id: string) {
  try {
    const { data } = await api.get("/api/appointment", {
      params: { id },
    });
    const appointment = data.find(
      (appointment: AppointmentData) => appointment.id === id
    );

    return appointment;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
}

async function createAppointment(appointmentData: AppointmentData) {
  try {
    const { data } = await api.post("/api/appointment", appointmentData);
    return data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}

async function updateAppointment(
  id: string,
  appointmentData: Omit<AppointmentData, "id">
) {
  try {
    const { data } = await api.put(`/api/appointment`, {
      ...appointmentData,
      id,
      status: appointmentData.status || "SCHEDULED",
    });
    return data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
}

async function deleteAppointment(appointmentData: Omit<AppointmentData, "id">) {
  try {
    const { data } = await api.delete(`/api/appointment`, {
      data: appointmentData,
    });
    return data;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
}

export {
  getAppointments,
  createAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
