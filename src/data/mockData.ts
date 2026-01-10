// Mock Data for Arena Construction Management System

export interface Project {
  id: string;
  name: string;
  turfType: 'Cricket' | 'Football' | 'Multi-Sport' | 'Tennis' | 'Badminton';
  location: string;
  startDate: string;
  expectedCompletion: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  progress: number;
  budget: number;
  spent: number;
  managerId: string;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  supplier: string;
  lastUpdated: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  materials: string[];
  rating: number;
  amountPaid: number;
  notes: string;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  contact: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  projectId?: string;
  dailyRate: number;
  joinDate: string;
  aadhar?: string;
  daysWorked?: number;
  paymentPending?: number;
}

export interface ScheduleItem {
  id: string;
  startDate: string;
  endDate: string;
  projectId: string;
  projectName: string;
  work: string;
  workers: string[];
  materials: { name: string; quantity: number; unit: string }[];
  deliveryMaterials?: { name: string; quantity: number; unit: string }[];
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed';
}

export interface DailyReport {
  id: string;
  date: string;
  projectId: string;
  projectName: string;
  workPerformed: string;
  workersPresent: string[];
  materialsUsed: { name: string; quantity: number; unit: string }[];
  photos?: string[];
  issues: string;
  remarks: string;
  createdBy: string;
}

// Mock Projects
export const projects: Project[] = [
  {
    id: 'PRJ001',
    name: 'Arena Turf – Chennai',
    turfType: 'Cricket',
    location: 'Chennai, Tamil Nadu',
    startDate: '2026-01-01',
    expectedCompletion: '2026-01-25',
    status: 'In Progress',
    progress: 45,
    budget: 2500000,
    spent: 1125000,
    managerId: 'USR001'
  },
  {
    id: 'PRJ002',
    name: 'Sports Hub – Bangalore',
    turfType: 'Football',
    location: 'Bangalore, Karnataka',
    startDate: '2025-12-15',
    expectedCompletion: '2026-01-20',
    status: 'In Progress',
    progress: 68,
    budget: 3200000,
    spent: 2176000,
    managerId: 'USR001'
  },
  {
    id: 'PRJ003',
    name: 'Elite Arena – Mumbai',
    turfType: 'Multi-Sport',
    location: 'Mumbai, Maharashtra',
    startDate: '2026-01-05',
    expectedCompletion: '2026-02-15',
    status: 'Planning',
    progress: 10,
    budget: 4500000,
    spent: 450000,
    managerId: 'USR002'
  },
  {
    id: 'PRJ004',
    name: 'Victory Grounds – Delhi',
    turfType: 'Cricket',
    location: 'New Delhi',
    startDate: '2025-11-01',
    expectedCompletion: '2025-12-30',
    status: 'Completed',
    progress: 100,
    budget: 2800000,
    spent: 2650000,
    managerId: 'USR001'
  }
];

// Mock Materials
export const materials: Material[] = [
  {
    id: 'MAT001',
    name: 'Artificial Grass (Premium)',
    category: 'Turf',
    quantity: 2500,
    unit: 'sq.ft',
    minStock: 500,
    supplier: 'ABC Turf Supplies',
    lastUpdated: '2026-01-01'
  },
  {
    id: 'MAT002',
    name: 'Silica Sand',
    category: 'Base Material',
    quantity: 15,
    unit: 'tons',
    minStock: 5,
    supplier: 'BuildRight Materials',
    lastUpdated: '2025-12-28'
  },
  {
    id: 'MAT003',
    name: 'Rubber Granules (Black)',
    category: 'Infill',
    quantity: 25,
    unit: 'bags',
    minStock: 10,
    supplier: 'ABC Turf Supplies',
    lastUpdated: '2025-12-30'
  },
  {
    id: 'MAT004',
    name: 'Shock Pad',
    category: 'Underlay',
    quantity: 1200,
    unit: 'sq.ft',
    minStock: 300,
    supplier: 'SportBase India',
    lastUpdated: '2025-12-25'
  },
  {
    id: 'MAT005',
    name: 'Seaming Tape',
    category: 'Accessories',
    quantity: 50,
    unit: 'rolls',
    minStock: 15,
    supplier: 'ABC Turf Supplies',
    lastUpdated: '2025-12-29'
  },
  {
    id: 'MAT006',
    name: 'Drainage Pipes',
    category: 'Infrastructure',
    quantity: 200,
    unit: 'meters',
    minStock: 50,
    supplier: 'BuildRight Materials',
    lastUpdated: '2025-12-20'
  }
];

