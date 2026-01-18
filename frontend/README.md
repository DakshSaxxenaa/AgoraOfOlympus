# Agora of Olympus

A full-stack MERN application that functions as a gamified marketplace and social messaging platform. Users can authenticate, list items, manage carts and wishlists, rate items, message sellers, and interact inside an in-app marketplace experience.

## Tech Stack

**Frontend**
- React + Vite
- TailwindCSS

**Backend**
- Node.js / Express
- MongoDB + Mongoose
- Cloudinary for image uploads
- JWT-based authentication
- Multer for media uploads

## Core Features

- **User Authentication**
  - Signup / Login / Protected Routes
  - JWT-based session handling

- **Item Listings**
  - Create / Read / Update / Delete listings
  - Image uploads via Cloudinary

- **Marketplace Actions**
  - Add to cart
  - Wishlist
  - Ratings & reviews

- **Messaging System**
  - Buyer - Seller conversations

- **Profile & Inventory**
  - View personal listed items
  - Track interested & purchased items

##  Project Structure

AgoraOfOlympus/
```
├─ backend/
│   ├─ src/
│   │   ├─ config/
│   │   ├─ models/
│   │   ├─ controllers/
│   │   ├─ routes/
│   │   ├─ middlewares/
│   │   ├─ utils/
│   │   └─ server.js
│   └─ uploads/
└─ frontend/
    ├─ src/
    │   ├─ components/
    │   ├─ pages/
    │   ├─ services/
    │   ├─ utils/
    │   ├─ App.jsx
    │   ├─ index.css
    │   └─ main.jsx
    └─ index.html
```

## Running the Project Locally

### 1. Clone the Repository
```
git clone https://github.com/DakshSaxxenaa/AgoraOfOlympus
cd AgoraOfOlympus
```

### 2. Backend Setup
```
cd backend
npm install
```

Create a `.env` file:
```
PORT=5000
MONGO_URI=<your mongo url>
JWT_SECRET=<your jwt secret>
JWT_EXPIRE=<duration>
CLOUDINARY_CLOUD_NAME=<cloud name>
CLOUDINARY_API_KEY=<api key>
CLOUDINARY_API_SECRET=<api secret>
```

Start backend:
```
npm start
```

### 3. Frontend Setup
```
cd ../frontend
npm install
npm run dev
```


## API Overview (Partial)

```
POST   /auth/register
POST   /auth/login

GET    /items
POST   /items
PUT    /items/:id
DELETE /items/:id

POST   /cart
POST   /wishlist

GET    /messages/:conversationId
POST   /messages
```

