# SatsQuiz - Bitcoin Lightning Network Quiz Game

A real-time multiplayer quiz game that uses Bitcoin Lightning Network for payments and rewards. Players can create or join game rooms, answer questions, and earn satoshis for correct answers.

## Features

- Real-time multiplayer quiz gameplay
- Bitcoin Lightning Network integration for payments
- Room-based game system
- Score tracking and leaderboards
- QR code generation for payments
- Withdrawal functionality for winners

## Tech Stack

### Frontend (Client)
- React 18
- TypeScript
- Vite
- Socket.IO Client
- QRCode library

### Backend (Server)
- Node.js
- Express
- Socket.IO
- CORS
- Dotenv for environment variables

## Project Structure

```
satsquiz/
├── client/                 # Frontend React application
│   ├── src/               # Source files
│   ├── package.json       # Frontend dependencies
│   └── vite.config.ts     # Vite configuration
│
└── server/                # Backend Node.js server
    ├── server.js          # Main server file
    ├── game.js            # Game logic
    ├── payments.js        # Lightning Network payment handling
    ├── utils.js           # Utility functions
    └── package.json       # Backend dependencies
```

## Setup and Installation

1. Clone the repository
2. Install dependencies for both client and server:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
CORS_PERMISSION=<your-frontend-url>
SATS_PER_QUESTION=<number-of-sats-per-question>
```

## Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd client
npm run dev
```

## Game Flow

1. A host creates a game room
2. Players join the room using the room code
3. The host starts the game
4. Questions are presented one at a time
5. Players answer questions within the time limit
6. Correct answers earn satoshis
7. At the end of the game, players can withdraw their winnings via Lightning Network

## Contributing

Feel free to submit issues and enhancement requests!

## License

ISC 