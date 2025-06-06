"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { tripSchema, type TripFormData } from "@/lib/validations"
import { generateTripId, formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MapPin,
  ArrowLeft,
  CheckCircle,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react"

export default function NewTripPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success: boolean
    tripId?: string
    tallyLink?: string
    message?: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      tripId: generateTripId(),
    },
  })

  const budgetValue = watch("budget")

  const onSubmit = async (data: TripFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/trips/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitResult({
          success: true,
          tripId: result.tripId,
          tallyLink: result.tallyLink,
          message: result.message,
        })
      } else {
        setSubmitResult({
          success: false,
          message: result.error || "Failed to create trip",
        })
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Network error. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (submitResult?.success) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Trip Created Successfully!
            </h1>
            <p className="text-gray-600 mb-6">{submitResult.message}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-2">Trip ID</p>
              <div className="flex items-center justify-center space-x-2">
                <code className="text-lg font-mono bg-white px-3 py-2 rounded border">
                  {submitResult.tripId}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(submitResult.tripId!)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {submitResult.tallyLink && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-600 mb-2">Tally Form Link</p>
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <code className="text-sm bg-white px-3 py-2 rounded border flex-1">
                    {submitResult.tallyLink}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(submitResult.tallyLink!)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={() => window.open(submitResult.tallyLink, "_blank")}
                  className="inline-flex items-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Form
                </Button>
              </div>
            )}

            <div className="space-y-3">
              <Button
                onClick={() => {
                  setSubmitResult(null)
                  setValue("tripId", generateTripId())
                }}
                className="w-full"
              >
                Create Another Trip
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MapPin className="h-8 w-8 text-indigo-600 mr-3" />
            Create New Trip
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in the details to create a new trip booking
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="tripId">Trip ID</Label>
                <Input
                  id="tripId"
                  className="mt-1 bg-gray-50"
                  readOnly
                  {...register("tripId")}
                />
                {errors.tripId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tripId.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="date">Trip Date *</Label>
                <Input
                  id="date"
                  type="date"
                  className="mt-1"
                  {...register("date")}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.date.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="destination">Destination *</Label>
                <Input
                  id="destination"
                  className="mt-1"
                  placeholder="Enter destination"
                  {...register("destination")}
                />
                {errors.destination && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.destination.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="numberOfDays">Number of Days *</Label>
                <Input
                  id="numberOfDays"
                  type="number"
                  min="1"
                  max="365"
                  className="mt-1"
                  placeholder="Number of days"
                  {...register("numberOfDays", { valueAsNumber: true })}
                />
                {errors.numberOfDays && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.numberOfDays.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="budget">Budget (INR) *</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-1"
                  placeholder="Enter budget amount"
                  {...register("budget", { valueAsNumber: true })}
                />
                {budgetValue && budgetValue > 0 && !isNaN(budgetValue) && (
                  <p className="mt-1 text-sm text-gray-600">
                    {formatCurrency(budgetValue)}
                  </p>
                )}
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.budget.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="numberOfPeople">Number of People *</Label>
                <Input
                  id="numberOfPeople"
                  type="number"
                  min="1"
                  max="50"
                  className="mt-1"
                  placeholder="Number of people"
                  {...register("numberOfPeople", { valueAsNumber: true })}
                />
                {errors.numberOfPeople && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.numberOfPeople.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Trip Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="travelType">Travel Type *</Label>
                <Controller
                  name="travelType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select travel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bachelor">Bachelor</SelectItem>
                        <SelectItem value="School">School</SelectItem>
                        <SelectItem value="College">College</SelectItem>
                        <SelectItem value="Resort booking">Resort booking</SelectItem>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Couple">Couple</SelectItem>
                        <SelectItem value="Strangers">Strangers</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Honeymoon">Honeymoon</SelectItem>
                        <SelectItem value="Ticket Booking">Ticket Booking</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.travelType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.travelType.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="hotelDetails">Hotel Rating *</Label>
                <Controller
                  name="hotelDetails"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select hotel rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 star">1 star</SelectItem>
                        <SelectItem value="2 star">2 star</SelectItem>
                        <SelectItem value="3 star">3 star</SelectItem>
                        <SelectItem value="4 star">4 star</SelectItem>
                        <SelectItem value="5 star">5 star</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.hotelDetails && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.hotelDetails.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="placeType">Place Type *</Label>
                <Controller
                  name="placeType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select place type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Snowy Area">Snowy Area</SelectItem>
                        <SelectItem value="Hill Station">Hill Station</SelectItem>
                        <SelectItem value="Cultural">Cultural</SelectItem>
                        <SelectItem value="Adventure">Adventure</SelectItem>
                        <SelectItem value="Beach">Beach</SelectItem>
                        <SelectItem value="Devotional">Devotional</SelectItem>
                        <SelectItem value="City">City</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.placeType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.placeType.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="transportMode">Transport Mode *</Label>
                <Controller
                  name="transportMode"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select transport mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Flight">Flight</SelectItem>
                        <SelectItem value="Train">Train</SelectItem>
                        <SelectItem value="Bus">Bus</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.transportMode && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.transportMode.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="destinationCategory">Destination Category *</Label>
                <Controller
                  name="destinationCategory"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select destination category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="South India">South India</SelectItem>
                        <SelectItem value="Central India">Central India</SelectItem>
                        <SelectItem value="North India">North India</SelectItem>
                        <SelectItem value="North East India">North East India</SelectItem>
                        <SelectItem value="GCC">GCC</SelectItem>
                        <SelectItem value="Asia">Asia</SelectItem>
                        <SelectItem value="Europe">Europe</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.destinationCategory && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.destinationCategory.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="channel">Channel *</Label>
                <Controller
                  name="channel"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Whatsapp">Whatsapp</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Referral">Referral</SelectItem>
                        <SelectItem value="Ads">Ads</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.channel && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.channel.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Itinerary
            </h2>
            <div>
              <Label htmlFor="itinerary">Detailed Itinerary *</Label>
              <Textarea
                id="itinerary"
                className="mt-1"
                rows={6}
                placeholder="Provide a detailed itinerary for the trip..."
                {...register("itinerary")}
              />
              {errors.itinerary && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.itinerary.message}
                </p>
              )}
            </div>
          </div>

          {submitResult?.success === false && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{submitResult.message}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Trip...
                </>
              ) : (
                "Create Trip"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 