import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-4">Could not find the requested resource</p>
      <Link
        href="/"
        className="px-4 py-2 bg-[#14B8A6] text-white rounded-lg hover:bg-[#0D9488]"
      >
        Return Home
      </Link>
    </div>
  )
}
