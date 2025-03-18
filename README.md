# Auth Server React Frontend

This is a React frontend application for the Auth Server FastAPI backend. It provides a user-friendly interface for user registration, authentication, and API endpoint usage.

## Project Structure

```
auth-server-react-frontend/
├── public/                 # Public assets
├── src/                    # Source code
│   ├── assets/             # Static assets (images, fonts, etc.)
│   ├── components/         # Reusable UI components
│   ├── context/            # React context providers
│   ├── pages/              # Page components
│   ├── services/           # API service modules
│   └── utils/              # Utility functions
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd auth-server-react-frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:8000/api/v1
   ```
   Adjust the API URL as needed to match your backend server.

4. Start the development server:
   ```
   npm start
   ```

5. The application will be available at `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App configuration

## Dependencies

- React - JavaScript library for building user interfaces
- React Router - Routing library for React
- Axios - Promise-based HTTP client
- Material-UI - React UI framework
- JWT Decode - Library for decoding JWT tokens

## Connecting to the Backend

This frontend is designed to work with the Auth Server FastAPI backend. Make sure the backend server is running and accessible at the URL specified in your `.env` file.

## Features

- User registration
- User authentication (login/logout)
- Protected routes
- User profile management
- API endpoint access