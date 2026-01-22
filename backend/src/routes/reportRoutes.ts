import express from 'express';
import { upload } from '../config/cloudinary';
import {
    getDailyReports,
    createDailyReport,
    updateDailyReport,
    deleteDailyReport
} from '../controllers/reportController';

const router = express.Router();

router.route('/')
    .get(getDailyReports)
    .post(upload.array('photos', 5), createDailyReport); // Allow up to 5 photos

router.route('/:id')
    .put(upload.array('photos', 5), updateDailyReport)
    .delete(deleteDailyReport);

export default router;
