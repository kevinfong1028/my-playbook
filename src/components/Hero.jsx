import { Github, Linkedin } from 'lucide-react'

export default function Hero() {
  return (
    <section id="about" className="flex min-h-screen flex-col justify-center px-6 pt-16">
      <div className="mx-auto w-full max-w-5xl">
        <p className="mb-3 font-mono text-sm text-indigo-400">Hi, I'm</p>
        <h1 className="mb-3 text-5xl font-bold text-white">Your Name</h1>
        <h2 className="mb-6 text-2xl text-slate-400">Frontend Developer</h2>
        <p className="mb-8 max-w-xl leading-relaxed text-slate-400">
          {/* TODO: 替換為個人簡介 */}
          專注於打造使用者體驗優良的前端應用，熟悉 React 與 Vue 生態系。
          喜歡將複雜的問題拆解成清晰的解決方案。
        </p>
        <div className="mb-12 flex gap-4">
          <a
            href="#projects"
            className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
          >
            查看作品集
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-slate-400 hover:text-white"
          >
            聯絡我
          </a>
        </div>
        <div className="flex gap-5">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-slate-500 transition-colors hover:text-white"
          >
            <Github size={20} />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-slate-500 transition-colors hover:text-white"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </section>
  )
}