// Mock Suppliers
export const suppliers: Supplier[] = [
  {
    id: 'SUP001',
    name: 'ABC Turf Supplies',
    contact: '9876543210',
    email: 'sales@abcturf.com',
    materials: ['Artificial Grass', 'Rubber Granules', 'Seaming Tape'],
    rating: 4.5,
    amountPaid: 150000,
    notes: 'Reliable supplier, on-time delivery'
  },
  {
    id: 'SUP002',
    name: 'BuildRight Materials',
    contact: '9123456780',
    email: 'orders@buildright.in',
    materials: ['Silica Sand', 'Drainage Pipes', 'Cement'],
    rating: 4.2,
    amountPaid: 85000,
    notes: 'Good pricing, bulk discounts available'
  },
  {
    id: 'SUP003',
    name: 'SportBase India',
    contact: '9988776655',
    email: 'contact@sportbase.in',
    materials: ['Shock Pad', 'Underlay', 'Sports Flooring'],
    rating: 4.8,
    amountPaid: 200000,
    notes: 'Premium quality, 2-year warranty'
  }
];

// Mock Workers
export const workers: Worker[] = [
  { id: 'WRK001', name: 'Ramesh Kumar', role: 'Site Supervisor', contact: '9876500001', status: 'Active', projectId: 'PRJ001', dailyRate: 1200, joinDate: '2024-03-15', aadhar: '1234 5678 9012', daysWorked: 25, paymentPending: 0 },
  { id: 'WRK002', name: 'Suresh Patel', role: 'Installer', contact: '9876500002', status: 'Active', projectId: 'PRJ001', dailyRate: 800, joinDate: '2024-05-20', aadhar: '2345 6789 0123', daysWorked: 22, paymentPending: 1600 },
  { id: 'WRK003', name: 'Mahesh Singh', role: 'Installer', contact: '9876500003', status: 'Active', projectId: 'PRJ001', dailyRate: 800, joinDate: '2024-06-10', aadhar: '3456 7890 1234', daysWorked: 20, paymentPending: 0 },
  { id: 'WRK004', name: 'Rajesh Yadav', role: 'Helper', contact: '9876500004', status: 'Active', projectId: 'PRJ002', dailyRate: 500, joinDate: '2024-07-01', aadhar: '4567 8901 2345', daysWorked: 18, paymentPending: 500 },
  { id: 'WRK005', name: 'Dinesh Sharma', role: 'Installer', contact: '9876500005', status: 'Active', projectId: 'PRJ002', dailyRate: 800, joinDate: '2024-04-22', aadhar: '5678 9012 3456', daysWorked: 24, paymentPending: 0 },
  { id: 'WRK006', name: 'Anil Verma', role: 'Site Supervisor', contact: '9876500006', status: 'Active', projectId: 'PRJ002', dailyRate: 1200, joinDate: '2023-11-05', aadhar: '6789 0123 4567', daysWorked: 26, paymentPending: 0 },
  { id: 'WRK007', name: 'Vijay Reddy', role: 'Helper', contact: '9876500007', status: 'On Leave', dailyRate: 500, joinDate: '2024-08-15', aadhar: '7890 1234 5678', daysWorked: 10, paymentPending: 0 },
  { id: 'WRK008', name: 'Prakash Nair', role: 'Installer', contact: '9876500008', status: 'Active', projectId: 'PRJ001', dailyRate: 800, joinDate: '2024-02-28', aadhar: '8901 2345 6789', daysWorked: 23, paymentPending: 800 },
  { id: 'WRK009', name: 'Sanjay Gupta', role: 'Driver', contact: '9876500009', status: 'Active', dailyRate: 700, joinDate: '2024-01-10', aadhar: '9012 3456 7890', daysWorked: 25, paymentPending: 0 },
  { id: 'WRK010', name: 'Kiran Das', role: 'Helper', contact: '9876500010', status: 'Active', projectId: 'PRJ001', dailyRate: 500, joinDate: '2024-09-01', aadhar: '0123 4567 8901', daysWorked: 21, paymentPending: 0 },
  { id: 'WRK011', name: 'Mohan Pillai', role: 'Installer', contact: '9876500011', status: 'Active', projectId: 'PRJ002', dailyRate: 800, joinDate: '2024-04-05', aadhar: '1234 5678 9013', daysWorked: 22, paymentPending: 0 },
  { id: 'WRK012', name: 'Gopal Krishna', role: 'Helper', contact: '9876500012', status: 'Inactive', dailyRate: 500, joinDate: '2023-09-20', aadhar: '2345 6789 0124', daysWorked: 0, paymentPending: 0 }
];

