import { ExternalLink, Github } from 'lucide-react'

// TODO: 替換為實際專案資料
const projects = [
  {
    title: '專案名稱 A',
    description: '簡短描述這個專案解決了什麼問題、使用了哪些技術，以及你在其中扮演的角色。',
    tags: ['React', 'Vite', 'Tailwind CSS'],
    github: 'https://github.com/',
    demo: '',
  },
  {
    title: '專案名稱 B',
    description: '簡短描述這個專案解決了什麼問題、使用了哪些技術，以及你在其中扮演的角色。',
    tags: ['Vue 3', 'Pinia', 'Node.js'],
    github: 'https://github.com/',
    demo: 'https://example.com',
  },
  {
    title: '專案名稱 C',
    description: '簡短描述這個專案解決了什麼問題、使用了哪些技術，以及你在其中扮演的角色。',
    tags: ['TypeScript', 'Express', 'PostgreSQL'],
    github: 'https://github.com/',
    demo: '',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-3xl font-bold text-white">作品集</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.title}
              className="flex flex-col gap-4 rounded-xl bg-slate-800 p-6 transition-colors hover:bg-slate-700"
            >
              <h3 className="text-lg font-semibold text-white">{project.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-slate-400">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-slate-900 px-2 py-1 text-xs text-indigo-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4 border-t border-slate-700 pt-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <Github size={14} /> Code
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <ExternalLink size={14} /> Demo
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
