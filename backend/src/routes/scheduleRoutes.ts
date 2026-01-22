import express from 'express';
import {
    getScheduleItems,
    createScheduleItem,
    updateScheduleItem,
    deleteScheduleItem
} from '../controllers/scheduleController';

const router = express.Router();

router.route('/').get(getScheduleItems).post(createScheduleItem);
router.route('/:id').put(updateScheduleItem).delete(deleteScheduleItem);

export default router;
