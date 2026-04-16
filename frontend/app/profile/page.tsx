import { ProfileClient } from "@/components/profile-client";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const data = await api.profile();
  return <ProfileClient data={data} />;
}
