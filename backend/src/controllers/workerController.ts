import { Request, Response } from 'express';
import Worker from '../models/Worker';

export const getWorkers = async (req: Request, res: Response) => {
    try {
        const workers = await Worker.find();
        res.json(workers);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createWorker = async (req: Request, res: Response) => {
    try {
        const worker = new Worker(req.body);
        const createdWorker = await worker.save();
        res.status(201).json(createdWorker);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const updateWorker = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const worker = await Worker.findById(id);

        if (worker) {
            Object.assign(worker, req.body);
            const updatedWorker = await worker.save();
            res.json(updatedWorker);
        } else {
            res.status(404).json({ message: 'Worker not found' });
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const deleteWorker = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const worker = await Worker.findById(id);

        if (worker) {
            await worker.deleteOne();
            res.json({ message: 'Worker removed' });
        } else {
            res.status(404).json({ message: 'Worker not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
