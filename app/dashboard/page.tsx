"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, LogOut, MapPin } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-primary" />
              <h1 className="ml-3 text-2xl font-bold text-card-foreground">
                Trip Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {session.user?.name}
              </span>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-lg shadow border border-border p-6">
          <div className="text-center py-12">
            <MapPin className="mx-auto h-16 w-16 text-primary" />
            <h2 className="mt-4 text-2xl font-bold text-card-foreground">
              Trip Management Dashboard
            </h2>
            <p className="mt-2 text-muted-foreground">
              Create and manage trip bookings with ease
            </p>
            <div className="mt-8">
              <Button
                size="lg"
                onClick={() => router.push("/trips/new")}
                className="inline-flex items-center px-6 py-3"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Create New Trip
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg shadow border border-border p-6">
            <h3 className="text-lg font-semibold text-card-foreground">Quick Actions</h3>
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push("/trips/new")}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Trip
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow border border-border p-6">
            <h3 className="text-lg font-semibold text-card-foreground">Features</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Auto-generated Trip IDs</li>
              <li>• Google Sheets Integration</li>
              <li>• Dynamic Tally Links</li>
              <li>• Comprehensive Form Validation</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg shadow border border-border p-6">
            <h3 className="text-lg font-semibold text-card-foreground">Travel Types</h3>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              <li>• School & College</li>
              <li>• Office & Business</li>
              <li>• Family & Couples</li>
              <li>• Honeymoon & Resort</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
} 