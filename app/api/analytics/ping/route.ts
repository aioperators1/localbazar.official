import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId } = body;

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
        }

        // Update active session
        await prisma.activeSession.upsert({
            where: { sessionId },
            update: { lastSeen: new Date() },
            create: { sessionId, lastSeen: new Date() }
        });

        // Also clean up old sessions (older than 5 minutes) randomly (10% chance) to keep DB clean
        if (Math.random() < 0.1) {
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            await prisma.activeSession.deleteMany({
                where: {
                    lastSeen: {
                        lt: fiveMinutesAgo
                    }
                }
            }).catch(() => {}); // ignore cleanup errors
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics ping error:', error);
        return NextResponse.json({ error: 'Failed to ping' }, { status: 500 });
    }
}
