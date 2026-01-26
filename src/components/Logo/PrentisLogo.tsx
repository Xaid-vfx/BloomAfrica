export default function PrentisLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`text-2xl font-semibold ${className}`}>
      <span className="text-[#0A1F44]">Pren</span><span className="text-[#17d7c1]">tis</span><span className="text-[#0A1F44]">.</span>
    </div>
  )
}
