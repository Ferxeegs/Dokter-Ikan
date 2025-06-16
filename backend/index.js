import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import db from "./config/Database.js"; 
import UserRoute from "./routes/UserRoute.js";
import FishTypes from "./routes/FishTypeRoute.js";
import FishExperts from "./routes/FishExpertRoute.js";
import UserConsultation from "./routes/UserConsultationRoute.js";
import FishExpertAnswer from "./routes/FishExpertAnswerRoute.js";
import Medicine from "./routes/MedicineRoute.js";
import Consultation from "./routes/ConsultationRoute.js";
import PrescriptionRoutes from './routes/PrescriptionRoute.js';
import Payment from "./routes/PaymentRoute.js";
import PrescriptionMedicine from "./routes/PrescriptionMedicineRoute.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import UploadRoute from "./routes/UploadRoute.js";
import MessageRoutes from "./routes/MessageRoutes.js";
import SymptomRoute from "./routes/SymptomRoute.js";
import FishDiseaseRoute from "./routes/FishDiseaseRoute.js";
import { responseFormatter } from "./middlewares/ResponseFormatter.js";
import ArticleRoutes from "./routes/ArticleRoutes.js";


dotenv.config();
const app = express();

// PENTING: cookieParser harus diletakkan SEBELUM cors dan middleware lainnya
app.use(cookieParser());

// Perbaikan CORS configuration
app.use(cors({
  credentials: true,
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Tambahkan fallback
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Tambahkan Cookie header
  exposedHeaders: ['Set-Cookie'] // Expose Set-Cookie header
}));

// Handle preflight requests
app.options('*', cors());

app.use(session({
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: false, // Ubah ke false untuk keamanan
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined
  }
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(responseFormatter);

// Routes...
app.use(UserRoute);
app.use(FishTypes);
app.use(FishDiseaseRoute);
app.use(FishExperts);
app.use(UserConsultation);
app.use(FishExpertAnswer);
app.use(Medicine);
app.use(Consultation);
app.use(PrescriptionRoutes);
app.use(Payment);
app.use(PrescriptionMedicine);
app.use(AuthRoutes);
app.use(UploadRoute);
app.use(MessageRoutes);
app.use(SymptomRoute);
app.use(ArticleRoutes);

app.listen(process.env.APP_PORT, () => {
    console.log(`Server up and running on port ${process.env.APP_PORT}...`);
});