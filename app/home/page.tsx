import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Diro Verification Portal</h1>
      <Link href="/validation-buttons" className="text-blue-600 hover:underline">
        Go to Validation Buttons
      </Link>
    </div>
  )
}

