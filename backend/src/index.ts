import cors from 'cors';
import 'dotenv/config';
import session from 'express-session';
import express, { Request, Response } from 'express';
import passport from 'passport';
import './config/passport.config'; //it calls all fn of passport including passport.use()//
import routes from './modules/index';//main routes file
import { handleStripeWebhook } from './modules/payment/webhook.controller';

const PORT = process.env.PORT || 5000;
const app = express();

//stripe webhook route
// This route must come BEFORE your global express.json() middleware.
// It uses a raw body parser because Stripe requires it for signature verification.
app.post(
    '/stripe/webhook', 
    express.raw({ type: 'application/json' }), 
    handleStripeWebhook
);



app.use(cors({
  origin: 'http://localhost:5173', // Allow your frontend origin
  credentials: true, // Allow cookies to be sent
}));

// Set up session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(express.json());
// Initialize passport before any req routes
app.use(passport.initialize());
app.use(passport.session());

app.use('',routes);//call all routes of modules

async function startServer() {

  // seedProducts(); //
  try {
    app.listen (PORT, ()=>{
      console.log(`Server running at http:///localhost:${process.env.PORT}`);
    } );
  } catch (error) {
    console.error(' Failed to start server: ', error);
    process.exit(1);
  }
}

startServer();