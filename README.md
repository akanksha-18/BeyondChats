# BeyondChats

## Description
This project implements Google authentication using Node.js, Express, and MongoDB. Users can log in using their Google account, and their authentication status is managed through sessions.
## Deployment
- Hosted Link: [Live App](https://beyond-chats-sooty.vercel.app/register)
- backend link: [Live App](https://beyondchats-cr91.onrender.com)
## Features
- Google OAuth authentication
- Express-based backend with MongoDB integration
- API routes for authentication
- Session management

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Passport.js (Google OAuth strategy)
- Render (for deployment)

## Installation
### Prerequisites
- Node.js installed
- MongoDB installed and running

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Set up environment variables in a `.env` file:
   ```sh
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   ```

4. Start the server:
   ```sh
   npm start
   ```

## API Routes
### Authentication
- `GET /api/auth/google` - Initiates Google OAuth login
- `GET /api/auth/google/callback` - Handles Google OAuth response


## Troubleshooting
- If `Invalid or expired verification code` occurs, ensure:
  - Google OAuth credentials are correct
  - Redirect URI in Google Cloud Console matches `/api/auth/google/callback`
  - Authentication code is not expired
  - Sessions are correctly configured

## License
This project is licensed under the MIT License.

