import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnimatedBackground } from "@/components/animated-background"
import { CustomCursor } from "@/components/custom-cursor"
import { QuemSomosContent } from "./quem-somos-content"

export const metadata: Metadata = {
  title: "Quem Somos | Elevanthe",
  description:
    "Conheça a Elevanthe — a empresa de tecnologia que eleva negócios por meio de desenvolvimento web, software personalizado e soluções digitais sob medida.",
  openGraph: {
    title: "Quem Somos | Elevanthe",
    description:
      "Conheça a Elevanthe — tecnologia que eleva negócios. Nossa missão, valores e a equipe por trás das soluções digitais.",
    url: "https://elevanthe.com/quem-somos",
  },
}

export default function QuemSomosPage() {
  return (
    <>
      <AnimatedBackground />
      <CustomCursor />
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <QuemSomosContent />
        <Footer />
      </div>
    </>
  )
}
