
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'driver_secret_key_999_888';

export async function setDriverToken(driverId: string, name: string) {
    const token = jwt.sign({ driverId, name }, JWT_SECRET, { expiresIn: '7d' });
    const cookieStore = await cookies();
    cookieStore.set('driver_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });
}

export async function getDriverSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('driver_session')?.value;
    
    if (!token) return null;
    
    try {
        return jwt.verify(token, JWT_SECRET) as { driverId: string; name: string };
    } catch (error) {
        return null;
    }
}

export async function clearDriverSession() {
    const cookieStore = await cookies();
    cookieStore.delete('driver_session');
}
