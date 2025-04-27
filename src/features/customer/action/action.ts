import { getCustomers } from "../api/api"

const fetchCustomer = async () => {
  const customerData = await getCustomers()
  return customerData
}

export const customerData = await fetchCustomer()
