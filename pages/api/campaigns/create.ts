
import { prisma } from "../../../lib/prisma"

export default async function handler(req,res){

 if(req.method !== "POST"){
  return res.status(405).json({})
 }

 const {name,slug,description,status}=req.body

 const campaign = await prisma.campaign.create({
  data:{name,slug,description,status}
 })

 res.json(campaign)
}
