import { getBaseUrl } from "@/lib/baseUrl";
import axios from "axios";

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});
export interface Customer {
  id?: number | string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  isActive?: boolean;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

async function getCustomers() {
  try {
    const { data } = await api.get("/api/user");
    return data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}
async function getCoustomersById(id: string) {
  try {
    const { data } = await api.get("/api/user", {
      params: { id },
    });
    const customer = data.find((customer: Customer) => customer.id === id);

    return customer;
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw error;
  }
}

async function createCustomer(customerData: Customer) {
  try {
    const { data } = await api.post("/api/user", customerData);
    return data;
  } catch (error) {
    console.error("Error creating Customer:", error);
    throw error;
  }
}

async function updateCustomer(id: string, customerData: Omit<Customer, "id">) {
  try {
    const { data } = await api.put(`/api/user`, {
      ...customerData,
      id,
    });
    console.log(data, "inside Update func");
    return data;
  } catch (error) {
    console.error("Error updating Customer:", error);
    throw error;
  }
}

async function deleteCustomer(customer: Omit<Customer, "id">) {
  try {
    const { data } = await api.delete(`/api/user`, {
      data: customer,
    });
    return data;
  } catch (error) {
    console.error("Error deleting Customer:", error);
    throw error;
  }
}

export {
  getCustomers,
  getCoustomersById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
