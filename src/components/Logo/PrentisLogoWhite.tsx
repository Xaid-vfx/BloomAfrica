export default function PrentisLogoWhite({ className = "" }: { className?: string }) {
  return (
    <div className={`text-2xl font-semibold text-white ${className}`}>
      Pren<span className="text-[#17d7c1]">tis.</span>
    </div>
  )
}
