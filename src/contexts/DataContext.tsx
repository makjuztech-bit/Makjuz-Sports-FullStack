import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  projects as initialProjects, 
  materials as initialMaterials,
  suppliers as initialSuppliers,
  workers as initialWorkers,
  scheduleItems as initialSchedule,
  dailyReports as initialReports,
  Project,
  Material,
  Supplier,
  Worker,
  ScheduleItem,
  DailyReport
} from '@/data/mockData';

interface DataContextType {
  projects: Project[];
  materials: Material[];
  suppliers: Supplier[];
  workers: Worker[];
  schedule: ScheduleItem[];
  dailyReports: DailyReport[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addMaterial: (material: Material) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  addWorker: (worker: Worker) => void;
  updateWorker: (id: string, updates: Partial<Worker>) => void;
  addScheduleItem: (item: ScheduleItem) => void;
  updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => void;
  addDailyReport: (report: DailyReport) => void;
  updateDailyReport: (id: string, updates: Partial<DailyReport>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [suppliers] = useState<Supplier[]>(initialSuppliers);
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>(initialReports);

  const addProject = (project: Project) => {
    setProjects(prev => [...prev, project]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addMaterial = (material: Material) => {
    setMaterials(prev => [...prev, material]);
  };

  const updateMaterial = (id: string, updates: Partial<Material>) => {
    setMaterials(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const addWorker = (worker: Worker) => {
    setWorkers(prev => [...prev, worker]);
  };

  const updateWorker = (id: string, updates: Partial<Worker>) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const addScheduleItem = (item: ScheduleItem) => {
    setSchedule(prev => [...prev, item]);
  };

  const updateScheduleItem = (id: string, updates: Partial<ScheduleItem>) => {
    setSchedule(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addDailyReport = (report: DailyReport) => {
    setDailyReports(prev => [...prev, report]);
  };

  const updateDailyReport = (id: string, updates: Partial<DailyReport>) => {
    setDailyReports(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  return (
    <DataContext.Provider value={{
      projects,
      materials,
      suppliers,
      workers,
      schedule,
      dailyReports,
      addProject,
      updateProject,
      addMaterial,
      updateMaterial,
      addWorker,
      updateWorker,
      addScheduleItem,
      updateScheduleItem,
      addDailyReport,
      updateDailyReport
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
