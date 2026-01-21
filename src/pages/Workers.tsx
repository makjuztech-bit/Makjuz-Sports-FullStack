import { useState } from 'react';
import { Plus, Search, Filter, Phone, User, CheckCircle2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Worker } from '@/data/mockData';

export default function Workers() {
  const { workers, projects, addWorker, updateWorker } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [newWorker, setNewWorker] = useState({
    name: '',
    role: '',
    contact: '',
    dailyRate: '',
    aadhar: '',
    daysWorked: 0,
    paymentPending: 0,
    experience: ''
  });

  const roles = [...new Set(workers.map(w => w.role))];

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    const matchesRole = roleFilter === 'all' || w.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleAddWorker = () => {
    const worker: Worker = {
      id: `WRK${String(workers.length + 1).padStart(3, '0')}`,
      name: newWorker.name,
      role: newWorker.role,
      contact: newWorker.contact,
      status: 'Active',
      dailyRate: parseFloat(newWorker.dailyRate) || 0,
      joinDate: new Date().toISOString().split('T')[0],
      aadhar: newWorker.aadhar,
      daysWorked: newWorker.daysWorked,
      paymentPending: newWorker.paymentPending,
      experience: newWorker.experience
    };
    addWorker(worker);
    setIsDialogOpen(false);
    setNewWorker({ name: '', role: '', contact: '', dailyRate: '', aadhar: '', daysWorked: 0, paymentPending: 0, experience: '' });
  };

  const toggleAttendance = (workerId: string) => {
    setAttendance(prev => ({
      ...prev,
      [workerId]: !prev[workerId]
    }));
  };

  const getProjectName = (projectId?: string) => {
    if (!projectId) return 'Unassigned';
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown';
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Workers"
        description="Manage workforce and daily attendance"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Worker
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Worker</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="e.g., Suresh Kumar"
                  value={newWorker.name}
                  onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Role (Work Type)</Label>
                <Select
                  value={newWorker.role}
                  onValueChange={(v) => setNewWorker({ ...newWorker, role: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Site Supervisor">Site Supervisor</SelectItem>
                    <SelectItem value="Installer">Installer</SelectItem>
                    <SelectItem value="Helper">Helper</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Contact Number</Label>
                <Input
                  placeholder="e.g., 9876543210"
                  value={newWorker.contact}
                  onChange={(e) => setNewWorker({ ...newWorker, contact: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Aadhar Number</Label>
                <Input
                  placeholder="e.g., 1234 5678 9012"
                  value={newWorker.aadhar || ''}
                  onChange={(e) => setNewWorker({ ...newWorker, aadhar: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Experience</Label>
                <Input
                  placeholder="e.g., 5 Years"
                  value={newWorker.experience || ''}
                  onChange={(e) => setNewWorker({ ...newWorker, experience: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Daily Rate (₹)</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 800"
                    value={newWorker.dailyRate}
                    onChange={(e) => setNewWorker({ ...newWorker, dailyRate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Days Worked</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 0"
                    value={newWorker.daysWorked || 0}
                    onChange={(e) => setNewWorker({ ...newWorker, daysWorked: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleAddWorker}>
                Add Worker
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Total Workers</p>
            <p className="text-2xl font-bold">{workers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-success">{workers.filter(w => w.status === 'Active').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">On Leave</p>
            <p className="text-2xl font-bold text-warning">{workers.filter(w => w.status === 'On Leave').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">Today's Attendance</p>
            <p className="text-2xl font-bold">{Object.values(attendance).filter(Boolean).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search workers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="On Leave">On Leave</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Worker Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWorkers.map((worker) => (
          <Card key={worker.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Attendance Checkbox */}
                <div className="flex flex-col items-center gap-1 pt-1">
                  <Checkbox
                    checked={attendance[worker.id] || false}
                    onCheckedChange={() => toggleAttendance(worker.id)}
                    disabled={worker.status !== 'Active'}
                  />
                  <span className="text-xs text-muted-foreground">Present</span>
                </div>

                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold truncate">{worker.name}</p>
                      <p className="text-sm text-muted-foreground">{worker.role}</p>
                    </div>
                    <StatusBadge variant={getStatusVariant(worker.status)}>
                      {worker.status}
                    </StatusBadge>
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span>{worker.contact}</span>
                    </div>
                    {worker.aadhar && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-semibold text-xs">Aadhar:</span>
                        <span className="text-xs">{worker.aadhar}</span>
                      </div>
                    )}
                    <p className="text-sm">
                      <span className="text-muted-foreground">Project:</span>{' '}
                      <span className="font-medium">{getProjectName(worker.projectId)}</span>
                    </p>
                    <div className="flex justify-between items-center text-sm pt-1">
                      <span>Rate: <span className="font-medium">₹{worker.dailyRate}</span></span>
                      <span>Days: <span className="font-medium">{worker.daysWorked || 0}</span></span>
                    </div>
                    {worker.experience && (
                      <p className="text-sm pt-1">
                        <span className="text-muted-foreground">Exp:</span>{' '}
                        <span className="font-medium">{worker.experience}</span>
                      </p>
                    )}
                    <p className="text-sm border-t mt-2 pt-1 flex justify-between">
                      <span className="text-muted-foreground">Pending Payment:</span>
                      <span className="font-bold text-primary">₹{worker.paymentPending || 0}</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No workers found</p>
        </div>
      )}
    </div>
  );
}
