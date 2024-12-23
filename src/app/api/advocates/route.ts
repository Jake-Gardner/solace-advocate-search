import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET() {
  let data
  if (process.env.USE_DB === true.toString()) {
    data = await db.select().from(advocates);
  } else {
    data = advocateData;
  }

  return Response.json({ data });
}
