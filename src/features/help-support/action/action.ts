import { retieveTicket } from "../api/api"

export const fetchTicket = async () => {
  const data = await retieveTicket()

  const customerData = data.filter((s: any) => s.userType === "USER")

  console.log(customerData, "CustomerDAta")
  return customerData
}


