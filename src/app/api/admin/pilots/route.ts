import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const pilots = await prisma.pilot.findMany({ orderBy: { criado_em: "desc" } });
        return NextResponse.json(pilots);
    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const body = await request.json();
        const pilot = await prisma.pilot.create({ data: body });
        return NextResponse.json(pilot);
    } catch (error) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
