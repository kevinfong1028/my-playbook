import { Github, Linkedin } from 'lucide-react'
import { useTypewriter } from '../hooks/useTypewriter'

const roles = ['Frontend Developer', 'React Engineer', 'Vue.js Developer', 'UI Engineer']

export default function Hero() {
  const typed = useTypewriter(roles)

  return (
    <section id="about" className="hero-glow relative flex min-h-screen flex-col justify-center px-6 pt-16">
      <div className="relative mx-auto w-full max-w-5xl">
        <p className="mb-5 font-mono text-sm text-acc">
          <span className="text-dim">$</span> whoami
        </p>
        <h1 className="mb-4 text-6xl font-bold leading-[1.05] tracking-tight text-fg">
          Your Name
        </h1>
        <h2 className="mb-7 flex items-center font-mono text-2xl text-mut">
          <span className="mr-2 text-acc">&gt;</span>
          <span>{typed}</span>
          <span className="cursor ml-0.5 h-6"></span>
        </h2>
        <p className="mb-9 max-w-xl text-[15px] leading-relaxed text-mut">
          {/* TODO: 替換為個人簡介 */}
          專注於打造使用者體驗優良的前端應用，熟悉 React 與 Vue 生態系。
          喜歡將複雜的問題拆解成清晰的解決方案。
        </p>
        <div className="mb-12 flex flex-wrap gap-4">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-md bg-acc px-6 py-3 font-mono text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-8px_rgba(170,204,0,0.5)]"
          >
            查看作品集 <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-line2 px-6 py-3 font-mono text-sm font-medium text-mut transition-colors hover:border-acc hover:text-acc"
          >
            <span className="text-dim">$</span> 聯絡我
          </a>
        </div>
        <div className="flex items-center gap-5">
          <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-dim transition-colors hover:text-acc">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-dim transition-colors hover:text-acc">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </section>
  )
}
