const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@fsbrothers.com.br';
    const password = 'admin';
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Admin
    const admin = await prisma.adminUser.upsert({
        where: { email },
        update: {},
        create: {
            nome: 'Comandante Silva',
            email,
            senha_hash: hashedPassword,
            nivel_acesso: 'master',
        },
    });

    // 2. Pilots
    await prisma.pilot.createMany({
        data: [
            { nome: 'Felipe Dorea', cargo: 'Comandante Master', descricao: 'Piloto fundador da companhia com mais de 5000h de voo virtual.', ativo: true },
            { nome: 'Henrique Almeida', cargo: 'Primeiro Oficial', descricao: 'Especialista em operações PMDG e voos transatlânticos.', ativo: true },
            { nome: 'Ana Costa', cargo: 'Instrutora de Voo', descricao: 'Responsável pelo treinamento de novos membros.', ativo: true },
        ],
        skipDuplicates: true
    });

    // 3. Routes
    await prisma.route.createMany({
        data: [
            { numero_voo: 'FSB101', origem: 'SBGR', destino: 'SBRJ', aeronave: 'Airbus A320neo', distancia_nm: 220, duracao_media: '00:50', simbrief_link: 'https://www.simbrief.com', ativo: true },
            { numero_voo: 'FSB202', origem: 'SBGR', destino: 'SBGL', aeronave: 'Boeing 737-800', distancia_nm: 215, duracao_media: '00:45', simbrief_link: 'https://www.simbrief.com', ativo: true },
            { numero_voo: 'FSB303', origem: 'SBKP', destino: 'SBSP', aeronave: 'ATR 72-600', distancia_nm: 45, duracao_media: '00:30', simbrief_link: 'https://www.simbrief.com', ativo: true },
        ],
        skipDuplicates: true
    });

    // 4. Liveries
    await prisma.livery.createMany({
        data: [
            { nome: 'FS Brothers Classic Blue', aeronave: 'A32NX', pintura_url: 'https://images.unsplash.com/photo-1544016768-982d1554f0b9?auto=format&fit=crop&q=80', download_url: 'https://flightsim.to', ativo: true },
            { nome: 'Orange Pride Special', aeronave: 'PMDG 737-800', pintura_url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80', download_url: 'https://flightsim.to', ativo: true },
        ],
        skipDuplicates: true
    });

    // 5. Apps
    await prisma.app.createMany({
        data: [
            { nome: 'FSB Tracker', descricao: 'Nosso rastreador oficial de voos e telemetria.', versao: '2.1.0', download_url: 'https://github.com', ativo: true },
            { nome: 'EFB Connect', descricao: 'Integrate seu tablet com o cockpit em tempo real.', versao: '1.0.5', download_url: 'https://github.com', ativo: true },
        ],
        skipDuplicates: true
    });

    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
