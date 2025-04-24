import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Business {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  logo?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

async function getBusinesses(): Promise<Business[]> {
  try {
    const { data } = await api.get("/api/business");
    return data;
  } catch (error) {
    console.error("Error fetching businesses:", error);
    return [];
  }
}

async function getBusinessById(id: string): Promise<Business | null> {
  try {
    const { data } = await api.get(`/api/business/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching business:", error);
    throw error;
  }
}

async function createBusiness(
  businessData: Omit<Business, "id">
): Promise<Business> {
  try {
    const { data } = await api.post("/api/business", businessData);
    return data;
  } catch (error) {
    console.error("Error creating business:", error);
    throw error;
  }
}

async function updateBusiness(
  id: string,
  businessData: Omit<Business, "id">
): Promise<Business> {
  try {
    const { data } = await api.put(`/api/business`, {
      ...businessData,
      id,
    });
    return data;
  } catch (error) {
    console.error("Error updating business:", error);
    throw error;
  }
}

async function deleteBusiness(id: string): Promise<void> {
  try {
    await api.delete(`/api/business/${id}`);
  } catch (error) {
    console.error("Error deleting business:", error);
    throw error;
  }
}

export {
  getBusinesses,
  getBusinessById,
  createBusiness,
  updateBusiness,
  deleteBusiness,
};
