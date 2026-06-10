export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 font-mono text-sm text-dim sm:flex-row">
        <span>© 2025 Kevin · Built with React &amp; Tailwind CSS</span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-acc shadow-[0_0_8px_rgba(170,204,0,0.8)]" />
          available for work
        </span>
      </div>
    </footer>
  )
}
