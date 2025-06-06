import { auth } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await auth();

  if (session) {
    return session.user;
  }

  return null;
}
