
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function TestDB() {
    let users: Awaited<ReturnType<typeof prisma.user.findMany>> = [];
    let error = null;

    try {
        users = await prisma.user.findMany();
    } catch (e: unknown) {
        error = e instanceof Error ? e.message : String(e);
    }

    if (error) {
        return <div className="p-10 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-10 bg-black text-white font-mono">
            <h1 className="text-2xl mb-4">Database Connection Test</h1>
            <p>User Count: {users.length}</p>
            <div className="space-y-2 mt-4">
                {users.map(u => (
                    <div key={u.id} className="border p-2">
                        <p>Email: {u.email}</p>
                        <p>Role: {u.role}</p>
                        <p>Password Hash: {u.password.substring(0, 10)}...</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
