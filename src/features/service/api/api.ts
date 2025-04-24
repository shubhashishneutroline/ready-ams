import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface Service {
  id: string;
  title: string;
  description: string;
  estimatedDuration: number;
  status: string;
}

async function getServices(): Promise<Service[]> {
  try {
    const { data } = await api.get('/api/service');
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export { getServices, type Service };
