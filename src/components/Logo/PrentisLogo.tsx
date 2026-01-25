export default function PrentisLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`text-2xl font-semibold text-[#0A1F44] ${className}`}>
      Pren<span className="text-[#17d7c1]">tis.</span>
    </div>
  )
}
