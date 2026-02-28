import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        let config = await prisma.globalConfig.findUnique({
            where: { id: "global" }
        });

        if (!config) {
            config = await prisma.globalConfig.create({
                data: {
                    id: "global",
                    whatsapp: "",
                    instagram: "",
                    facebook: "",
                    discord: "",
                    formulario: ""
                }
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching config" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, updated_at, ...updateData } = body;

        const config = await prisma.globalConfig.upsert({
            where: { id: "global" },
            update: updateData,
            create: {
                id: "global",
                ...updateData
            }
        });

        return NextResponse.json(config);
    } catch (error) {
        return NextResponse.json({ error: "Error updating config" }, { status: 500 });
    }
}
