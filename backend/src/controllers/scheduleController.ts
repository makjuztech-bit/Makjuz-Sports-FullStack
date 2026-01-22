import { Request, Response } from 'express';
import ScheduleItem from '../models/ScheduleItem';

export const getScheduleItems = async (req: Request, res: Response) => {
    try {
        const items = await ScheduleItem.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createScheduleItem = async (req: Request, res: Response) => {
    try {
        const item = new ScheduleItem(req.body);
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const updateScheduleItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await ScheduleItem.findById(id);

        if (item) {
            Object.assign(item, req.body);
            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Schedule Item not found' });
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const deleteScheduleItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await ScheduleItem.findById(id);

        if (item) {
            await item.deleteOne();
            res.json({ message: 'Schedule Item removed' });
        } else {
            res.status(404).json({ message: 'Schedule Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
