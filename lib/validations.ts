import { z } from "zod"

export const tripSchema = z.object({
  tripId: z.string().min(1, "Trip ID is required"),
  date: z.string().min(1, "Trip date is required").regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  destination: z.string().min(1, "Destination is required"),
  numberOfDays: z.number().min(1, "Must be at least 1 day").max(365, "Cannot exceed 365 days"),
  budget: z.number().min(0, "Budget cannot be negative"),
  numberOfPeople: z.number().min(1, "Must be at least 1 person").max(50, "Cannot exceed 50 people"),
  travelType: z.enum([
    "Bachelor",
    "School", 
    "College",
    "Resort booking",
    "Family",
    "Couple",
    "Strangers",
    "Office",
    "Honeymoon",
    "Ticket Booking"
  ]),
  hotelDetails: z.enum([
    "1 star",
    "2 star", 
    "3 star",
    "4 star",
    "5 star"
  ]),
  placeType: z.enum([
    "Snowy Area",
    "Hill Station",
    "Cultural",
    "Adventure", 
    "Beach",
    "Devotional",
    "City"
  ]),
  transportMode: z.enum([
    "Flight",
    "Train",
    "Bus"
  ]),
  destinationCategory: z.enum([
    "South India",
    "Central India",
    "North India",
    "North East India",
    "GCC",
    "Asia",
    "Europe"
  ]),
  channel: z.enum([
    "Whatsapp",
    "Instagram", 
    "Facebook",
    "Referral",
    "Ads"
  ]),
  itinerary: z.string().min(10, "Please provide a detailed itinerary")
})

export type TripFormData = z.infer<typeof tripSchema>

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
})

export type LoginFormData = z.infer<typeof loginSchema> 