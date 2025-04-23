import { prisma } from "../lib/prisma"

// get service by id
async function getBusinessDetailById(id: string) {
  return await prisma.businessDetail.findUnique({
    where: {
      id,
    },
  })
}

export { getBusinessDetailById }
