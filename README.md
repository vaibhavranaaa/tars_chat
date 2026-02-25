# 🚀 Tars Chat

A modern, scalable **real-time messaging application** built using **Next.js, Convex, and Clerk** with a clean, dark-themed UI.

Tars Chat enables secure and real-time 1:1 communication with advanced features such as typing indicators, presence tracking, unread messages, and emoji reactions. The application is designed with modern architecture and best practices suitable for production-level chat systems.

---

## 🌟 Features

* 🔐 **Secure Authentication**
  Sign up and sign in using Clerk with protected chat routes.

* 💬 **Real-time Messaging**
  Instant message delivery powered by Convex.

* 🟢 **Online Presence & Last Seen**
  Track user activity and availability.

* ⌨️ **Typing Indicators**
  Real-time typing status per conversation.

* 📬 **Unread Message Tracking**
  See unread message counts and read receipts.

* 😀 **Emoji Reactions**
  React to messages with emojis.

* 🧹 **Soft Delete Messages**
  Messages remain in history but are marked deleted.

* 👥 **User Search**
  Quickly find and start conversations.

* 🌙 **Modern UI**
  Clean, responsive, and dark-themed interface.

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* React
* TypeScript

### Backend & Database

* Convex (real-time backend and database)

### Authentication

* Clerk

### Styling

* Custom React UI components
* Utility-first design approach

---

## 📁 Project Structure

```
.
├── src/
│   ├── app/                   
│   │   ├── chat/               # Chat routes
│   │   ├── auth/               # Authentication pages
│   │   └── page.tsx            # Landing page
│   │
│   ├── components/
│   │   ├── chat/               # Message list, composer, typing UI
│   │   ├── providers/          # Convex and user sync providers
│   │   └── sidebar/            # Conversations and user search
│   │
│   └── proxy.ts                # Clerk middleware
│
├── convex/
│   ├── schema.ts               # Database schema
│   ├── users.ts                # User sync and presence
│   ├── conversations.ts        # Conversation lifecycle
│   ├── messages.ts             # Messaging and reactions
│   ├── typing.ts               # Typing indicators
│   ├── http.ts                 # Clerk webhook endpoint
│   └── auth.config.ts          # Auth configuration
│
└── public/                     # Static assets
```

---

## ⚙️ Prerequisites

Before running the project, ensure you have:

* Node.js 18+
* npm or yarn
* Clerk account
* Convex project

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory and add:

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev

# Clerk Webhook
CLERK_WEBHOOK_SECRET=whsec_...
```

---

## 🚀 Getting Started (Local Development)

### 1️⃣ Install dependencies

```
npm install
```

### 2️⃣ Start Convex

Run in a separate terminal:

```
npx convex dev
```

### 3️⃣ Start Next.js

```
npm run dev
```

### 4️⃣ Open the app

Visit:

```
http://localhost:3000
```

---

## 🔄 Clerk Webhook Setup (User Sync)

The application syncs Clerk users with Convex using a webhook.

### Steps:

1. Create a webhook in Clerk.
2. Set the endpoint to:

   ```
   https://your-convex-url/clerk-webhook
   ```
3. Copy the signing secret to:

   ```
   CLERK_WEBHOOK_SECRET
   ```

This ensures new users are automatically stored in the database.

---

## 📊 Core Data Model

The application uses a structured and scalable database design:

* **Users**
  Linked with Clerk authentication and presence data.

* **Conversations**
  Stores 1:1 chat relationships.

* **Messages**
  Includes message content, reactions, and soft-delete support.

* **Typing Indicators**
  Tracks real-time typing state.

* **Message Reads**
  Tracks read status per user.

---

## 📦 Available Scripts

```
npm run dev       # Start development server
npm run build     # Build production app
npm run start     # Run production build
npm run lint      # Run ESLint
```

---

## 🌍 Deployment

### Frontend

Deploy using Vercel for best compatibility.

### Backend

Deploy Convex functions using the Convex CLI.

### Important

* Set environment variables in both environments.
* Update webhook URL in Clerk.
* Configure domain and redirects if needed.

---

## 📌 Roadmap

Future improvements planned:

* 📎 File and image attachments
* 👥 Group chats
* 🔔 Push notifications
* ✏️ Message editing
* 📱 Mobile UI enhancements
* 🔍 Advanced search

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repository, create a feature branch, and submit a pull request.

---

## ⭐ Support

If you like this project, please consider giving it a star ⭐ on GitHub.

---

## 📬 Contact

Developed by **Vaibhav Rana**

Let’s connect and collaborate on exciting projects!
