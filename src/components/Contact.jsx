import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import SectionHead from './SectionHead'

// TODO: 替換為 EmailJS 帳號資訊
// 註冊後至 https://dashboard.emailjs.com 取得
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'

const inputCls = 'w-full rounded-lg border border-line bg-panel px-4 py-3 text-fg placeholder-dim outline-none transition-all focus:border-acc focus:shadow-[0_0_0_3px_rgba(170,204,0,0.15)]'

function Field({ label, prompt, children }) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 font-mono text-sm text-mut">
        <span className="text-acc">{prompt}</span> {label}
      </label>
      {children}
    </div>
  )
}

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formRef.current, EMAILJS_PUBLIC_KEY)
      setStatus('sent')
      formRef.current.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="px-6 py-28">
      <div className="mx-auto max-w-lg">
        <SectionHead index="03">聯絡我</SectionHead>
        <p className="mb-10 text-mut">有任何問題或合作邀約，歡迎傳訊息給我。</p>

        {status === 'sent' ? (
          <div className="rounded-xl border border-acc/40 bg-accdim/60 p-6 font-mono text-acc">
            <span className="mr-1">✓</span> 訊息已送出！我會盡快回覆。
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field label="姓名" prompt="$">
              <input name="user_name" required placeholder="Your Name" className={inputCls} />
            </Field>
            <Field label="Email" prompt="$">
              <input name="user_email" type="email" required placeholder="your@email.com" className={inputCls} />
            </Field>
            <Field label="訊息" prompt="$">
              <textarea name="message" required rows={5} placeholder="Write your message..." className={inputCls + ' resize-none'} />
            </Field>
            {status === 'error' && (
              <p className="font-mono text-sm text-red-400">送出失敗，請稍後再試。</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-acc px-6 py-3 font-mono font-semibold text-ink transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-8px_rgba(170,204,0,0.5)] disabled:opacity-50"
            >
              {status === 'sending' ? '送出中...' : <>送出訊息 <span className="transition-transform group-hover:translate-x-1">→</span></>}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