// Mock Schedule
export const scheduleItems: ScheduleItem[] = [
  {
    id: 'SCH001',
    startDate: '2026-01-02',
    endDate: '2026-01-04',
    projectId: 'PRJ001',
    projectName: 'Arena Turf – Chennai',
    work: 'Base layer preparation and leveling',
    workers: ['Ramesh Kumar', 'Suresh Patel', 'Mahesh Singh'],
    materials: [{ name: 'Silica Sand', quantity: 2, unit: 'tons' }],
    deliveryMaterials: [{ name: 'Cement', quantity: 50, unit: 'bags' }],
    status: 'In Progress'
  },
  {
    id: 'SCH002',
    startDate: '2026-01-02',
    endDate: '2026-01-03',
    projectId: 'PRJ002',
    projectName: 'Sports Hub – Bangalore',
    work: 'Turf installation - Section B',
    workers: ['Anil Verma', 'Dinesh Sharma', 'Mohan Pillai'],
    materials: [
      { name: 'Artificial Grass', quantity: 500, unit: 'sq.ft' },
      { name: 'Seaming Tape', quantity: 5, unit: 'rolls' }
    ],
    status: 'Scheduled'
  },
  {
    id: 'SCH003',
    startDate: '2026-01-03',
    endDate: '2026-01-03',
    projectId: 'PRJ001',
    projectName: 'Arena Turf – Chennai',
    work: 'Shock pad installation',
    workers: ['Ramesh Kumar', 'Prakash Nair', 'Kiran Das'],
    materials: [{ name: 'Shock Pad', quantity: 400, unit: 'sq.ft' }],
    status: 'Scheduled'
  },
  {
    id: 'SCH004',
    startDate: '2026-01-01',
    endDate: '2026-01-01',
    projectId: 'PRJ001',
    projectName: 'Arena Turf – Chennai',
    work: 'Site clearing and marking',
    workers: ['Ramesh Kumar', 'Suresh Patel'],
    materials: [],
    status: 'Completed'
  }
];

// Mock Daily Reports
export const dailyReports: DailyReport[] = [
  {
    id: 'RPT001',
    date: '2026-01-01',
    projectId: 'PRJ001',
    projectName: 'Arena Turf – Chennai',
    workPerformed: 'Completed site clearing, boundary marking, and initial measurements. Verified drainage points.',
    workersPresent: ['Ramesh Kumar', 'Suresh Patel', 'Mahesh Singh', 'Kiran Das'],
    materialsUsed: [],
    photos: [],
    issues: 'None',
    remarks: 'Work completed as per schedule. Site ready for base preparation.',
    createdBy: 'Ramesh Kumar'
  },
  {
    id: 'RPT002',
    date: '2025-12-31',
    projectId: 'PRJ002',
    projectName: 'Sports Hub – Bangalore',
    workPerformed: 'Installed artificial turf in Section A (approx 600 sq.ft). Completed seaming work.',
    workersPresent: ['Anil Verma', 'Dinesh Sharma', 'Mohan Pillai', 'Rajesh Yadav'],
    materialsUsed: [
      { name: 'Artificial Grass', quantity: 600, unit: 'sq.ft' },
      { name: 'Seaming Tape', quantity: 8, unit: 'rolls' },
      { name: 'Rubber Granules', quantity: 3, unit: 'bags' }
    ],
    issues: 'Minor delay due to rain in the morning (1 hour)',
    remarks: 'Quality check passed. Moving to Section B tomorrow.',
    createdBy: 'Anil Verma'
  }
];

// Dashboard Stats
export const dashboardStats = {
  activeProjects: projects.filter(p => p.status === 'In Progress').length,
  todayScheduled: scheduleItems.filter(s => s.startDate <= '2026-01-02' && s.endDate >= '2026-01-02' && s.status !== 'Completed').length,
  todayCompleted: scheduleItems.filter(s => s.endDate === '2026-01-02' && s.status === 'Completed').length,
  pendingTasks: scheduleItems.filter(s => s.status === 'Scheduled' || s.status === 'Delayed').length,
  workersPresent: workers.filter(w => w.status === 'Active').length,
  totalWorkers: workers.length
};

// Material Stock Summary for Dashboard
export const stockSummary = materials.map(m => ({
  name: m.name,
  quantity: m.quantity,
  unit: m.unit,
  status: m.quantity <= m.minStock ? 'Low' : m.quantity <= m.minStock * 2 ? 'Medium' : 'Good'
}));
