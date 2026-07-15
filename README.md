# 🛒 Voice Shopping Assistant

A full-stack voice-enabled shopping list application that allows users to manage shopping items using **voice commands** or **text input**. The application supports CRUD operations, smart product suggestions, and is deployed on AWS with HTTPS.

## 🚀 Live Demo

**Application:** https://voicecartnikhil.duckdns.org/

## ✨ Features

- 🎤 Voice and text-based shopping list management
- ➕ Add, update, and delete shopping items
- 🔍 Search shopping items
- 📂 Automatic category detection
- 💡 Smart product suggestions
- ☁️ Deployed on AWS EC2 with HTTPS

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Deployment**
- AWS EC2
- Nginx
- PM2
- DuckDNS
- Let's Encrypt SSL

## 📦 Local Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit:

```text
http://localhost:5173
```

## 🔧 Production Build

```bash
cd frontend
npm run build
```

## 📌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items |
| POST | `/api/items` | Add an item |
| PUT | `/api/items/:id` | Update an item |
| DELETE | `/api/items/:id` | Delete an item |

## 📖 Approach

The application uses React for the frontend and Express with MongoDB for the backend. Voice commands are captured using the browser's Speech Recognition API and converted into shopping actions. The backend exposes REST APIs for managing shopping items, while Nginx serves the frontend and PM2 manages the backend on an AWS EC2 instance. HTTPS is enabled using Let's Encrypt to securely support microphone access.

## 👨‍💻 Author

**Nikhil Navale**
````

This version is around 70–80 lines, clean, professional, and includes your live deployed application link.
