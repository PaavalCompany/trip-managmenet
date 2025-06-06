"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { MapPin, Loader2 } from "lucide-react"

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (session) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <MapPin className="mx-auto h-16 w-16 text-indigo-600 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Trip Management System
        </h1>
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-600 mr-2" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    </div>
  )
}
