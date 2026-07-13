import { notFound } from "next/navigation"
import { getClientByFillToken } from "@/app/actions/leads"
import ClientFillForm from "./client-fill-form"

export default async function ClientFillPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const client = await getClientByFillToken(token)
  if (!client) notFound()

  return <ClientFillForm token={token} initial={client} />
}
