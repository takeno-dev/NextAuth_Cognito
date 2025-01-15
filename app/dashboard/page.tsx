import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/logout-button";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto text-black">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">ダッシュボード</h1>
            <LogoutButton />
          </div>

          <div className="space-y-4">
            <div className="border rounded p-4">
              <h2 className="font-semibold mb-2">ユーザー情報</h2>
              <p>メールアドレス: {session.user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
