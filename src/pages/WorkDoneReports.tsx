import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Progress } from '@/components/ui/progress';
import { Printer, FileDown, Calendar, Users, Package, IndianRupee } from 'lucide-react';

export default function WorkDoneReports() {
  const { projects, workers, dailyReports } = useData();

  const completedProjects = projects.filter(p => p.status === 'Completed');
  const inProgressProjects = projects.filter(p => p.status === 'In Progress');

  const getProjectStats = (projectId: string) => {
    const projectReports = dailyReports.filter(r => r.projectId === projectId);
    const projectWorkers = workers.filter(w => w.projectId === projectId);
    
    const allWorkers = new Set<string>();
    const allMaterials = new Map<string, number>();
    
    projectReports.forEach(report => {
      report.workersPresent.forEach(w => allWorkers.add(w));
      report.materialsUsed.forEach(m => {
        allMaterials.set(m.name, (allMaterials.get(m.name) || 0) + m.quantity);
      });
    });

    return {
      totalReports: projectReports.length,
      totalWorkers: allWorkers.size,
      totalMaterials: allMaterials.size
    };
  };

  const handlePrint = (projectId: string) => {
    window.print();
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Work Done Reports"
        description="View consolidated project completion reports"
      />

      {/* Completed Projects */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-success"></span>
          Completed Projects
        </h2>
        
        {completedProjects.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No completed projects yet
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {completedProjects.map((project) => {
              const stats = getProjectStats(project.id);
              const startDate = new Date(project.startDate);
              const endDate = new Date(project.expectedCompletion);
              const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <Card key={project.id} className="overflow-hidden">
                  <CardHeader className="bg-success/5 border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{project.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {project.location} • {project.turfType} Turf
                        </p>
                      </div>
                      <StatusBadge variant="success">Completed</StatusBadge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-6 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-semibold">{duration} days</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Users className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Manpower</p>
                          <p className="font-semibold">{stats.totalWorkers} workers</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Materials Used</p>
                          <p className="font-semibold">{stats.totalMaterials} types</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <IndianRupee className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Final Cost</p>
                          <p className="font-semibold">₹{(project.spent / 100000).toFixed(1)}L</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-4 border-t">
                      <Button variant="outline" size="sm" onClick={() => handlePrint(project.id)}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileDown className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* In Progress Projects */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-info"></span>
          In Progress Projects
        </h2>
        
        <div className="grid gap-4 md:grid-cols-2">
          {inProgressProjects.map((project) => {
            const stats = getProjectStats(project.id);
            
            return (
              <Card key={project.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold">{project.name}</p>
                      <p className="text-sm text-muted-foreground">{project.location}</p>
                    </div>
                    <StatusBadge variant="info">{project.progress}%</StatusBadge>
                  </div>
                  
                  <Progress value={project.progress} className="mb-4 h-2" />
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold">{stats.totalReports}</p>
                      <p className="text-xs text-muted-foreground">Reports</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stats.totalWorkers}</p>
                      <p className="text-xs text-muted-foreground">Workers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">₹{(project.spent / 100000).toFixed(1)}L</p>
                      <p className="text-xs text-muted-foreground">Spent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
