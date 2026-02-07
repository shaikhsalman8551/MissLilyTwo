# 👗 MissLily - Modern E-Commerce Platform

A full-featured e-commerce platform for ladies wear built with Vite, React, Tailwind CSS, Firebase, and Formik.

## 🎯 Features

### User Features
- ✅ Product Listing with Advanced Filtering
- ✅ Category-wise Product Search
- ✅ Price Sorting (Low to High, High to Low)
- ✅ Discount-wise Filtering
- ✅ Product Details with Multiple Images
- ✅ Product Inquiry Form with Formik Validation
- ✅ WhatsApp Integration for Direct Messages
- ✅ Contact Us Page with Form Submission
- ✅ Instagram Reels Showcase
- ✅ Responsive Design

### Admin Features
- ✅ Admin Dashboard with Stats
- ✅ Product Management (CRUD Operations)
- ✅ Category Management (CRUD Operations)
- ✅ Active/Inactive Toggle for Products & Categories
- ✅ View Product Inquiries from Users
- ✅ View Contact Us Messages
- ✅ Reports & Analytics with Chart.js
- ✅ Admin Authentication (Predefined Credentials)

## 🚀 Quick Start

### 1. Firebase Setup (IMPORTANT!)

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a New Project"
3. Enter "MissLily" as project name
4. Complete the setup wizard

#### Step 2: Enable Required Services
In your Firebase Project:

**Firestore Database:**
- Go to Firestore Database
- Click "Create Database"
- Select "Start in test mode" (for development)
- Select your region and create

**Cloud Storage:**
- Go to Storage
- Click "Get Started"
- Follow the prompts

**Authentication:**
- Go to Authentication
- Click "Get Started"
- Enable "Email/Password" method

#### Step 3: Get Your Configuration
1. Click Project Settings (⚙️ icon)
2. Under "Your apps", click the Web icon (if not already created)
3. Copy the Firebase Config
4. Open `src/firebaseConfig.js` and replace:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

#### Step 4: Firebase Firestore Rules (for test mode)
Replace Firestore rules with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

#### Step 5: Firebase Storage Rules (for test mode)
Replace Storage rules with:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### 2. Project Installation

```bash
cd c:\wamp64\www\MissLily
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173/`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   └── InquiryModal.jsx
├── pages/              # User-facing pages
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ContactUs.jsx
│   └── Showcase.jsx
├── admin/              # Admin panel pages
│   ├── AdminLogin.jsx
│   ├── AdminDashboard.jsx
│   ├── ProductsManagement.jsx
│   ├── CategoriesManagement.jsx
│   ├── UserInquiriesPage.jsx
│   ├── ContactMessagesPage.jsx
│   └── ReportsPage.jsx
├── services/           # Firebase operations
│   └── firebaseService.js
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── styles/             # Global styles
├── App.jsx             # Main app with routing
├── main.jsx            # Entry point
├── index.css           # Tailwind directives
└── firebaseConfig.js   # Firebase configuration
```

## 🔐 Admin Credentials

**Default Admin Login:**
- Email: `admin@misslily.com`
- Password: `Admin@123`

⚠️ **IMPORTANT**: Change these credentials in production!

## 📝 Admin Login Path

```
http://localhost:5173/admin-login
```

## 🛍️ User Features

### Product Listing
- Filter by category
- Sort by price (low to high, high to low)
- Filter by discount percentage
- Search products by name

### Product Inquiry
- Click "Ask Details" on any product
- Fill Formik validated form with:
  - Full Name
  - Email
  - Phone Number
  - City
  - Preferred Size
  - Preferred Color
  - Additional Message
- Submit to Database or WhatsApp

### Contact Us
- Send inquiries with form validation
- Messages stored in Firebase
- Admin can reply via email or WhatsApp

### Showcase
- View Instagram reels
- Subscribe to newsletter

## ⚙️ Admin Features

### Dashboard
- Overview of all statistics
- Quick navigation to all admin sections
- Logout button

### Products Management
- Add new products with multiple images
- Edit existing products
- Delete products
- Toggle active/inactive status
- Upload images to Firebase Storage

### Categories Management
- Create new categories
- Edit category details
- Delete categories
- Manage category icons

### Product Inquiries
- View all user inquiries
- See inquiry details (preferred size, color, etc.)
- Reply via email or WhatsApp
- Track inquiry status

### Contact Messages
- View all contact form submissions
- See full message details
- Reply via email or WhatsApp
- Mark as read/unread

### Reports & Analytics
- View statistics with Chart.js
- Products by category (Pie Chart)
- Overall statistics (Bar Chart)
- Category breakdown table

## 🎨 Styling

- **Framework**: Tailwind CSS v4.1.18
- **Plugins**: @tailwindcss/forms, @tailwindcss/typography
- **Color Theme**: Pink/Rose gradient
- **Responsive**: Mobile-first design

## 📦 Dependencies

### Core
- React 18.1.0
- React DOM 18.1.0
- React Router DOM 6.21.0

### Forms & Validation
- Formik 2.4.5
- Yup 1.3.3

### Backend & Database
- Firebase 10.7.0
- Firestore (Database)
- Firebase Storage (Image Storage)
- Firebase Authentication

### Charts & Analytics
- Chart.js 4.4.1
- react-chartjs-2 5.2.0

### Styling
- Tailwind CSS 4.1.18
- @tailwindcss/forms 0.5.7
- @tailwindcss/typography 0.5.13

### Utilities
- Axios 1.6.2
- date-fns 2.30.0

## 🚀 Deployment to Firebase Hosting

### 1. Build for Production
```bash
npm run build
```

### 2. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 3. Login to Firebase
```bash
firebase login
```

### 4. Initialize Hosting
```bash
firebase init hosting
```

Choose your project and set:
- Public directory: `dist`
- Configure as single-page app: `Yes`

### 5. Deploy
```bash
firebase deploy
```

Your site will be live at: `https://YOUR-PROJECT-ID.web.app`

## 🔒 Security Considerations

1. **Firebase Rules**: Update test mode rules before production
2. **Admin Credentials**: Change default credentials
3. **Environment Variables**: Use `.env` file for sensitive data
4. **CORS**: Configure Firebase for your domain

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🐛 Troubleshooting

### Firebase Not Connecting
- Check firebaseConfig.js has correct credentials
- Ensure Firestore, Storage, and Auth are enabled
- Check Firebase Rules are set to test mode

### Images Not Uploading
- Check Firebase Storage rules are enabled
- Verify storage bucket name in config
- Check file size limits

### Admin Panel Not Accessible
- Ensure admin session is saved in localStorage
- Check browser console for errors
- Clear localStorage and login again

## 📧 Form Features

All forms use Formik with Yup validation:
- Real-time validation feedback
- Error messages
- Field-level validation
- Form-level validation
- Success/error states

## 🎯 Future Enhancements

- Payment Gateway Integration
- Shopping Cart
- User Accounts & Login
- Order Tracking
- Email Notifications
- SMS Notifications
- Advanced Analytics
- Inventory Management
- Multi-language Support

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Development Notes

- **Node Version**: 16 or higher
- **Package Manager**: npm
- **Browser Support**: Chrome, Firefox, Safari, Edge
- **Development Server**: Vite (Hot Module Replacement enabled)

## 📞 Support

For issues or questions:
1. Check Firebase Console for service status
2. Review browser console for errors
3. Verify all Firebase credentials
4. Check Firestore rules and security settings

---

**Made with ❤️ for MissLily - Premium Ladies Wear**
