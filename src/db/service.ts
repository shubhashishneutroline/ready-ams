import { prisma } from "../lib/prisma"

// get service by id
async function getServiceById(id: string) {
  return await prisma.service.findUnique({
    where: {
      id: id,
    },
  })
}

export { getServiceById }
