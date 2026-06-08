# 個人履歷 SPA — 設計迭代 Prompt

> 將以下全文貼入 Claude.ai，Claude 會把 React component 渲染成 artifact，
> 你可以直接在旁邊描述要調整的設計細節，Claude 會即時更新畫面。

---

## 使用方式

1. 複製本文全部內容
2. 貼入 [claude.ai](https://claude.ai) 對話框
3. 送出後 Claude 會渲染出目前的設計
4. 接著用自然語言描述你要調整的部分即可（如「Hero 區塊改成左右分割，右邊放頭像」）

---

## Prompt 內容（從這裡開始複製）

---

以下是我的個人履歷 SPA React component（使用 Tailwind CSS）。
請先將它渲染成 artifact，讓我能看到目前的視覺設計，之後我會逐步告訴你要調整的細節。

**目前設計系統**
- 主題：深色（bg-slate-900）
- 強調色：indigo-400 / indigo-600
- 卡片背景：slate-800，hover 變 slate-700
- 文字：white / slate-300 / slate-400 三層
- 字型：Inter, system-ui
- 最大內容寬：max-w-5xl（1024px）

**頁面結構**
- Navbar：固定頂部，scroll 後出現模糊背景
- Hero：全螢幕置中，姓名 + 職稱 + 簡介 + 兩個 CTA 按鈕 + 社群 icon
- Projects：3 欄卡片 Grid，技術標籤 + GitHub/Demo 連結
- Contact：EmailJS 表單（姓名、Email、訊息）
- Footer：版權列

```jsx
import { useState, useEffect } from "react"
import { Github, Linkedin, ExternalLink } from "lucide-react"

const projects = [
  {
    title: "專案名稱 A",
    description: "簡短描述這個專案解決了什麼問題、使用了哪些技術，以及你在其中扮演的角色。",
    tags: ["React", "Vite", "Tailwind CSS"],
    github: "#",
    demo: "",
  },
  {
    title: "專案名稱 B",
    description: "簡短描述這個專案解決了什麼問題、使用了哪些技術，以及你在其中扮演的角色。",
    tags: ["Vue 3", "Pinia", "Node.js"],
    github: "#",
    demo: "#",
  },
  {
    title: "專案名稱 C",
    description: "簡短描述這個專案解決了什麼問題、使用了哪些技術，以及你在其中扮演的角色。",
    tags: ["TypeScript", "Express", "PostgreSQL"],
    github: "#",
    demo: "",
  },
]

const navLinks = [
  { label: "關於我", href: "#about" },
  { label: "作品集", href: "#projects" },
  { label: "聯絡", href: "#contact" },
]

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false)
  const [formStatus, setFormStatus] = useState("idle")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="bg-slate-900 min-h-screen text-white" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* Navbar */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-slate-900/95 shadow-lg backdrop-blur" : ""}`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="#" className="text-lg font-bold text-white">{"< Kevin />"}</a>
          <ul className="flex gap-8">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <a href={href} className="text-sm text-slate-300 hover:text-white transition-colors">{label}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section id="about" className="flex min-h-screen flex-col justify-center px-6 pt-16">
        <div className="mx-auto w-full max-w-5xl">
          <p className="mb-3 font-mono text-sm text-indigo-400">Hi, I'm</p>
          <h1 className="mb-3 text-5xl font-bold text-white">Your Name</h1>
          <h2 className="mb-6 text-2xl text-slate-400">Frontend Developer</h2>
          <p className="mb-8 max-w-xl leading-relaxed text-slate-400">
            專注於打造使用者體驗優良的前端應用，熟悉 React 與 Vue 生態系。
            喜歡將複雜的問題拆解成清晰的解決方案。
          </p>
          <div className="mb-12 flex gap-4">
            <a href="#projects" className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-500 transition-colors">
              查看作品集
            </a>
            <a href="#contact" className="rounded-lg border border-slate-600 px-6 py-3 text-sm font-medium text-slate-300 hover:border-slate-400 hover:text-white transition-colors">
              聯絡我
            </a>
          </div>
          <div className="flex gap-5">
            <a href="#" aria-label="GitHub" className="text-slate-500 hover:text-white transition-colors"><Github size={20} /></a>
            <a href="#" aria-label="LinkedIn" className="text-slate-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-3xl font-bold text-white">作品集</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.title} className="flex flex-col gap-4 rounded-xl bg-slate-800 p-6 hover:bg-slate-700 transition-colors">
                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                <p className="flex-1 text-sm leading-relaxed text-slate-400">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded bg-slate-900 px-2 py-1 text-xs text-indigo-400">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-4 border-t border-slate-700 pt-3">
                  {project.github && (
                    <a href={project.github} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                      <Github size={14} /> Code
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
                      <ExternalLink size={14} /> Demo
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 py-24">
        <div className="mx-auto max-w-lg">
          <h2 className="mb-4 text-3xl font-bold text-white">聯絡我</h2>
          <p className="mb-10 text-slate-400">有任何問題或合作邀約，歡迎傳訊息給我。</p>
          {formStatus === "sent" ? (
            <div className="rounded-xl border border-green-700 bg-green-900/30 p-6 text-green-400">
              訊息已送出！我會盡快回覆。
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setFormStatus("sent") }} className="flex flex-col gap-5">
              <div>
                <label className="mb-2 block text-sm text-slate-300">姓名</label>
                <input required placeholder="Your Name" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Email</label>
                <input type="email" required placeholder="your@email.com" className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">訊息</label>
                <textarea required rows={5} placeholder="Write your message..." className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <button type="submit" className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-500 transition-colors">
                送出訊息
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="mx-auto max-w-5xl text-center text-sm text-slate-500">
          © 2025 Kevin · Built with React & Tailwind CSS
        </div>
      </footer>

    </div>
  )
}
```

---

## 常用迭代指令（可直接貼給 Claude 繼續對話）

```
請把 Hero 改成左右分割版面，左側文字、右側放頭像佔位框
```

```
幫我設計一個技能區塊，放在 Hero 和 Projects 之間，用圖示 + 名稱排列
```

```
專案卡片加入 hover 時的邊框漸層動效，強調色維持 indigo
```

```
整體配色改為淺色主題，背景 gray-50，卡片 white，強調色不變
```

```
Navbar 加入 mobile hamburger menu，螢幕寬度 < 768px 時折疊
```

```
Hero 加入打字機效果，職稱文字循環輪播（Frontend Developer / React Engineer / ...）
```
