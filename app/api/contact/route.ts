import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill in all fields correctly." }, { status: 400 });
  }

  // NEXT STEP: wire this to an email provider (e.g. Resend, Postmark) or
  // store it in a Prisma table for the admin panel to review. For now this
  // route validates input and returns success so the form is fully wired
  // end-to-end once a delivery method is chosen.
  console.log("Contact form submission:", parsed.data);

  return NextResponse.json({ ok: true });
}
