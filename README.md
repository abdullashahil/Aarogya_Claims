# Aarogya Claims

A full-stack claims management system that enables patients to submit insurance claims and insurers to review and process them. Built using **React.js**, **NestJS**, **MongoDB**, and **JWT-based authentication**.

## 🌐 Deployment Links

- **Frontend Deployment**: [🔗 Live App](https://aarogya-claims-management.vercel.app/)
- **Backend API**: [🔗 API Server](https://aarogya-claims-server.vercel.app/)
- **Video Demo**: [▶️ Walkthrough Video](your-video-demo-link)

## 📜 Table of Contents

- [🚀 Features](#-features)
  - [✅ Patient Side](#-patient-side)
  - [✅ Insurer Side](#-insurer-side)
  - [✅ Shared Features](#-shared-features)
- [🔒 Authentication](#-authentication)
- [🛠 Tech Stack](#-tech-stack)
- [📂 Folder Structure](#-folder-structure)
- [⚙️ Installation](#-installation)
  - [Server Setup (NestJS)](#server-setup-nestjs)
  - [Client Setup (React)](#client-setup-react)
- [🔗 API Endpoints](#-api-endpoints)
- [🧪 Testing](#-testing)

## 🚀 Features

### ✅ Patient Side

- **Submit Claims**: Enter details such as name, email, amount, and description.
- **Upload Supporting Documents**: e.g., receipts, prescriptions.
- **Track Claim Status**: View submitted claims and their current status.

### ✅ Insurer Side

- **Review & Manage Claims**: View all submitted claims.
- **Approve/Reject Claims**: Update claim status and add comments.
- **Filter Claims**: View claims by status, date, or amount.

### ✅ Shared Features

- **JWT Authentication**: Secure login for both patients and insurers.
- **MongoDB Database**: Store user and claim data.
- **REST API**: Endpoints for claims and authentication.
- **Responsive UI**: Built using Tailwind CSS and DaisyUI.

## 🔒 Authentication

### Mock User Sample Data

| Role     | Email               | Password   |
|----------|---------------------|------------|
| Patient  | patient@example.com | patient123 |
| Insurer  | insurer@example.com | insurer123 |

- Patients can submit claims and view status.
- Insurers can review, approve/reject claims.
- If user registration is not available, admin must create accounts manually.

## 🛠 Tech Stack

| Technology  | Purpose  |
|------------|----------|
| React.js   | Frontend UI |
| Tailwind CSS + DaisyUI | Styling |
| NestJS     | Backend API |
| MongoDB    | Database |
| JWT (JSON Web Tokens) | Authentication |
| Axios      | API requests |
| TypeScript | Type safety |

## 📂 Folder Structure

```
Aarogya-Claims/
│── client/              # Client (React (typescript))
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx       # Main App component
│   ├── package.json
│   ├── tailwind.config.js
│── server/              # Server (NestJS)
│   ├── src/
│   │   ├── auth/         # Auth modules
│   │   ├── claims/       # Claims modules
│   │   ├── users/        # User modules
│   │   ├── main.ts       # Entry point
│   ├── .env             # Environment variables
│   ├── package.json
```

## ⚙️ Installation

### Server Setup (NestJS)

1. Navigate to the backend folder:
    ```sh
    cd server
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file with the following:
    ```ini
    PORT=your_port_number
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_secret_key
    ```
4. Start the backend:
    ```sh
    npm run start:dev
    ```

### Client Setup (React)

1. Navigate to the frontend folder:
    ```sh
    cd client
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Start the frontend:
    ```sh
    npm run dev
    ```
4. Visit the app in your browser:
    ```
    Open http://localhost:5173
    ```

## 🔗 API Endpoints

| Method  | Endpoint       | Description |
|---------|---------------|-------------|
| POST    | `/auth/login` | Login and get JWT token |
| POST    | `/users/register` | Register a new user (Optional) |
| POST    | `/claims` | Submit a claim |
| GET     | `/claims` | Fetch all claims |
| PATCH   | `/claims/:id` | Approve/Reject a claim |

## 🧪 Testing

To run tests for the backend:

```sh
npm run test:e2e
```

