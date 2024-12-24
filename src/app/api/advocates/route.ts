import type { NextRequest } from 'next/server'
import { ilike, or } from 'drizzle-orm'
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: NextRequest) {
  let data
  if (process.env.USE_DB === true.toString()) {
    const searchTerm = request.nextUrl.searchParams.get('term')
    data = await db
      .select()
      .from(advocates)
      .where(searchTerm ? or(
        ilike(advocates.firstName, `%${searchTerm}%`),
        ilike(advocates.lastName, `%${searchTerm}%`),
        ilike(advocates.city, `%${searchTerm}%`),
        ilike(advocates.degree, `%${searchTerm}%`),
      ) : undefined)
  } else {
    data = advocateData;
  }

  return Response.json({ data });
}
