import { WrongBookClient } from "@/components/wrong-book-client";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function WrongBookPage() {
  const records = await api.wrongQuestions();
  return <WrongBookClient records={records} />;
}
