import { prisma } from "../../../lib/prisma"

export default async function handler(req, res) {

 const campaigns = await prisma.campaign.findMany({
  orderBy: { id: "desc" }
 })

 res.json(campaigns)
}