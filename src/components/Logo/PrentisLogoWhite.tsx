export default function PrentisLogoWhite({ className = "" }: { className?: string }) {
  return (
    <div className={`text-2xl font-semibold text-white ${className}`}>
      Pren<span className="text-[#14B8A6]">tis.</span>
    </div>
  )
}
