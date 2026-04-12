import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function TestSessionPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="p-10 font-mono text-sm">
            <h1 className="text-2xl mb-4 text-black">Session Debugger</h1>
            <pre className="bg-gray-100 p-6 rounded-xl overflow-x-auto text-black border border-gray-300">
                {JSON.stringify(session, null, 2)}
            </pre>
            <div className="mt-8 text-black">
                <p>Role: {session?.user?.role || "NOT FOUND"}</p>
                <p>Permissions: {JSON.stringify(session?.user?.permissions) || "NOT FOUND"}</p>
            </div>
        </div>
    );
}
