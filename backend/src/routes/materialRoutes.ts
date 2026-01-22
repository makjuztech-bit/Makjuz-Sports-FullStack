import express from 'express';
import {
    getMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial
} from '../controllers/materialController';

const router = express.Router();

router.route('/').get(getMaterials).post(createMaterial);
router.route('/:id').put(updateMaterial).delete(deleteMaterial);

export default router;
