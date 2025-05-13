# Real-Time Chat Backend API

A Node.js-based backend for a real-time chat application, built using Express, MongoDB, and Socket.io. This API enables user registration/login, secure messaging, and real-time communication with persistent storage.

---

## 🚀 Features

* 🔐 **User Authentication** with JWT and hashed passwords using bcrypt
* 📩 **Real-Time Messaging** using Socket.io
* 🧾 **Persistent Chat History** with MongoDB
* 📡 **REST APIs** for users and messages
* 🌐 **CORS-enabled** for frontend integration
* 🧪 Structured error handling and scalable design

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express
* **Database**: MongoDB (via Mongoose)
* **Authentication**: JWT, bcrypt
* **WebSocket**: Socket.io
* **Environment Variables**: dotenv
* **Frontend Compatibility**: CORS enabled for `http://localhost:3000`

---

## 📁 Folder Structure

```
├── models/
│   ├── User.js
│   └── Messages.js
├── routes/
│   └── auth.js
├── .env
├── server.js
├── package.json
```

---

## 🔧 Environment Variables

Create a `.env` file in the root:

```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 📦 Installation & Run

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/chat-backend.git
   cd chat-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the server**

   ```bash
   npm start
   ```

---

## 🧪 API Endpoints

### Auth

* `POST /auth/register` – Register user
* `POST /auth/login` – Login user

### Users

* `GET /users?currentUser=username` – Fetch all users except current

### Messages

* `GET /messages?sender=A&receiver=B` – Fetch conversation between two users
* `Socket: send_message` – Send real-time message
* `Socket: receive_message` – Receive messages

---

## 📬 Socket.io Events

* `connection` – Connect new user
* `send_message` – Emit message to receiver
* `receive_message` – Broadcast new message
* `disconnect` – Handle disconnection

---

## 🧑‍💻 Author

* [Mayank Jaiswal](https://github.com/mayank17j)
