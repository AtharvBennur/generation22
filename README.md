# 🌐 TechSphere — Blogs & AI Essay Generator

A modern, premium MERN + Firebase web application featuring a comprehensive blog system and AI-powered essay generation.

## ✨ Features

### 📝 Blog System
- **Create & Edit Blogs** - Rich Markdown editor with live preview
- **Read & Discover** - Browse, search, and filter blogs by tags
- **Rate & Review** - 5-star rating system for blogs
- **Comments** - Engage with authors and readers
- **Bookmarks** - Save your favorite blogs
- **Author Profiles** - View all blogs by an author
- **Trending Algorithm** - Discover popular content

### 🤖 AI Essay Generator
- **Groq-Powered AI** - Ultra-fast essay generation using Llama 3.1 70B
- **Multiple Styles** - Academic, Creative, Simple, Formal
- **Flexible Length** - Short (~250), Medium (~500), Long (~1000 words)
- **Chat Interface** - Intuitive chat-style UI with typing animations
- **Save as Blog** - Convert AI essays to blog posts instantly

### 🎨 Premium UI/UX
- **Glassmorphism** - Modern blurred glass effects
- **Framer Motion** - Smooth animations and transitions
- **Dark/Light Mode** - Beautiful themes for any preference
- **3D Hover Effects** - Interactive card animations
- **Responsive Design** - Perfect on all devices
- **Skeleton Loaders** - Elegant loading states

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Zustand** for state management
- **Firebase** for authentication
- **React Markdown** for content rendering
- **Axios** for API calls

### Backend
- **Node.js** + **Express**
- **Firebase Admin SDK** for Firestore & Auth
- **Groq AI API** for essay generation
- **Helmet** for security
- **Rate Limiting** for API protection

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- Firebase project created
- Groq API key (already provided)

### 1. Clone & Navigate
```bash
cd "C:/Users/dell/Desktop/rls hackathon more/techsphere"
```

### 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Authentication** (Google & Email/Password)
4. Enable **Firestore Database**
5. Enable **Storage**

#### Get Firebase Config (Frontend)
1. Go to Project Settings > General
2. Scroll to "Your apps" > Web app
3. Copy the config object
4. Update `frontend/src/firebaseClient.js` with your config

#### Get Firebase Admin SDK (Backend)
1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Update `backend/.env` with:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`

### 3. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd ../backend
npm install
```

### 4. Configure Environment Variables

#### Frontend `.env`
Already created at `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend `.env`
Update `backend/.env` with your Firebase credentials:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com

GROQ_API_KEY=your_groq_api_key_here
```

### 5. Run the Application

#### Terminal 1 - Backend
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

## 🚀 Usage

1. **Sign In** - Click "Sign In" and authenticate with Google
2. **Explore Blogs** - Browse trending and all blogs
3. **Create Blog** - Write your own blog with Markdown
4. **Generate Essay** - Use AI to create essays on any topic
5. **Rate & Comment** - Engage with the community
6. **Save Favorites** - Bookmark blogs to read later

## 📁 Project Structure

```
techsphere/
├── frontend/
│   ├── public/
│   │   └── logo.svg
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand state management
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── src/
    │   ├── controllers/    # Request handlers
    │   ├── routes/         # API routes
    │   ├── services/       # Business logic
    │   ├── middleware/     # Express middleware
    │   └── utils/          # Utility functions
    ├── server.js           # Express server
    ├── package.json
    └── .env                # Environment variables
```

## 🔑 API Endpoints

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `GET /api/blogs/search` - Search blogs
- `GET /api/blogs/trending` - Get trending blogs
- `POST /api/blogs/:id/rate` - Rate blog
- `POST /api/blogs/:id/comments` - Add comment
- `GET /api/blogs/:id/comments` - Get comments

### AI
- `POST /api/ai/generate` - Generate essay
- `POST /api/ai/refine` - Refine essay

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/:userId/blogs` - Get user's blogs
- `PUT /api/users/:userId` - Update profile

## 🎨 Customization

### Update Main Website URL
Replace the placeholder URL in these files:
- `frontend/src/components/Navbar.jsx` (line 88, 145)
- `frontend/src/components/Footer.jsx` (line 26)
- `frontend/src/pages/Home.jsx` (line 60)

Search for `https://your-main-website.com` and replace with your actual URL.

### Change Theme Colors
Edit `frontend/tailwind.config.js` to customize the color palette.

### Modify AI Behavior
Edit `backend/src/services/aiService.js` to adjust prompts and parameters.

## 🔒 Security Features

- Firebase Authentication
- Input sanitization
- Rate limiting
- Helmet security headers
- CORS protection
- XSS prevention

## 📱 Responsive Design

Fully responsive and optimized for:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1920px+)

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify Firebase config in `firebaseClient.js`
- Check Firebase console for enabled services
- Ensure Firestore rules allow read/write

### AI Generation Fails
- Verify Groq API key in backend `.env`
- Check API rate limits
- Review backend console for errors

### CORS Errors
- Ensure backend is running on port 5000
- Check FRONTEND_URL in backend `.env`
- Verify VITE_API_URL in frontend `.env`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ for the tech community

---

**Enjoy using TechSphere! 🚀**
