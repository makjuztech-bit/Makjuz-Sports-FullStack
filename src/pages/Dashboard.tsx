import { 
  FolderKanban, 
  CalendarCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  Package,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { projects, materials, workers, schedule } = useData();

  const activeProjects = projects.filter(p => p.status === 'In Progress').length;
  const todayDate = '2026-01-02';
  const todayScheduled = schedule.filter(s => s.date === todayDate && s.status !== 'Completed').length;
  const todayCompleted = schedule.filter(s => s.date === todayDate && s.status === 'Completed').length;
  const pendingTasks = schedule.filter(s => s.status === 'Scheduled' || s.status === 'Delayed').length;
  const activeWorkers = workers.filter(w => w.status === 'Active').length;

  const lowStockMaterials = materials.filter(m => m.quantity <= m.minStock);

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title={`Good morning, ${user?.name.split(' ')[0]}!`}
        description="Here's what's happening with your projects today."
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
        <StatCard
          title="Active Projects"
          value={activeProjects}
          icon={FolderKanban}
          variant="accent"
        />
        <StatCard
          title="Today's Scheduled"
          value={todayScheduled}
          subtitle="tasks"
          icon={CalendarCheck}
        />
        <StatCard
          title="Completed Today"
          value={todayCompleted}
          subtitle="tasks"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={Clock}
        />
        <StatCard
          title="Workers Present"
          value={`${activeWorkers}/${workers.length}`}
          icon={Users}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockMaterials.length}
          icon={Package}
          variant={lowStockMaterials.length > 0 ? 'warning' : 'default'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Project Progress</CardTitle>
            <Link to="/projects" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.filter(p => p.status !== 'Completed').slice(0, 4).map((project) => (
              <div key={project.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.location}</p>
                  </div>
                  <StatusBadge variant={getStatusVariant(project.status)}>
                    {project.status}
                  </StatusBadge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={project.progress} className="flex-1 h-2" />
                  <span className="text-sm font-medium w-12 text-right">{project.progress}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Today's Schedule</CardTitle>
            <Link to="/schedule" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {schedule.filter(s => s.date === todayDate).length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No tasks scheduled for today</p>
            ) : (
              <div className="space-y-3">
                {schedule.filter(s => s.date === todayDate).map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      item.status === 'Completed' ? 'bg-success' :
                      item.status === 'In Progress' ? 'bg-info' :
                      item.status === 'Delayed' ? 'bg-destructive' : 'bg-muted-foreground'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.work}</p>
                      <p className="text-xs text-muted-foreground">{item.projectName}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.workers.length} workers assigned
                      </p>
                    </div>
                    <StatusBadge variant={getStatusVariant(item.status)} className="shrink-0">
                      {item.status}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Material Stock Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Material Stock</CardTitle>
            <Link to="/materials" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {materials.slice(0, 5).map((material) => {
                const stockLevel = material.quantity <= material.minStock ? 'Low' : 
                                   material.quantity <= material.minStock * 2 ? 'Medium' : 'Good';
                return (
                  <div key={material.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">{material.name}</p>
                      <p className="text-xs text-muted-foreground">{material.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{material.quantity} {material.unit}</p>
                      <StatusBadge variant={getStatusVariant(stockLevel)} className="mt-1">
                        {stockLevel}
                      </StatusBadge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-success/10">
                <div className="flex items-center gap-2 text-success mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Completed Projects</span>
                </div>
                <p className="text-2xl font-bold text-success">
                  {projects.filter(p => p.status === 'Completed').length}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10">
                <div className="flex items-center gap-2 text-warning mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">Delayed Tasks</span>
                </div>
                <p className="text-2xl font-bold text-warning">
                  {schedule.filter(s => s.status === 'Delayed').length}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">Total Budget Utilization</p>
              <div className="flex items-center gap-3">
                <Progress 
                  value={(projects.reduce((a, p) => a + p.spent, 0) / projects.reduce((a, p) => a + p.budget, 0)) * 100} 
                  className="flex-1 h-3" 
                />
                <span className="text-sm font-semibold">
                  {Math.round((projects.reduce((a, p) => a + p.spent, 0) / projects.reduce((a, p) => a + p.budget, 0)) * 100)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ₹{(projects.reduce((a, p) => a + p.spent, 0) / 100000).toFixed(1)}L / ₹{(projects.reduce((a, p) => a + p.budget, 0) / 100000).toFixed(1)}L
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
