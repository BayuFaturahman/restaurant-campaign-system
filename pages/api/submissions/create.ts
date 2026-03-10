
import { prisma } from "../../../lib/prisma"

export default async function handler(req,res){

 const {name,email,phone,campaignId}=req.body

 const submission = await prisma.submission.create({
  data:{
   name,email,phone,campaignId
  }
 })

 res.json(submission)
}
