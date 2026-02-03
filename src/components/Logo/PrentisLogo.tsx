type PrentisLogoProps = {
  className?: string
  variant?: 'default' | 'light'  // 'light' = white "Pren" for dark backgrounds
}

export default function PrentisLogo({ className = "", variant = 'default' }: PrentisLogoProps) {
  const isLight = variant === 'light'

  return (
    <div className={`text-2xl font-semibold ${className}`}>
      <span className={isLight ? 'text-white' : 'text-[#0A1F44]'}>Pren</span>
      <span className="text-[#17d7c1]">tis</span>
      <span className={isLight ? 'text-white' : 'text-[#0A1F44]'}>.</span>
    </div>
  )
}
