import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const routes = await prisma.route.findMany({
            where: { ativo: true },
            orderBy: { criado_em: "desc" },
        });
        return NextResponse.json(routes);
    } catch (error) {
        return NextResponse.json([], { status: 500 });
    }
}
