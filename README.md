# Trip Management System

A modern, responsive Next.js web application for managing trip bookings with Google Sheets integration and dynamic link generation.

## 🚀 Features

### Authentication System
- Simple login with hardcoded credentials
- Session management using NextAuth.js
- Automatic redirection based on authentication status
- Secure logout functionality

### Trip Management
- **Auto-generated Trip IDs** with format: `TRIP-YYYYMMDD-XXXX`
- **Comprehensive Form** with 12 required fields
- **Real-time Validation** using Zod schemas
- **Currency Formatting** for budget fields
- **Responsive Design** for mobile and desktop

### Google Sheets Integration
- Direct submission to Google Sheets via Web App
- Real-time data synchronization
- Error handling and retry logic
- Structured data storage with timestamps

### Dynamic Link Generation
Based on travel type, generates appropriate Tally form links:
- **School, College**: `https://tally.so/r/3N9Xv0?tripid={tripId}`
- **Office**: `https://tally.so/r/wbEeM6?tripid={tripId}`
- **Bachelor, Family, Couple, Resort booking**: `https://tally.so/r/nrbOk5?tripid={tripId}`

### User Experience
- Modern, clean interface with Tailwind CSS
- Loading states and error handling
- Success screens with copy-to-clipboard functionality
- Form auto-save to prevent data loss
- Real-time budget formatting

## 🛠 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS v4
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form + Zod validation
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React
- **Database**: Google Sheets (via Apps Script)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Google account for Sheets integration

### Setup Instructions

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd trip-management
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file:
   ```env
   LOGIN_USERNAME=admin
   LOGIN_PASSWORD=admin123
   GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   NEXTAUTH_SECRET=your-super-secret-nextauth-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Google Sheets Setup**
   Follow the detailed instructions in [`GOOGLE_SHEETS_SETUP.md`](./GOOGLE_SHEETS_SETUP.md)

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) and login with:
   - Username: `admin`
   - Password: `admin123`

## 📋 Form Fields

### Basic Information
- **Trip ID**: Auto-generated (read-only)
- **Destination**: Text input
- **Number of Days**: Numeric (1-365)
- **Budget**: Currency input with INR formatting
- **Number of People**: Numeric (1-50)

### Trip Details
- **Travel Type**: Bachelor, School, College, Resort booking, Family, Couple, Strangers, Office, Honeymoon, Ticket Booking
- **Hotel Rating**: 1-5 star selection
- **Place Type**: Snowy Area, Hill Station, Cultural, Adventure, Beach, Devotional, City
- **Transport Mode**: Flight, Train, Bus
- **Destination Category**: South India, Central India, North India, North East India, GCC, Asia, Europe
- **Channel**: Whatsapp, Instagram, Facebook, Referral, Ads

### Additional Information
- **Itinerary**: Detailed multi-line text (minimum 10 characters)

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Update Environment Variables**
   ```env
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Digital Ocean App Platform
- Railway

## 🔧 API Routes

### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

### Trip Management
- `POST /api/trips/create` - Create new trip
  - Validates form data
  - Submits to Google Sheets
  - Returns dynamic Tally link

## 🎨 UI Components

### Reusable Components
- `Button` - Multiple variants and sizes
- `Input` - Text, number, and specialized inputs
- `Select` - Dropdown with search functionality
- `Textarea` - Multi-line text input
- `Label` - Form labels with proper accessibility

### Layout Components
- Responsive navigation
- Authentication guards
- Loading states
- Error boundaries

## 🔒 Security Features

- Environment variable protection
- Input sanitization with Zod
- CSRF protection via NextAuth
- Secure session management
- Rate limiting considerations

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login/logout functionality
- [ ] Form validation for all fields
- [ ] Google Sheets data submission
- [ ] Dynamic link generation
- [ ] Responsive design on mobile/desktop
- [ ] Error handling scenarios

### Automated Testing (Future Enhancement)
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

## 📊 Data Structure

### Google Sheets Columns
| Column | Field | Type | Description |
|--------|-------|------|-------------|
| A | Trip ID | String | Auto-generated unique ID |
| B | Destination | String | Trip destination |
| C | Number of Days | Number | Trip duration |
| D | Budget | Number | Trip budget in INR |
| E | Number of People | Number | Group size |
| F | Travel Type | String | Type of travel group |
| G | Hotel Details | String | Hotel star rating |
| H | Place Type | String | Destination category |
| I | Transport Mode | String | Mode of transportation |
| J | Destination Category | String | Geographic region |
| K | Channel | String | Marketing channel |
| L | Itinerary | String | Detailed trip plan |
| M | Timestamp | Date | Submission timestamp |

## 🚧 Future Enhancements

### Planned Features
- [ ] Trip history dashboard
- [ ] PDF export functionality
- [ ] Email notifications
- [ ] Trip editing capabilities
- [ ] Bulk CSV upload
- [ ] Analytics dashboard
- [ ] Multi-user support
- [ ] Trip approval workflow

### Technical Improvements
- [ ] Unit and integration tests
- [ ] Performance optimization
- [ ] PWA capabilities
- [ ] Offline support
- [ ] Advanced error tracking
- [ ] Audit logging

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Problems**
   - Check environment variables
   - Verify NEXTAUTH_SECRET is set
   - Ensure NEXTAUTH_URL matches deployment

2. **Google Sheets Integration**
   - Verify web app deployment settings
   - Check script permissions
   - Review execution logs

3. **Form Validation Errors**
   - Check Zod schema definitions
   - Verify field types and constraints
   - Review error messages

4. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check CSS variable definitions
   - Verify component imports

### Debug Mode
```bash
# Enable debug logging
NEXTAUTH_DEBUG=true npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests (when available)
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the Google Sheets setup documentation

---

**Built with ❤️ using Next.js, Tailwind CSS, and Google Sheets**.
