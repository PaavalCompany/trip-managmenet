"use client"

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
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { tripSchema, type TripFormData } from "@/lib/validations"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, CheckCircle, MapPin, Loader2 } from "lucide-react"
import { generateTripId, formatCurrency } from "@/lib/utils"

export default function NewTripPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success: boolean
    tripId?: string
    destination?: string
    tallyUrl?: string
    message?: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
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
          destination: data.destination,
          tallyUrl: result.tallyUrl,
          message: result.message,
        })
      } else {
        setSubmitResult({
          success: false,
          message: result.error || "Failed to create trip",
        })
      }
    } catch {
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
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-lg shadow-lg border border-border p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-card-foreground mb-2">
              Trip Created Successfully!
            </h1>
            <p className="text-muted-foreground mb-6">{submitResult.message}</p>
            
            <div className="bg-muted rounded-lg p-4 mb-6">
              <div className="text-left">
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Trip ID:</strong> {submitResult.tripId}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  <strong>Destination:</strong> {submitResult.destination}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Tally URL:</strong>
                </p>
                <div className="flex items-center mt-1 space-x-2">
                  <code className="text-xs bg-background p-2 rounded flex-1 break-all border border-border">
                    {submitResult.tallyUrl}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(submitResult.tallyUrl!)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => router.push("/trips/new")}
                className="w-full"
              >
                Create Another Trip
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
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
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <MapPin className="h-8 w-8 text-primary mr-3" />
            Create New Trip
          </h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details to create a new trip booking
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-card rounded-lg shadow border border-border p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="tripId">Trip ID</Label>
                <Input
                  id="tripId"
                  className="mt-1 bg-muted"
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
                  <p className="mt-1 text-sm text-muted-foreground">
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

          <div className="bg-card rounded-lg shadow border border-border p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">
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

          <div className="bg-card rounded-lg shadow border border-border p-6">
            <h2 className="text-xl font-semibold text-card-foreground mb-6">
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