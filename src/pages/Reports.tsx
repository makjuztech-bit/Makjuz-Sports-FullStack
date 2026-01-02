import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Package, 
  FileDown,
  Printer,
  Calendar
} from 'lucide-react';

export default function Reports() {
  const { projects, materials, workers, schedule, dailyReports } = useData();
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: '2025-12-01',
    end: '2026-01-31'
  });

  const filteredReports = dailyReports.filter(r => {
    const matchesProject = projectFilter === 'all' || r.projectId === projectFilter;
    const reportDate = new Date(r.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    return matchesProject && reportDate >= startDate && reportDate <= endDate;
  });

  const activeWorkers = workers.filter(w => w.status === 'Active').length;
  const completedTasks = schedule.filter(s => s.status === 'Completed').length;
  const totalTasks = schedule.length;

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Reports"
        description="Generate and view comprehensive project reports"
      >
        <Button variant="outline">
          <FileDown className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </PageHeader>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project</label>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="All Projects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-40"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-40"
              />
            </div>
            <Button variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        {/* Daily Progress Report */}
        <TabsContent value="progress">
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tasks Completed</p>
                    <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reports Filed</p>
                    <p className="text-2xl font-bold">{filteredReports.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Workers</p>
                    <p className="text-2xl font-bold">{activeWorkers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Progress Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map(project => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{project.name}</p>
                        <p className="text-sm text-muted-foreground">{project.location}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge variant={getStatusVariant(project.status)}>
                          {project.status}
                        </StatusBadge>
                        <p className="text-sm text-muted-foreground mt-1">
                          Budget: ₹{(project.spent / 100000).toFixed(1)}L / ₹{(project.budget / 100000).toFixed(1)}L
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={project.progress} className="flex-1 h-3" />
                      <span className="font-semibold w-12 text-right">{project.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Material Usage Report */}
        <TabsContent value="materials">
          <Card>
            <CardHeader>
              <CardTitle>Material Usage Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Material</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">In Stock</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Min Stock</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map(material => {
                      const status = material.quantity <= material.minStock ? 'Low' : 
                                     material.quantity <= material.minStock * 2 ? 'Medium' : 'Good';
                      return (
                        <tr key={material.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <p className="font-medium">{material.name}</p>
                            <p className="text-xs text-muted-foreground">{material.supplier}</p>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{material.category}</td>
                          <td className="py-3 px-4 text-right font-semibold">
                            {material.quantity} {material.unit}
                          </td>
                          <td className="py-3 px-4 text-right text-muted-foreground">
                            {material.minStock} {material.unit}
                          </td>
                          <td className="py-3 px-4">
                            <StatusBadge variant={getStatusVariant(status)}>
                              {status}
                            </StatusBadge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Worker Attendance Report */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Worker Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {workers.map(worker => {
                  const workerReports = dailyReports.filter(r => 
                    r.workersPresent.includes(worker.name)
                  );
                  const project = projects.find(p => p.id === worker.projectId);
                  
                  return (
                    <div key={worker.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{worker.name}</p>
                          <p className="text-sm text-muted-foreground">{worker.role}</p>
                        </div>
                        <StatusBadge variant={getStatusVariant(worker.status)}>
                          {worker.status}
                        </StatusBadge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">Project:</span>{' '}
                          {project?.name || 'Unassigned'}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Days Worked:</span>{' '}
                          <span className="font-semibold">{workerReports.length}</span>
                        </p>
                        <p>
                          <span className="text-muted-foreground">Rate:</span>{' '}
                          ₹{worker.dailyRate}/day
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Project Timeline */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map(project => {
                  const startDate = new Date(project.startDate);
                  const endDate = new Date(project.expectedCompletion);
                  const today = new Date('2026-01-02');
                  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                  const daysElapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
                  
                  return (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold">{project.name}</p>
                          <p className="text-sm text-muted-foreground">{project.turfType} • {project.location}</p>
                        </div>
                        <StatusBadge variant={getStatusVariant(project.status)}>
                          {project.status}
                        </StatusBadge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{startDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                        </div>
                        <div className="flex-1 h-2 bg-muted rounded-full relative">
                          <div 
                            className="absolute left-0 top-0 h-full bg-primary rounded-full"
                            style={{ width: `${Math.min(100, (daysElapsed / totalDays) * 100)}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{endDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{daysElapsed} days elapsed</span>
                        <span>{daysRemaining} days remaining</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
