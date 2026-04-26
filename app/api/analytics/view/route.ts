import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId, url } = body;

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
        }

        // 1. Log the view
        await prisma.siteView.create({
            data: {
                sessionId,
                url
            }
        });

        // 2. Update active session
        await prisma.activeSession.upsert({
            where: { sessionId },
            update: { lastSeen: new Date() },
            create: { sessionId, lastSeen: new Date() }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics view error:', error);
        return NextResponse.json({ error: 'Failed to log view' }, { status: 500 });
    }
}
