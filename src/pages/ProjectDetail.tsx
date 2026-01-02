import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, Package, FileText, CheckCircle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, workers, schedule, dailyReports, updateProject } = useData();

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Project not found</p>
        <Button variant="outline" onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const projectWorkers = workers.filter(w => w.projectId === id);
  const projectSchedule = schedule.filter(s => s.projectId === id);
  const projectReports = dailyReports.filter(r => r.projectId === id);

  const handleStatusChange = (newStatus: string) => {
    updateProject(id, { 
      status: newStatus as typeof project.status,
      progress: newStatus === 'Completed' ? 100 : project.progress
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" className="mb-4" onClick={() => navigate('/projects')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <StatusBadge variant={getStatusVariant(project.status)}>
                {project.status}
              </StatusBadge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {project.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(project.startDate).toLocaleDateString('en-IN')} - {new Date(project.expectedCompletion).toLocaleDateString('en-IN')}
              </span>
              <span>{project.turfType} Turf</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={project.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Progress</p>
              <p className="text-3xl font-bold">{project.progress}%</p>
              <Progress value={project.progress} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Budget</p>
              <p className="text-2xl font-bold">₹{(project.budget / 100000).toFixed(1)}L</p>
              <p className="text-xs text-muted-foreground mt-1">
                Spent: ₹{(project.spent / 100000).toFixed(1)}L ({Math.round((project.spent / project.budget) * 100)}%)
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Workers Assigned</p>
              <p className="text-3xl font-bold">{projectWorkers.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Active on this project</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Days Remaining</p>
              <p className="text-3xl font-bold">
                {Math.max(0, Math.ceil((new Date(project.expectedCompletion).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Until completion</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Daily Work
          </TabsTrigger>
          <TabsTrigger value="workers" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Workers
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Work</CardTitle>
            </CardHeader>
            <CardContent>
              {projectSchedule.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No work scheduled for this project</p>
              ) : (
                <div className="space-y-4">
                  {projectSchedule.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${
                        item.status === 'Completed' ? 'bg-success' :
                        item.status === 'In Progress' ? 'bg-info' :
                        item.status === 'Delayed' ? 'bg-destructive' : 'bg-muted-foreground'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{item.work}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.date).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short' })}
                            </p>
                          </div>
                          <StatusBadge variant={getStatusVariant(item.status)}>
                            {item.status}
                          </StatusBadge>
                        </div>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {item.workers.length} workers
                          </span>
                          {item.materials.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              {item.materials.length} materials
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workers">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Workers</CardTitle>
            </CardHeader>
            <CardContent>
              {projectWorkers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No workers assigned to this project</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {projectWorkers.map((worker) => (
                    <div key={worker.id} className="flex items-center gap-3 p-4 rounded-lg border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {worker.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{worker.name}</p>
                        <p className="text-sm text-muted-foreground">{worker.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Daily Reports</CardTitle>
            </CardHeader>
            <CardContent>
              {projectReports.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No reports submitted for this project</p>
              ) : (
                <div className="space-y-4">
                  {projectReports.map((report) => (
                    <div key={report.id} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium">
                            {new Date(report.date).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-sm text-muted-foreground">Submitted by {report.createdBy}</p>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{report.workPerformed}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {report.workersPresent.length} workers
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          {report.materialsUsed.length} materials used
                        </span>
                      </div>
                      {report.issues && report.issues !== 'None' && (
                        <p className="text-sm text-destructive mt-2">Issues: {report.issues}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
