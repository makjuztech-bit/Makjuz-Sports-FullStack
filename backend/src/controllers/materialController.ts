import { Request, Response } from 'express';
import Material from '../models/Material';

export const getMaterials = async (req: Request, res: Response) => {
    try {
        const materials = await Material.find();
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createMaterial = async (req: Request, res: Response) => {
    try {
        const material = new Material(req.body);
        const createdMaterial = await material.save();
        res.status(201).json(createdMaterial);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const updateMaterial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const material = await Material.findById(id);

        if (material) {
            Object.assign(material, req.body);
            const updatedMaterial = await material.save();
            res.json(updatedMaterial);
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const deleteMaterial = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const material = await Material.findById(id);

        if (material) {
            await material.deleteOne();
            res.json({ message: 'Material removed' });
        } else {
            res.status(404).json({ message: 'Material not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
