## Paymob Integration

Set the following environment variables to enable Paymob payments:

```
PAYMOB_API_KEY=your_secret_api_key
PAYMOB_INTEGRATION_ID=123456
PAYMOB_IFRAME_ID=123456
PAYMOB_HMAC=your_paymob_hmac
PAYMOB_BASE_URL=https://accept.paymob.com
PAYMOB_CURRENCY=EGP
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

Notes:
- The checkout is initiated via the server action `createStripeCheckout` (now using Paymob under the hood).
- The webhook endpoint at `app/api/stripe-checkout/webhook/route.ts` now handles Paymob transaction notifications and creates enrollments on success.
- Ensure your Paymob dashboard is configured to send transaction notifications to `/api/stripe-checkout/webhook`.

# Al Marsam - Modern LMS Platform

A modern, feature-rich Learning Management System built with Next.js 15, Sanity CMS, Clerk, and Paymob. Features real-time content updates, course progress tracking, and secure payment processing.

## Features

### For Students

- 📚 Access to comprehensive course content
- 📊 Real-time progress tracking
- ✅ Lesson completion system
- 🎯 Module-based learning paths
- 🎥 Multiple video player integrations (YouTube, Vimeo, Loom)
- 💳 Secure course purchases via Paymob
- 📱 Mobile-friendly learning experience
- 🔄 Course progress synchronization

### For Course Creators

- 📝 Rich content management with Sanity CMS
- 📊 Student progress monitoring
- 📈 Course analytics
- 🎨 Customizable course structure
- 📹 Multiple video hosting options
- 💰 Direct payments via Paymob
- 🔄 Real-time content updates
- 📱 Mobile-optimized content delivery

### Technical Features

- 🚀 Server Components & Server Actions
- 👤 Authentication with Clerk
- 💳 Payment processing with Paymob
- 📝 Content management with Sanity CMS
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 📱 Responsive design
- 🔄 Real-time content updates
- 🔒 Protected routes and content
- 🌙 Dark mode support

### UI/UX Features

- 🎯 Modern, clean interface
- 🎨 Consistent design system using shadcn/ui
- ♿ Accessible components
- 🎭 Smooth transitions and animations
- 📱 Responsive across all devices
- 🔄 Loading states with skeleton loaders
- 💫 Micro-interactions for better engagement
- 🌙 Dark/Light mode toggle

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn
- Paymob Account
- Clerk Account
- Sanity Account

### Environment Variables

Create a `.env.local` file with:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
# Read Token
SANITY_API_TOKEN=your-sanity-read-token
# Full Access Admin Token
SANITY_API_ADMIN_TOKEN=your-sanity-admin-token

# For Sanity Studio to read
SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Paymob
PAYMOB_API_KEY=your_secret_api_key
PAYMOB_INTEGRATION_ID=123456
PAYMOB_IFRAME_ID=123456
PAYMOB_HMAC=your_paymob_hmac
PAYMOB_BASE_URL=https://accept.paymob.com
PAYMOB_CURRENCY=EGP
PAYMOB_CARD_INTEGRATION_ID=123456
PAYMOB_WALLET_INTEGRATION_ID=123456

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/al-marsam

# Install dependencies
npm install

# Start the development server
npm run dev

# In a separate terminal, start Sanity Studio
npm run sanity:dev
```

### Setting up Sanity CMS

1. Create a Sanity account
2. Create a new project
3. Install the Sanity CLI:
   ```bash
   npm install -g @sanity/cli
   ```
4. Initialize Sanity in your project:
   ```bash
   sanity init
   ```
5. Deploy Sanity Studio:
   ```bash
   sanity deploy
   ```

### Setting up Clerk

1. Create a Clerk application
2. Configure authentication providers
3. Set up redirect URLs
4. Add environment variables

### Setting up Paymob

1. Create a Paymob account
2. Set up integration IDs for card and wallet payments
3. Configure webhook endpoints
4. Set up HMAC verification

## Architecture

### Content Schema

- Courses

  - Title
  - Description
  - Price
  - Image
  - Modules
  - Instructor
  - Category

- Modules

  - Title
  - Lessons
  - Order

- Lessons

  - Title
  - Description
  - Video URL
  - Content (Rich Text)
  - Completion Status

- Students

  - Profile Information
  - Enrolled Courses
  - Progress Data

- Instructors
  - Name
  - Bio
  - Photo
  - Courses

### Key Components

- Course Management System

  - Content creation and organization
  - Module and lesson structuring
  - Rich text editing
  - Media integration

- Progress Tracking

  - Lesson completion
  - Course progress calculation
  - Module progress visualization

- Payment Processing

  - Secure checkout via Paymob
  - Course enrollment
  - Payment integration

- User Authentication
  - Clerk authentication
  - Protected routes
  - User roles

## Usage

### Creating a Course

1. Access Sanity Studio
2. Create course structure with modules and lessons
3. Add content and media
4. Publish course

### Student Experience

1. Browse available courses
2. Purchase and enroll in courses via Paymob
3. Access course content
4. Track progress through modules
5. Mark lessons as complete
6. View completion certificates

## Development

### Key Files and Directories

```
/app                    # Next.js app directory
  /(dashboard)          # Dashboard routes
  /(user)              # User routes
  /api                 # API routes
/components            # React components
/sanity                # Sanity configuration
  /lib                 # Sanity utility functions
  /schemas             # Content schemas
/lib                   # Utility functions
```

### Core Technologies

- Next.js 15
- TypeScript
- Sanity CMS
- Paymob Payments
- Clerk Auth
- Tailwind CSS
- Shadcn UI
- Lucide Icons

## Features in Detail

### Course Management

- Flexible course structure with modules and lessons
- Rich text editor for lesson content
- Support for multiple video providers
- Course pricing and enrollment management

### Student Dashboard

- Progress tracking across all enrolled courses
- Lesson completion status
- Continue where you left off
- Course navigation with sidebar

### Video Integration

- URL Video Player
- Loom Embed Support
- Responsive video playback
- YouTube integration with custom branding

### Payment System

- Secure Paymob checkout
- Course access management
- Webhook integration
- Payment status tracking

### Authentication

- User registration and login
- Protected course content
- Role-based access control
- Secure session management

### UI Components

- Modern, responsive design
- Loading states and animations
- Progress indicators
- Toast notifications
- Modal dialogs

## Support

For support, join our Discord community or email support@example.com

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

---

Built with ❤️ using Next.js, Sanity, Clerk, and Paymob
# almarsam
