import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import path from 'path';
import fs from 'fs';

import projectRoutes from './routes/projectRoutes';
import materialRoutes from './routes/materialRoutes';
import supplierRoutes from './routes/supplierRoutes';
import workerRoutes from './routes/workerRoutes';
import scheduleRoutes from './routes/scheduleRoutes';
import reportRoutes from './routes/reportRoutes';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/projects', projectRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/daily-reports', reportRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
