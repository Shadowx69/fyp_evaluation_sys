const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // Required for serving static files
const connectDB = require('./config/db');

// --- 1. Import Routes ---
// It is best practice to import all routes at the top to avoid ReferenceErrors
const projectRoutes = require('./routes/projectRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const logRoutes = require('./routes/logRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const auditRoutes = require('./routes/auditRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes'); // <--- THIS WAS MISSING

// Load Config
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// --- 2. Auth Route Definition ---
// (Kept inline as per your previous structure)
const authRouter = require('express').Router();
const authController = require('./controllers/authController');
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);

// --- 3. Mount Routes ---
app.use('/api/auth', authRouter);
app.use('/api/projects', projectRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/dashboard', dashboardRoutes); // <--- Now properly defined

// --- 4. Serve Static Files ---
// Uses 'path' to be safe across Windows/Mac/Linux
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));