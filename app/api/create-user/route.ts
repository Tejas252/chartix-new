import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { teamMembers, teams, users } from "@/utils/db/schema";

export async function POST(req: Request) {
    const secret = req.headers.get("x-secret-token");
    if (secret !== process.env.WH_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { record } = await req.json();
    const { id, email } = record;
    const name = email.split('@')[0];

    await db.transaction(async (tx) => {
        // Create a user
        const [user] = await tx.insert(users).values({
            clerkId: id,
            email,
            name,
        }).returning();

        // Create a default team for the user
        const [team] = await tx.insert(teams).values({
            name: `${name}'s Team`,
            createdById: user.id,
        }).returning();

        // Add the user as an owner of the team
        await tx.insert(teamMembers).values({
            teamId: team.id,
            userId: user.id,
            role: 'OWNER',
        });
    });
    console.log(`User ${email} and their default team created successfully`);

    return NextResponse.json({ success: true });
}
