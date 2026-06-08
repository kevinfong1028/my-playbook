export default function Footer() {
  return (
    <footer className="border-t border-slate-800 px-6 py-8">
      <div className="mx-auto max-w-5xl text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Kevin · Built with React & Tailwind CSS
      </div>
    </footer>
  )
}
