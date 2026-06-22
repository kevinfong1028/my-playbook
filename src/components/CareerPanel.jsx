import { useRef, useEffect } from 'react'

const careers = [
  {
    period: '2022 – 現在',
    title: '資深前端工程師',
    company: 'ABC 科技股份有限公司',
    desc: '主導核心產品前端架構重構，導入 React 18 + Vite，頁面載入效能提升 40%。',
  },
  {
    period: '2020 – 2022',
    title: '前端工程師',
    company: 'XYZ 數位新創',
    desc: '開發 B2B SaaS 平台 UI，與設計師緊密協作，建立公司內部元件庫。',
  },
  {
    period: '2018 – 2020',
    title: '前端工程師',
    company: '某某電商平台',
    desc: '負責活動頁與結帳流程開發，Vue.js 為主要技術棧，累積千萬 UV 流量經驗。',
  },
  {
    period: '2017 – 2018',
    title: '網頁設計師（兼前端）',
    company: '設計工作室',
    desc: '切版、動效設計，兼顧視覺還原與跨裝置相容性。',
  },
  {
    period: '2013 – 2017',
    title: '資訊工程學士',
    company: '國立某某大學',
    desc: '主修軟體工程，輔修數位媒體設計。畢業專題榮獲系所優良作品。',
  },
]

const DOCK_RADIUS = 120
const DOCK_MAX_SCALE = 1.18

export default function CareerPanel({ open, onClose }) {
  const listRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleMouseMove = (e) => {
    if (!listRef.current) return
    listRef.current.querySelectorAll('li').forEach(item => {
      const rect = item.getBoundingClientRect()
      const cy = rect.top + rect.height / 2
      const dist = Math.abs(e.clientY - cy)
      const scale = dist < DOCK_RADIUS
        ? 1 + (DOCK_MAX_SCALE - 1) * (1 - dist / DOCK_RADIUS)
        : 1
      item.style.transform = `scale(${scale})`
    })
  }

  const handleMouseLeave = () => {
    if (!listRef.current) return
    listRef.current.querySelectorAll('li').forEach(item => {
      item.style.transform = 'scale(1)'
    })
  }

  const overlayStyle = {
    transition: 'opacity 240ms ease',
    opacity: open ? 1 : 0,
    pointerEvents: open ? 'auto' : 'none',
  }

  // 面板從右側浮現：fadeIn + scaleUp + 微小 translateX
  const panelStyle = {
    transition: 'opacity 240ms cubic-bezier(0.16,1,0.3,1), transform 240ms cubic-bezier(0.16,1,0.3,1)',
    opacity: open ? 1 : 0,
    transform: open ? 'translateX(0) scale(1)' : 'translateX(20px) scale(0.95)',
    pointerEvents: open ? 'auto' : 'none',
  }

  return (
    <>
      {/* 點擊背景關閉（輕透明，保留星空可見） */}
      <div style={overlayStyle} onClick={onClose} className="fixed inset-0 z-40 bg-black/20" />

      {/* 浮現面板：無框、右側從背景中浮出 */}
      <aside
        style={panelStyle}
        className="fixed right-0 top-0 z-50 h-full w-[480px]"
      >
        {/* 右側漸變背景：從右向左由深到透，無邊框 */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to left, rgba(10,13,15,0.90) 0%, rgba(10,13,15,0.70) 55%, transparent 100%)' }}
        />

        {/* 關閉按鈕 — 浮在右上角 */}
        <button
          onClick={onClose}
          aria-label="關閉"
          className="absolute right-8 top-8 z-10 font-mono text-sm text-dim transition-colors hover:text-acc"
        >
          ✕
        </button>

        {/* 標籤 */}
        <p className="absolute left-10 top-10 z-10 font-mono text-xs tracking-widest text-dim">
          ~/經歷
        </p>

        {/* 捲動容器 + 底部模糊漸變遮罩 */}
        <div className="relative flex h-full flex-col pt-28">
          {/* 捲動區 */}
          <ul
            ref={listRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="flex-1 overflow-y-auto px-10 pb-40 space-y-12 scrollbar-hide"
            style={{ scrollbarWidth: 'none' }}
          >
            {careers.map((c, i) => (
              <li
                key={i}
                style={{ transition: 'transform 130ms ease-out' }}
                className="origin-left cursor-default"
              >
                <p className="mb-2 font-mono text-sm tracking-widest text-dim">{c.period}</p>
                <p className="text-3xl font-bold leading-tight tracking-tight text-fg">{c.title}</p>
                <p className="mt-1 text-lg text-acc">{c.company}</p>
                <p className="mt-3 text-base leading-relaxed text-mut">{c.desc}</p>
              </li>
            ))}
          </ul>

          {/* 底部漸變 + 模糊遮罩：讓內容自然消隱 */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(10,13,15,0.6) 50%, rgba(10,13,15,0.92) 100%)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
            }}
          />
        </div>
      </aside>
    </>
  )
}
