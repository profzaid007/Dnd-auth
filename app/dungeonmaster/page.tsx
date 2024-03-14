import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Logout from "../components/Logout";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();
  if (!data.session?.user) {
    redirect("/login");
  }

  const profile = await prisma.profile.findUnique({
    where: { id: data.session.user.id },
  });

  if (profile?.role !== "dungeonmaster") {
    redirect("/");
  }
  return (
    <main>
      <h1 className="text-2xl text-center mb-8">Dungeonmaster page</h1>
      <pre>{JSON.stringify({ profile }, null, 4)}</pre>
      <Logout />
    </main>
  );
}