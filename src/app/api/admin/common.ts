import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Common handler for simple list/create operations
async function handleList(model: any) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const items = await prisma[model].findMany({ orderBy: { criado_em: "desc" } });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Routes for Pilots
export async function GET_pilots() { return handleList('pilot'); }

// Routes for Liveries
export async function GET_liveries() { return handleList('livery'); }

// Routes for Apps
export async function GET_apps() { return handleList('app'); }
