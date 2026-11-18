# TeamFlow AI 🚀

**Smart Project Management SaaS**

TeamFlow AI is a modern project management application designed to help teams organize projects, manage tasks, track progress, and improve productivity through a clean and responsive interface.

## ✨ Features

- 🔐 User Authentication (Login & Register)
- 📊 Interactive Dashboard
- 📁 Project Management
- ✅ Task Management
- 🎯 Task Priority Management
- 📌 Task Status Tracking
- 📅 Project Due Dates
- 🔄 REST API Integration
- 📱 Responsive User Interface

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs

## 📂 Project Structure

```text
TeamFlowAI/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── package.json
│
├── .gitignore
└── README.md
```

*Update the structure if your actual folder names differ.*

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/TeamFlowAI.git
```

```bash
cd TeamFlowAI
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the server directory and configure your environment variables.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start backend:

```bash
npm run dev
```

### 3. Setup Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the local