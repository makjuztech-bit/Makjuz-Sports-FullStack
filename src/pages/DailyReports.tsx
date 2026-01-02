import { useState } from 'react';
import { Plus, Search, Calendar, FileText } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { DailyReport } from '@/data/mockData';

export default function DailyReports() {
  const { dailyReports, projects, workers, addDailyReport } = useData();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({
    date: new Date().toISOString().split('T')[0],
    projectId: '',
    workPerformed: '',
    workersPresent: [] as string[],
    materialsUsed: '',
    issues: '',
    remarks: ''
  });

  const activeProjects = projects.filter(p => p.status === 'In Progress');
  const activeWorkers = workers.filter(w => w.status === 'Active');

  const filteredReports = dailyReports.filter(r => {
    const matchesSearch = r.workPerformed.toLowerCase().includes(search.toLowerCase()) ||
                          r.projectName.toLowerCase().includes(search.toLowerCase());
    const matchesProject = projectFilter === 'all' || r.projectId === projectFilter;
    return matchesSearch && matchesProject;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddReport = () => {
    const project = projects.find(p => p.id === newReport.projectId);
    const report: DailyReport = {
      id: `RPT${String(dailyReports.length + 1).padStart(3, '0')}`,
      date: newReport.date,
      projectId: newReport.projectId,
      projectName: project?.name || '',
      workPerformed: newReport.workPerformed,
      workersPresent: newReport.workersPresent,
      materialsUsed: newReport.materialsUsed.split(',').map(m => ({
        name: m.trim(),
        quantity: 0,
        unit: ''
      })).filter(m => m.name),
      issues: newReport.issues || 'None',
      remarks: newReport.remarks,
      createdBy: user?.name || 'Unknown'
    };
    addDailyReport(report);
    setIsDialogOpen(false);
    setNewReport({
      date: new Date().toISOString().split('T')[0],
      projectId: '',
      workPerformed: '',
      workersPresent: [],
      materialsUsed: '',
      issues: '',
      remarks: ''
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Daily Reports"
        description="Submit and view daily work reports"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submit Daily Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date"
                    value={newReport.date}
                    onChange={(e) => setNewReport({...newReport, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select 
                    value={newReport.projectId} 
                    onValueChange={(v) => setNewReport({...newReport, projectId: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeProjects.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Work Performed</Label>
                <Textarea 
                  placeholder="Describe the work completed today..."
                  value={newReport.workPerformed}
                  onChange={(e) => setNewReport({...newReport, workPerformed: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Workers Present</Label>
                <Select 
                  value=""
                  onValueChange={(v) => {
                    if (!newReport.workersPresent.includes(v)) {
                      setNewReport({...newReport, workersPresent: [...newReport.workersPresent, v]});
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add workers" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeWorkers.map(w => (
                      <SelectItem key={w.id} value={w.name}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newReport.workersPresent.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newReport.workersPresent.map(w => (
                      <span 
                        key={w} 
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {w}
                        <button 
                          onClick={() => setNewReport({
                            ...newReport, 
                            workersPresent: newReport.workersPresent.filter(x => x !== w)
                          })}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Materials Used (comma separated)</Label>
                <Input 
                  placeholder="e.g., Artificial Grass - 100 sq.ft, Sand - 2 tons"
                  value={newReport.materialsUsed}
                  onChange={(e) => setNewReport({...newReport, materialsUsed: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Issues / Delays</Label>
                <Textarea 
                  placeholder="Any issues or delays encountered (leave empty if none)"
                  value={newReport.issues}
                  onChange={(e) => setNewReport({...newReport, issues: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea 
                  placeholder="Additional notes or remarks..."
                  value={newReport.remarks}
                  onChange={(e) => setNewReport({...newReport, remarks: e.target.value})}
                  rows={2}
                />
              </div>

              <Button className="w-full" onClick={handleAddReport}>
                Submit Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No reports found</p>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {new Date(report.date).toLocaleDateString('en-IN', { 
                          weekday: 'long', 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{report.projectName}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    by {report.createdBy}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Work Performed</p>
                    <p className="text-sm">{report.workPerformed}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Workers Present ({report.workersPresent.length})</p>
                      <p className="text-sm">{report.workersPresent.join(', ')}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Materials Used</p>
                      <p className="text-sm">
                        {report.materialsUsed.length > 0 
                          ? report.materialsUsed.map(m => m.name).join(', ')
                          : 'None'
                        }
                      </p>
                    </div>
                  </div>

                  {report.issues && report.issues !== 'None' && (
                    <div className="p-3 bg-destructive/5 rounded-lg">
                      <p className="text-sm font-medium text-destructive mb-1">Issues</p>
                      <p className="text-sm">{report.issues}</p>
                    </div>
                  )}

                  {report.remarks && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Remarks</p>
                      <p className="text-sm text-muted-foreground italic">"{report.remarks}"</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
