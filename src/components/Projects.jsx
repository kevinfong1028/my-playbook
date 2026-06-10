import { useState, useEffect } from 'react'
import { Github, ExternalLink, X } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import SectionHead from './SectionHead'
import { projects } from '../data/projects'

function ProjectCard({ project, index, onOpen, delay = 0 }) {
  const [ref, shown] = useReveal()
  return (
    <article
      ref={ref}
      style={{
        transform: shown ? 'none' : 'translateY(40px)',
        opacity: shown ? 1 : 0,
        transition: `opacity .6s cubic-bezier(.2,.7,.3,1) ${delay}ms, transform .6s cubic-bezier(.2,.7,.3,1) ${delay}ms`,
      }}
      className="group relative flex flex-col gap-4 rounded-xl border border-line bg-panel p-6 hover:border-acc/60 hover:bg-panel2 hover:shadow-[0_18px_40px_-22px_rgba(170,204,0,0.45)]"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-dim">{index}</span>
        <span className="font-mono text-xs text-dim transition-colors group-hover:text-acc">{'/* project */'}</span>
      </div>
      <h3 className="font-mono text-lg font-semibold text-fg transition-colors group-hover:text-acc">
        {project.title}
      </h3>
      <p className="flex-1 text-sm leading-relaxed text-mut">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded border border-line2 bg-ink px-2 py-1 font-mono text-xs text-acc">
            {tag}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onOpen(project)}
        className="group/btn mt-1 flex items-center justify-between border-t border-line pt-4 font-mono text-sm text-mut transition-colors hover:text-acc"
      >
        <span><span className="text-dim transition-colors group-hover/btn:text-acc">$</span> detail</span>
        <span className="transition-transform group-hover/btn:translate-x-1">→</span>
      </button>
    </article>
  )
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="modal-overlay absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="modal-panel relative flex h-[70vh] w-[90vw] max-w-230 flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-2xl md:w-[60vw]">
        {/* title bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-line bg-ink/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-acc" />
            <span className="ml-3 hidden font-mono text-xs text-dim sm:inline">
              ~/projects/{project.id} — readme.md
            </span>
          </div>
          <button onClick={onClose} aria-label="Close" className="flex h-8 w-8 items-center justify-center rounded-md text-dim transition-colors hover:bg-panel2 hover:text-acc">
            <X size={18} />
          </button>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="ph mb-6 flex h-48 items-center justify-center rounded-lg border border-line sm:h-60">
            <span className="font-mono text-xs text-dim">{'// product shot'}</span>
          </div>
          <h3 className="mb-2 font-mono text-2xl font-bold text-fg">{project.title}</h3>
          <p className="mb-6 font-mono text-xs text-acc">&lt; {project.tags.join(' · ')} /&gt;</p>
          <p className="mb-7 leading-relaxed text-mut">{project.detail}</p>
          <div className="flex flex-wrap gap-3 border-t border-line pt-6">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 rounded-md bg-acc px-4 py-2 font-mono text-sm font-semibold text-ink transition-all hover:-translate-y-0.5">
                <Github size={15} /> Code
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 rounded-md border border-line2 px-4 py-2 font-mono text-sm text-mut transition-colors hover:border-acc hover:text-acc">
                <ExternalLink size={15} /> Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const [active, setActive] = useState(null)
  return (
    <section id="projects" className="px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <SectionHead index="02">作品集</SectionHead>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={String(idx + 1).padStart(2, '0')}
              onOpen={setActive}
              delay={idx * 120}
            />
          ))}
        </div>
      </div>
      {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
    </section>
  )
}
