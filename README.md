# Expense Tracker

## Project Title & Brief Description

Expense Tracker is a full-stack web application that helps users manage their daily expenses efficiently. Users can create an account, log in securely, add expenses, filter expenses by category and date, view spending summaries, visualize expenses using charts, download expense reports, and  purchase premium membership.This project was developed as a Full Stack Development assessment using Node.js, Express, Sequelize, SQLite, and JavaScript.

---

## Live Demo Links

Frontend (Netlify):
https://expense-tracker-sgraphene.netlify.app/

Backend (Render):
https://s-graphene.onrender.com

---

## Tech Stack

### Frontend

* HTML5 – Structure and layout
* CSS3 – Styling and responsive design
* JavaScript (ES6) – Client-side functionality
* Chart.js – Expense visualization
* Cashfree SDK – Premium membership payments

### Backend

* Node.js – Runtime environment
* Express.js – REST API framework
* Sequelize – ORM for database operations
* SQLite – Lightweight database
* bcrypt – Password hashing
* Compression – Response compression
* CORS – Cross-origin resource sharing
* dotenv – Environment variable management

### Deployment

* Netlify – Frontend hosting
* Render – Backend hosting

---

## How to Run Locally

### Clone Repository

```bash
git clone https://github.com/lotusjoshigehu/S.Graphene.git
cd Expense-Tracker
```

### Install Dependencies

```bash
npm install
```


### Start Application

```bash
node app.js
```

Server starts at:

```text
http://localhost:3000
```

---

## API Documentation

### Authentication

#### Signup

```http
POST /signup
```

Request Body:

```json
{
  "name": "Kamal",
  "email": "joshikamal626@gmail.com",
  "password": "12345"
}
```

Response:

```json
{
  "message": "User created"
}
```

#### Login

```http
POST /login
```

Request Body:

```json
{
  "email": "joshikamal626@gmail.com",
  "password": "12345"
}
```

Response:

```json
{
  "success": true
}
```

#### User Premium Status

```http
GET /user/status/:email
```

Response:

```json
{
  "isPremium": true
}
```

---

### Expense APIs

#### Add Expense

```http
POST /expense
```

Request Body:

```json
{
  "email": "joshikamal626@gmail.com",
  "amount": 100,
  "category": "Food",
  "date": "2026-06-11",
  "note": "Lunch"
}
```

#### Get Expenses

```http
GET /expense/:email
```

#### Delete Expense

```http
DELETE /expense/:id
```

#### Update Expense

```http
PUT /expense/:id
```

---

### Premium APIs

#### Leaderboard

```http
GET /premium/showleaderboard
```

#### Download Expenses

```http
GET /expense/download/:email
```

---

### Payment APIs

#### Create Order

```http
POST /create-order
```

#### Payment Success

```http
GET /payment-success
```

---


## Project Structure

```text
S.Graphene/
│
├── controllers/
│   ├── authController.js
│   ├── expenseController.js
│   ├── paymentController.js
│   ├── premiumController.js
│
├── models/
│   ├── users.js
│   ├── expense.js
│   ├── orders.js
│
├── services/
│   └── cashfreeservice.j
│
├── connection/
│   └── dbconnection.js
│
├── signup.html
├── login.html
├── expense.html
├── signup.js
├── login.js
├── expense.js
├── signup.css
├── login.css
├── expense.css
│
├── app.js
├── package.json
└── README.md
```

---

##NOTE: For making User Interface of this project I take help from ChatGPT.

## Next Steps

* Add attractive UI.
* Adding AI assistant with spending analytics.
* Add monthly and yearly reports.
* Add recurring expense support.
* Add budget planning and alerts.
* Add user profile management.
* Add dark mode support.
* Migrate from SQLite to PostgreSQL for production scalability.
