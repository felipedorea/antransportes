import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const admin = await prisma.adminUser.findUnique({ where: { id: session.userId } });
        if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json({
            id: admin.id,
            nome: admin.nome,
            email: admin.email,
            foto_url: admin.foto_url || null,
        });
    } catch (error) {
        console.error("GET /api/admin/profile error:", error);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const updateData: Record<string, unknown> = {};

        if (typeof body.nome === "string" && body.nome.trim()) updateData.nome = body.nome.trim();
        if (typeof body.email === "string" && body.email.trim()) updateData.email = body.email.trim();
        if (body.foto_url !== undefined) updateData.foto_url = body.foto_url || null;
        if (typeof body.senha === "string" && body.senha.length >= 4) {
            updateData.senha_hash = await bcrypt.hash(body.senha, 10);
        }

        const updated = await prisma.adminUser.update({
            where: { id: session.userId },
            data: updateData,
        });

        return NextResponse.json({
            id: updated.id,
            nome: updated.nome,
            email: updated.email,
            foto_url: updated.foto_url || null,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error("PUT /api/admin/profile error:", error);
        return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
    }
}
