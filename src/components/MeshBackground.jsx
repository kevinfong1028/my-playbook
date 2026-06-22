import { useEffect, useRef } from 'react'

export default function MeshBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const LINK = 116
    const PTR = 180
    const DENSITY = 5200
    const SPEED = 0.14
    const PARALLAX = 26
    const RGB = '170,204,0'

    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0
    let nodes = []
    // strength: 目標值 (1=在視窗內, 0=離開)；easedStrength: 緩動後的實際值
    const ptr = { x: 0, y: 0, strength: 0 }
    const eased = { x: 0, y: 0, strength: 0 }

    const makeNodes = () => {
      const count = Math.round((w * h) / DENSITY)
      nodes = Array.from({ length: count }, () => {
        const z = Math.random()
        return {
          x: Math.random() * w, y: Math.random() * h, z,
          vx: (Math.random() - 0.5) * SPEED * (0.5 + z),
          vy: (Math.random() - 0.5) * SPEED * (0.5 + z),
          rx: 0, ry: 0,
        }
      })
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // 初始化 eased 位置到畫面中心，避免首次進入時從奇怪位置緩動
      ptr.x = w / 2; ptr.y = h / 2
      eased.x = w / 2; eased.y = h / 2
      makeNodes()
    }
    resize()

    const step = () => {
      eased.x += (ptr.x - eased.x) * 0.1
      eased.y += (ptr.y - eased.y) * 0.1
      // strength 緩動：進入/離開都平滑過渡，避免瞬間跳動
      eased.strength += (ptr.strength - eased.strength) * 0.08

      const s = eased.strength
      const px = ((eased.x - w / 2) / (w / 2)) * s
      const py = ((eased.y - h / 2) / (h / 2)) * s

      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy
        if (n.x < -30) n.x = w + 30; else if (n.x > w + 30) n.x = -30
        if (n.y < -30) n.y = h + 30; else if (n.y > h + 30) n.y = -30
        const shift = (n.z - 0.5) * PARALLAX
        n.rx = n.x - px * shift
        n.ry = n.y - py * shift
      }

      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.rx - b.rx, dy = a.ry - b.ry
          const d = Math.hypot(dx, dy)
          const zAvg = (a.z + b.z) / 2
          const reach = LINK * (0.7 + zAvg * 0.6)
          if (d < reach) {
            const t = 1 - d / reach
            let glow = 0
            if (s > 0.01) {
              const mx = (a.rx + b.rx) / 2 - eased.x
              const my = (a.ry + b.ry) / 2 - eased.y
              const pd = Math.hypot(mx, my)
              if (pd < PTR) glow = (1 - pd / PTR) ** 2 * s
            }
            const alpha = (0.03 + t * 0.08) * (0.45 + zAvg * 0.85) + glow * 0.3
            ctx.strokeStyle = `rgba(${RGB},${alpha})`
            ctx.lineWidth = (0.4 + zAvg * 0.7) + glow * 0.6
            ctx.beginPath(); ctx.moveTo(a.rx, a.ry); ctx.lineTo(b.rx, b.ry); ctx.stroke()
          }
        }
      }

      for (const n of nodes) {
        let r = 0.5 + n.z * 1.8
        let a = 0.18 + n.z * 0.42
        if (s > 0.01) {
          const pd = Math.hypot(n.rx - eased.x, n.ry - eased.y)
          if (pd < PTR) {
            const e = (1 - pd / PTR) ** 2 * s
            r += e * 1.8
            a = Math.min(1, a + e * 0.5)
          }
        }
        ctx.beginPath(); ctx.arc(n.rx, n.ry, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${RGB},${a})`; ctx.fill()
      }
    }

    let raf = 0
    const loop = () => { step(); raf = requestAnimationFrame(loop) }

    const onMove = (e) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.strength = 1 }
    const onLeave = () => { ptr.strength = 0 }

    if (reduced) {
      step()
    } else {
      window.addEventListener('pointermove', onMove, { passive: true })
      window.addEventListener('pointerdown', onMove, { passive: true })
      document.addEventListener('pointerleave', onLeave)
      loop()
    }
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', resize)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10" />
}
