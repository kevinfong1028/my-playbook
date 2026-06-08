import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

// TODO: 替換為 EmailJS 帳號資訊
// 註冊後至 https://dashboard.emailjs.com 取得
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'

export default function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY,
      )
      setStatus('sent')
      formRef.current.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-lg">
        <h2 className="mb-4 text-3xl font-bold text-white">聯絡我</h2>
        <p className="mb-10 text-slate-400">有任何問題或合作邀約，歡迎傳訊息給我。</p>

        {status === 'sent' ? (
          <div className="rounded-xl border border-green-700 bg-green-900/30 p-6 text-green-400">
            訊息已送出！我會盡快回覆。
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">姓名</label>
              <input
                name="user_name"
                required
                placeholder="Your Name"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>
              <input
                name="user_email"
                type="email"
                required
                placeholder="your@email.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">訊息</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Write your message..."
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors focus:border-indigo-500"
              />
            </div>
            {status === 'error' && (
              <p className="text-sm text-red-400">送出失敗，請稍後再試。</p>
            )}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
            >
              {status === 'sending' ? '送出中...' : '送出訊息'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
