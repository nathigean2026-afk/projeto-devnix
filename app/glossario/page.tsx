import type { Metadata } from "next"
import { GlossaryClient } from "./glossary-client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Glossário de Negócios | Elevanthe",
  description:
    "Os termos que todo dono de negócio deveria conhecer. Marketing, Finanças, Gestão, Operações e Produto explicados de forma direta.",
}

export default function GlossarioPage() {
  return (
    <>
      <Navbar />
      <main>
        <GlossaryClient />
      </main>
      <Footer />
    </>
  )
}
