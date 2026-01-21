import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
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
import { Project } from '@/data/mockData';

export default function Projects() {
  const navigate = useNavigate();
  const { projects, addProject } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    turfType: 'Cricket' as Project['turfType'],
    location: '',
    startDate: '',
    expectedCompletion: '',
    budget: ''
  });

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddProject = () => {
    const project: Project = {
      id: `PRJ${String(projects.length + 1).padStart(3, '0')}`,
      name: newProject.name,
      turfType: newProject.turfType,
      location: newProject.location,
      startDate: newProject.startDate,
      expectedCompletion: newProject.expectedCompletion,
      status: 'Planning',
      progress: 0,
      budget: parseFloat(newProject.budget) || 0,
      spent: 0,
      managerId: 'USR001'
    };
    addProject(project);
    setIsDialogOpen(false);
    setNewProject({
      name: '',
      turfType: 'Cricket',
      location: '',
      startDate: '',
      expectedCompletion: '',
      budget: ''
    });
  };

  const columns = [
    {
      key: 'name',
      header: 'Project Name',
      cell: (project: Project) => (
        <div>
          <p className="font-medium">{project.name}</p>
          <p className="text-xs text-muted-foreground">{project.id}</p>
        </div>
      )
    },
    {
      key: 'turfType',
      header: 'Type',
      cell: (project: Project) => (
        <span className="text-sm">{project.turfType}</span>
      )
    },
    {
      key: 'location',
      header: 'Location',
    },
    {
      key: 'progress',
      header: 'Progress',
      cell: (project: Project) => (
        <div className="flex items-center gap-2 min-w-32">
          <Progress value={project.progress} className="flex-1 h-2" />
          <span className="text-sm font-medium w-10">{project.progress}%</span>
        </div>
      )
    },
    {
      key: 'expectedCompletion',
      header: 'Due Date',
      cell: (project: Project) => (
        <span className="text-sm">
          {new Date(project.expectedCompletion).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (project: Project) => (
        <StatusBadge variant={getStatusVariant(project.status)}>
          {project.status}
        </StatusBadge>
      )
    },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Projects"
        description="Manage your arena and turf construction projects"
      >
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/compare')}>
            Compare Projects
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Arena Turf - Hyderabad"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="turfType">Turf Type</Label>
                  <Select
                    value={newProject.turfType}
                    onValueChange={(v) => setNewProject({ ...newProject, turfType: v as Project['turfType'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cricket">Cricket</SelectItem>
                      <SelectItem value="Football">Football</SelectItem>
                      <SelectItem value="Multi-Sport">Multi-Sport</SelectItem>
                      <SelectItem value="Tennis">Tennis</SelectItem>
                      <SelectItem value="Badminton">Badminton</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Hyderabad, Telangana"
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Expected Completion</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newProject.expectedCompletion}
                      onChange={(e) => setNewProject({ ...newProject, expectedCompletion: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (₹)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 2500000"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  />
                </div>
                <Button className="w-full" onClick={handleAddProject}>
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredProjects}
        onRowClick={(project) => navigate(`/projects/${project.id}`)}
        emptyMessage="No projects found"
      />
    </div>
  );
}
