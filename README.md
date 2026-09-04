# CraftCV

CraftCV is a full-stack web app for building a personal portfolio from ready-made templates — fill in your details, preview it live, save it, and share it with a public link. It also has an Explore page where you can browse sample professional portfolios for inspiration.

Built as a semester project for **Full Stack Development (CSUL504 / CAUL402 / CDUL402)** and **Full Stack Development Lab (CSUP522)**, SKIT, B.Tech CSE, Sem V.

## Features

- **Template gallery** — choose from multiple portfolio designs
- **Live builder** — fill a form and watch your portfolio update in real time
- **Save & share** — generates a public, shareable portfolio URL
- **Explore page** — browse sample and community-built portfolios
- **Image upload** — add a profile picture to your portfolio
- **Responsive design** — built with Tailwind CSS
~~
## Tech Stack

**Frontend:** React, React Router, Tailwind CSS, Axios
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**Other:** Multer (file uploads), jQuery (select interactive components)

## Folder Structure

```
craftcv/
├── client/               # React frontend
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Landing, Builder, Explore, PortfolioView
│       └── templates/    # Portfolio template designs
├── server/               # Express backend
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   └── controllers/      # Route logic
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local instance or MongoDB Atlas connection string)

### Installation

```bash
# Clone the repo
git clone https://github.com/<your-org-or-username>/craftcv.git
cd craftcv

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment variables
Create a `.env` file inside `server/`:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### Running locally

```bash
# Start the backend (from /server)
npm run dev

# Start the frontend (from /client)
npm start
```

The app will run at `http://localhost:3000` (client) and `http://localhost:5000` (API).

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/templates` | List all templates |
| GET | `/api/portfolios` | List all saved portfolios |
| GET | `/api/portfolios/:id` | Get a single portfolio |
| POST | `/api/portfolios` | Create a new portfolio |
| PUT | `/api/portfolios/:id` | Update a portfolio |
| DELETE | `/api/portfolios/:id` | Delete a portfolio |

## Team

| Name | Role |
|---|---|
| Bharat Dhakad | Backend — API, database, models |
| Aryan Sharma | Frontend — builder logic, live preview, routing |
| Bharat Kumar Sand | Templates & UI — portfolio designs, gallery, styling |

## Course Context

This project was developed to demonstrate the module outcomes of the Full Stack Development course: HTML/CSS/Tailwind, JavaScript & DOM manipulation, jQuery & AJAX, React (components, JSX, Router), Node.js & Express (REST APIs), and MongoDB (CRUD with Mongoose).

## License

This project is for academic purposes as part of the SKIT B.Tech CSE curriculum.
