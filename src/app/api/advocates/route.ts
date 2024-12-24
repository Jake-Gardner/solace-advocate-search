import type { NextRequest } from 'next/server'
import { ilike, or } from 'drizzle-orm'
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET(request: NextRequest) {
  let data
  if (process.env.USE_DB === true.toString()) {
    const { searchParams } = request.nextUrl
    const searchTerm = searchParams.get('term')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    data = await db
      .select()
      .from(advocates)
      .where(searchTerm ? or(
        ilike(advocates.firstName, `%${searchTerm}%`),
        ilike(advocates.lastName, `%${searchTerm}%`),
        ilike(advocates.city, `%${searchTerm}%`),
        ilike(advocates.degree, `%${searchTerm}%`),
      ) : undefined)
      .limit(limit)
      .offset(offset)
  } else {
    data = advocateData;
  }

  return Response.json({ data });
}
