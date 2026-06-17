import { notFound } from "next/navigation"
import { getProjectBySlug, getProjects } from "@/app/actions/projects"
import { ProjectDetailClient } from "./project-detail-client"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: `${project.title} — Devnix`,
    description: project.desc,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ])
  if (!project) notFound()
  return <ProjectDetailClient project={project} allProjects={allProjects} />
}
