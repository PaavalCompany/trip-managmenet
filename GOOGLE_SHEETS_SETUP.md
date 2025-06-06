# Google Sheets Integration Setup

This document provides step-by-step instructions for setting up Google Sheets integration with Google Apps Script for the Trip Management application.

## Prerequisites

1. A Google account
2. Access to Google Sheets
3. Access to Google Apps Script

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Trip Management Data"
4. Set up the following column headers in the first row:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Trip ID | Destination | Number of Days | Budget | Number of People | Travel Type | Hotel Details | Place Type | Transport Mode | Destination Category | Channel | Itinerary | Timestamp |

## Step 2: Create Google Apps Script

1. In your Google Sheet, go to **Extensions** > **Apps Script**
2. Delete the default code and replace it with the following:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSheet();
    
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.tripId || !data.destination) {
      return ContentService
        .createTextOutput(JSON.stringify({ error: "Missing required fields" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Prepare the row data
    const rowData = [
      data.tripId,
      data.destination,
      data.numberOfDays,
      data.budget,
      data.numberOfPeople,
      data.travelType,
      data.hotelDetails,
      data.placeType,
      data.transportMode,
      data.destinationCategory,
      data.channel,
      data.itinerary,
      new Date().toISOString()
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        message: "Data added successfully",
        tripId: data.tripId
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        error: "Failed to process request: " + error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      message: "Trip Management API is running",
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function (optional)
function testFunction() {
  const testData = {
    tripId: "TRIP-20231201-0001",
    destination: "Goa",
    numberOfDays: 5,
    budget: 50000,
    numberOfPeople: 4,
    travelType: "Family",
    hotelDetails: "3 star",
    placeType: "Beach",
    transportMode: "Flight",
    destinationCategory: "South India",
    channel: "Whatsapp",
    itinerary: "Day 1: Arrival, Day 2: Beach activities, Day 3: Sightseeing, Day 4: Water sports, Day 5: Departure"
  };
  
  const sheet = SpreadsheetApp.getActiveSheet();
  const rowData = [
    testData.tripId,
    testData.destination,
    testData.numberOfDays,
    testData.budget,
    testData.numberOfPeople,
    testData.travelType,
    testData.hotelDetails,
    testData.placeType,
    testData.transportMode,
    testData.destinationCategory,
    testData.channel,
    testData.itinerary,
    new Date().toISOString()
  ];
  
  sheet.appendRow(rowData);
  console.log("Test data added successfully");
}
```

## Step 3: Deploy the Apps Script as Web App

1. Click on **Deploy** > **New deployment**
2. Choose **Type**: Web app
3. Fill in the deployment details:
   - **Description**: Trip Management API
   - **Execute as**: Me
   - **Who has access**: Anyone (This is required for POST requests from your Next.js app)
4. Click **Deploy**
5. **Important**: Copy the Web app URL that appears. It should look like:
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

## Step 4: Update Environment Variables

In your Next.js application, update the `.env.local` file:

```env
GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

Replace `YOUR_SCRIPT_ID` with the actual script ID from step 3.

## Step 5: Test the Integration

1. Run your Next.js application
2. Login with the credentials (admin/admin123)
3. Create a test trip
4. Check your Google Sheet to confirm the data appears

## Troubleshooting

### Common Issues:

1. **403 Forbidden Error**: Make sure the Apps Script is deployed with "Anyone" access
2. **CORS Issues**: Google Apps Script handles CORS automatically for web apps
3. **Data Not Appearing**: Check the Apps Script execution logs in the Google Apps Script editor
4. **Invalid JSON**: Ensure the request body is valid JSON

### Checking Logs:

1. Go to your Apps Script project
2. Click on **Executions** in the left sidebar
3. Check recent executions for any errors

### Testing the Web App:

You can test the web app directly by visiting the URL in a browser. It should return a JSON response indicating the API is running.

## Security Considerations

1. The web app is publicly accessible but only accepts POST requests with valid JSON data
2. Consider implementing additional validation or authentication if needed
3. Monitor the execution logs for any suspicious activity
4. You can limit access by changing the deployment settings, but this might require OAuth flow

## Data Format

The expected JSON format for POST requests:

```json
{
  "tripId": "TRIP-20231201-0001",
  "destination": "Goa",
  "numberOfDays": 5,
  "budget": 50000,
  "numberOfPeople": 4,
  "travelType": "Family",
  "hotelDetails": "3 star",
  "placeType": "Beach",
  "transportMode": "Flight",
  "destinationCategory": "South India",
  "channel": "Whatsapp",
  "itinerary": "Detailed itinerary here..."
}
```

## Next Steps

Once the integration is working:

1. You can enhance the Google Sheet with additional formatting
2. Create charts and reports based on the collected data
3. Set up email notifications for new submissions
4. Export data for further analysis 