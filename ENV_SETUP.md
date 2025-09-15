# Environment Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variable:

```bash
# Backend API Configuration
# Set this to your backend API base URL (e.g., http://localhost:3001 or https://api.yourapp.com)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## How it works

- **Unauthorized users**: Data is stored locally in the browser using the stub storage provider
- **Authorized users**: Data is synced with the backend API using the configured base URL
- **Authentication**: Users can sign up/sign in to access backend features and analytics

## Backend Requirements

The backend should implement the following endpoints as documented in the API reference:

- `POST /users` - Create user
- `POST /users/login` - Login user  
- `GET /users/:id/challenges` - Get user challenges
- `POST /challenges` - Create challenge
- `GET /challenges/:id` - Get challenge
- `PATCH /challenges/:id` - Update challenge
- `DELETE /challenges/:id` - Delete challenge
- `PUT /challenge-entries/:id` - Update challenge entry

See the backend API documentation for complete endpoint details.
