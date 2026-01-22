import express from 'express';
import {
    getWorkers,
    createWorker,
    updateWorker,
    deleteWorker
} from '../controllers/workerController';

const router = express.Router();

router.route('/').get(getWorkers).post(createWorker);
router.route('/:id').put(updateWorker).delete(deleteWorker);

export default router;
