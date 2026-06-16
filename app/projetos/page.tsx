import type { Metadata } from "next"
import { ProjectsGallery } from "./projects-gallery"

export const metadata: Metadata = {
  title: "Portfólio — Devnix",
  description: "Todos os projetos entregues pela Devnix — sites, sistemas, plataformas e soluções digitais sob medida.",
}

export default function ProjectsPage() {
  return <ProjectsGallery />
}
