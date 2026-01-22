import { Request, Response } from 'express';
import DailyReport from '../models/DailyReport';

export const getDailyReports = async (req: Request, res: Response) => {
    try {
        const reports = await DailyReport.find();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const createDailyReport = async (req: Request, res: Response) => {
    try {
        let photos: string[] = [];
        if (req.files && Array.isArray(req.files)) {
            photos = (req.files as any[]).map(file => file.path);
        }

        const reportData = { ...req.body };

        // Add uploaded photo URLs to photos array
        if (photos.length > 0) {
            const existingPhotos = reportData.photos ? (Array.isArray(reportData.photos) ? reportData.photos : [reportData.photos]) : [];
            reportData.photos = [...existingPhotos, ...photos];
        }

        // Handle JSON parsing for arrays sent as strings (FormData)
        if (typeof reportData.materialsUsed === 'string') {
            try {
                reportData.materialsUsed = JSON.parse(reportData.materialsUsed);
            } catch (e) {
                console.error('Error parsing materialsUsed', e);
            }
        }
        if (typeof reportData.workersPresent === 'string') {
            try {
                reportData.workersPresent = JSON.parse(reportData.workersPresent);
            } catch (e) {
                console.error('Error parsing workersPresent', e);
            }
        }

        const report = new DailyReport(reportData);
        const createdReport = await report.save();
        res.status(201).json(createdReport);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const updateDailyReport = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const report = await DailyReport.findById(id);

        if (report) {
            // Handle file uploads on update if necessary
            let photos: string[] = [];
            if (req.files && Array.isArray(req.files)) {
                photos = (req.files as any[]).map(file => file.path);
            }

            const updates = { ...req.body };
            if (photos.length > 0) {
                const existingPhotos = updates.photos ? (Array.isArray(updates.photos) ? updates.photos : [updates.photos]) : (report.photos || []);
                updates.photos = [...existingPhotos, ...photos];
            } else if (updates.photos) {
                // If photos provided in body but no files, ensure it is array
                updates.photos = Array.isArray(updates.photos) ? updates.photos : [updates.photos];
            }

            if (typeof updates.materialsUsed === 'string') {
                try {
                    updates.materialsUsed = JSON.parse(updates.materialsUsed);
                } catch (e) { }
            }
            if (typeof updates.workersPresent === 'string') {
                try {
                    updates.workersPresent = JSON.parse(updates.workersPresent);
                } catch (e) { }
            }

            Object.assign(report, updates);
            const updatedReport = await report.save();
            res.json(updatedReport);
        } else {
            res.status(404).json({ message: 'Daily Report not found' });
        }
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

export const deleteDailyReport = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const report = await DailyReport.findById(id);

        if (report) {
            await report.deleteOne();
            res.json({ message: 'Daily Report removed' });
        } else {
            res.status(404).json({ message: 'Daily Report not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
