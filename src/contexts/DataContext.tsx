import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Project,
  Material,
  Supplier,
  Worker,
  ScheduleItem,
  DailyReport
} from '@/data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface DataContextType {
  projects: Project[];
  materials: Material[];
  suppliers: Supplier[];
  workers: Worker[];
  schedule: ScheduleItem[];
  dailyReports: DailyReport[];
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  addMaterial: (material: Material) => Promise<void>;
  updateMaterial: (id: string, updates: Partial<Material>) => Promise<void>;
  addSupplier: (supplier: Supplier) => Promise<void>;
  updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>;
  addWorker: (worker: Worker) => Promise<void>;
  updateWorker: (id: string, updates: Partial<Worker>) => Promise<void>;
  addScheduleItem: (item: ScheduleItem) => Promise<void>;
  updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => Promise<void>;
  addDailyReport: (report: DailyReport | FormData) => Promise<void>;
  updateDailyReport: (id: string, updates: Partial<DailyReport> | FormData) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
  deleteWorker: (id: string) => Promise<void>;
  deleteScheduleItem: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);

  const fetchData = async () => {
    try {
      const [projectsRes, materialsRes, suppliersRes, workersRes, scheduleRes, reportsRes] = await Promise.all([
        fetch(`${API_URL}/projects`),
        fetch(`${API_URL}/materials`),
        fetch(`${API_URL}/suppliers`),
        fetch(`${API_URL}/workers`),
        fetch(`${API_URL}/schedule`),
        fetch(`${API_URL}/daily-reports`)
      ]);

      const projectsData = await projectsRes.json();
      const materialsData = await materialsRes.json();
      const suppliersData = await suppliersRes.json();
      const workersData = await workersRes.json();
      const scheduleData = await scheduleRes.json();
      const reportsData = await reportsRes.json();

      setProjects(projectsData);
      setMaterials(materialsData);
      setSuppliers(suppliersData);
      setWorkers(workersData);
      setSchedule(scheduleData);
      setDailyReports(reportsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addProject = async (project: Project) => {
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      const newProject = await res.json();
      setProjects(prev => [...prev, newProject]);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const res = await fetch(`${API_URL}/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updatedProject = await res.json();
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const addMaterial = async (material: Material) => {
    try {
      const res = await fetch(`${API_URL}/materials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material)
      });
      const newMaterial = await res.json();
      setMaterials(prev => [...prev, newMaterial]);
    } catch (error) {
      console.error('Error adding material:', error);
    }
  };

  const updateMaterial = async (id: string, updates: Partial<Material>) => {
    try {
      const res = await fetch(`${API_URL}/materials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updatedMaterial = await res.json();
      setMaterials(prev => prev.map(m => m.id === id ? updatedMaterial : m));
    } catch (error) {
      console.error('Error updating material:', error);
    }
  };

  const addSupplier = async (supplier: Supplier) => {
    try {
      const res = await fetch(`${API_URL}/suppliers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier)
      });
      const newSupplier = await res.json();
      setSuppliers(prev => [...prev, newSupplier]);
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const updateSupplier = async (id: string, updates: Partial<Supplier>) => {
    try {
      const res = await fetch(`${API_URL}/suppliers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updatedSupplier = await res.json();
      setSuppliers(prev => prev.map(s => s.id === id ? updatedSupplier : s));
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const addWorker = async (worker: Worker) => {
    try {
      const res = await fetch(`${API_URL}/workers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(worker)
      });
      const newWorker = await res.json();
      setWorkers(prev => [...prev, newWorker]);
    } catch (error) {
      console.error('Error adding worker:', error);
    }
  };

  const updateWorker = async (id: string, updates: Partial<Worker>) => {
    try {
      const res = await fetch(`${API_URL}/workers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updatedWorker = await res.json();
      setWorkers(prev => prev.map(w => w.id === id ? updatedWorker : w));
    } catch (error) {
      console.error('Error updating worker:', error);
    }
  };

  const addScheduleItem = async (item: ScheduleItem) => {
    try {
      const res = await fetch(`${API_URL}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const newItem = await res.json();
      setSchedule(prev => [...prev, newItem]);
    } catch (error) {
      console.error('Error adding schedule item:', error);
    }
  };

  const updateScheduleItem = async (id: string, updates: Partial<ScheduleItem>) => {
    try {
      const res = await fetch(`${API_URL}/schedule/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const updatedItem = await res.json();
      setSchedule(prev => prev.map(s => s.id === id ? updatedItem : s));
    } catch (error) {
      console.error('Error updating schedule item:', error);
    }
  };

  const addDailyReport = async (report: DailyReport | FormData) => {
    try {
      const isFormData = report instanceof FormData;
      const headers: HeadersInit = isFormData ? {} : { 'Content-Type': 'application/json' };
      const body = isFormData ? report : JSON.stringify(report);

      const res = await fetch(`${API_URL}/daily-reports`, {
        method: 'POST',
        headers,
        body
      });
      const newReport = await res.json();
      setDailyReports(prev => [...prev, newReport]);
    } catch (error) {
      console.error('Error adding daily report:', error);
    }
  };

  const updateDailyReport = async (id: string, updates: Partial<DailyReport> | FormData) => {
    try {
      const isFormData = updates instanceof FormData;
      const headers: HeadersInit = isFormData ? {} : { 'Content-Type': 'application/json' };
      const body = isFormData ? updates : JSON.stringify(updates);

      const res = await fetch(`${API_URL}/daily-reports/${id}`, {
        method: 'PUT',
        headers,
        body
      });
      const updatedReport = await res.json();
      setDailyReports(prev => prev.map(r => r.id === id ? updatedReport : r));
    } catch (error) {
      console.error('Error updating daily report:', error);
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      await fetch(`${API_URL}/materials/${id}`, { method: 'DELETE' });
      setMaterials(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await fetch(`${API_URL}/suppliers/${id}`, { method: 'DELETE' });
      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const deleteWorker = async (id: string) => {
    try {
      await fetch(`${API_URL}/workers/${id}`, { method: 'DELETE' });
      setWorkers(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      console.error('Error deleting worker:', error);
    }
  };

  const deleteScheduleItem = async (id: string) => {
    try {
      await fetch(`${API_URL}/schedule/${id}`, { method: 'DELETE' });
      setSchedule(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting schedule item:', error);
    }
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
      addSupplier,
      updateSupplier,
      addWorker,
      updateWorker,
      addScheduleItem,
      updateScheduleItem,
      addDailyReport,
      updateDailyReport,
      deleteMaterial,
      deleteSupplier,
      deleteWorker,
      deleteScheduleItem
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
