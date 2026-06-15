import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"

export async function GET() {
  try {
    const users = await db.select({ id: user.id }).from(user).limit(1)
    // Allow sign-up only if NO admin exists yet
    return NextResponse.json({ allowed: users.length === 0 })
  } catch {
    return NextResponse.json({ allowed: false }, { status: 500 })
  }
}
