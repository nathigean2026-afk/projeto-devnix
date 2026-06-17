import type { Metadata } from "next"
import { getProjects } from "@/app/actions/projects"
import { ProjectsGallery } from "./projects-gallery"

export const metadata: Metadata = {
  title: "Portfólio — Devnix",
  description: "Todos os projetos entregues pela Devnix — sites, sistemas, plataformas e soluções digitais sob medida.",
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectsGallery projects={projects} />
}
