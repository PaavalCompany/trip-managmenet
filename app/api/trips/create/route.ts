import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { tripSchema } from "@/lib/validations"
import { generateTripId } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    // Generate trip ID if not provided
    if (!body.tripId) {
      body.tripId = generateTripId()
    }

    // Validate the form data
    const validatedData = tripSchema.parse(body)

    // Submit to Google Sheets
    const sheetsResponse = await fetch(process.env.GOOGLE_SHEETS_WEB_APP_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedData),
    })

    if (!sheetsResponse.ok) {
      throw new Error("Failed to submit to Google Sheets")
    }

    // Generate dynamic link based on travel type
    const getTallyLink = (travelType: string, tripId: string) => {
      const encodedTripType = encodeURIComponent(travelType)
      switch (travelType) {
        case "School":
        case "College":
          return `https://tally.so/r/3N9Xv0?tripid=${tripId}&triptype=${encodedTripType}`
        case "Office":
          return `https://tally.so/r/wbEeM6?tripid=${tripId}&triptype=${encodedTripType}`
        case "Bachelor":
        case "Family":
        case "Couple":
        case "Resort booking":
          return `https://tally.so/r/nrbOk5?tripid=${tripId}&triptype=${encodedTripType}`
        default:
          return `https://tally.so/r/nrbOk5?tripid=${tripId}&triptype=${encodedTripType}`
      }
    }

    const tallyLink = getTallyLink(validatedData.travelType, validatedData.tripId)

    return NextResponse.json({
      success: true,
      tripId: validatedData.tripId,
      tallyUrl: tallyLink,
      message: "Trip created successfully!"
    })

  } catch (error) {
    console.error("Error creating trip:", error)
    
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: 500 }
    )
  }
} 