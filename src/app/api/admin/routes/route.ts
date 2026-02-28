import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const routes = await prisma.route.findMany({
            orderBy: { criado_em: "desc" },
        });

        return NextResponse.json(routes);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const route = await prisma.route.create({
            data: {
                numero_voo: body.numero_voo,
                origem: body.origem,
                destino: body.destino,
                distancia_nm: Number(body.distancia_nm),
                duracao_media: body.duracao_media,
                aeronave: body.aeronave,
                simbrief_link: body.simbrief_link,
                ativo: body.ativo ?? true,
            },
        });

        return NextResponse.json(route);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
