import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConfig.js';
import ejs from 'ejs';
import notFoundErrorHandler from './utils/notfoundErrorHandler.js';
import globalErrorHandler from './utils/globalErrorhandler.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import expressLayouts from 'express-ejs-layouts';
import materialRoutes from './routes/materialRoute.js';
import carRoutes from './routes/carRoutes.js';
import carLogRoutes from './routes/logRoutes.js';
import moiRoutes from './routes/moi.route.js';
import medicalHistoryRoutes from './routes/medicalHistoryRoutes.js'
import surgicalHistoryRoute from './routes/surgicalHistoryRoutes.js';
import triageRoutes from './routes/triageRoutes.js';
import BorrowItemRoutes from './routes/BorrowedItemsRoute.js';
import axios from 'axios';
import attendenceRoutes from './routes/attendenceRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 




const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
connectDB();



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/layout.ejs');
app.use(cookieParser());
// Static files
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use('/materials', materialRoutes);
app.use('/', authRoutes);
app.use('/cars', carRoutes);
app.use('/logs', carLogRoutes);
app.use('/moi', moiRoutes);
app.use('/medical-histories', medicalHistoryRoutes);
app.use('/surgical-histories', surgicalHistoryRoute);
app.use('/triage', triageRoutes);
app.use('/borrowed-items', BorrowItemRoutes);
app.use('/attendence', attendenceRoutes);
app.use('/api/hello', (req, res) => {
    console.log('Hello World');
    res.send('Hello World');
});



axios.get('https://httpbin.org/ip')
  .then(response => {
    console.log('Heroku server IP:', response.data.origin);
  })
  .catch(error => {
    console.error('Error fetching IP:', error);
});


// Error handling
app.use(notFoundErrorHandler);
app.use(globalErrorHandler);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`);
});

