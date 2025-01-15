import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import SignUpForm from "./signup-form";

export default async function SignUpPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            アカウント作成
          </h2>
        </div>
        <SignUpForm />
      </div>
    </main>
  );
}
