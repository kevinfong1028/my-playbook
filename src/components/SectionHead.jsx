export default function SectionHead({ index, children }) {
  return (
    <div className="mb-12 flex items-center gap-4">
      <span className="font-mono text-sm text-acc">{index}</span>
      <h2 className="text-3xl font-bold tracking-tight text-fg">{children}</h2>
      <span className="h-px flex-1 bg-line"></span>
    </div>
  )
}
