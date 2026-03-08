import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Package } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScheduleItem } from '@/data/mockData';

export default function Schedule() {
  const { schedule, projects, workers, addScheduleItem, updateScheduleItem, updateWorker } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    projectId: '',
    work: '',
    workers: [] as string[],
    materials: '',
    deliveryMaterials: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getCurrentWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getCurrentWeekDates();

  const getScheduleForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return schedule.filter(s => s.startDate <= dateStr && s.endDate >= dateStr);
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const handleAddSchedule = () => {
    const project = projects.find(p => p.id === newSchedule.projectId);
    const item: ScheduleItem = {
      id: `SCH${String(schedule.length + 1).padStart(3, '0')}`,
      startDate: newSchedule.startDate,
      endDate: newSchedule.endDate,
      projectId: newSchedule.projectId,
      projectName: project?.name || '',
      work: newSchedule.work,
      workers: newSchedule.workers,
      materials: newSchedule.materials.split(',').map(m => ({
        name: m.trim(),
        quantity: 0,
        unit: ''
      })).filter(m => m.name),
      deliveryMaterials: newSchedule.deliveryMaterials.split(',').map(m => ({
        name: m.trim(),
        quantity: 0,
        unit: ''
      })).filter(m => m.name),
      status: 'Scheduled'
    };
    addScheduleItem(item);

    // Sync workers with the project
    newSchedule.workers.forEach(workerName => {
      const worker = workers.find(w => w.name === workerName);
      if (worker) {
        updateWorker(worker.id, { projectId: newSchedule.projectId });
      }
    });

    setIsDialogOpen(false);
    setNewSchedule({ projectId: '', work: '', workers: [], materials: '', deliveryMaterials: '', startDate: formatDate(new Date()), endDate: formatDate(new Date()) });
  };

  const handleStatusChange = (id: string, status: string) => {
    updateScheduleItem(id, { status: status as ScheduleItem['status'] });
  };

  const activeWorkers = workers.filter(w => w.status === 'Active');
  const activeProjects = projects.filter(p => p.status === 'In Progress' || p.status === 'Planning');

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Work Schedule"
        description="Plan and track daily work assignments"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Work</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={newSchedule.startDate}
                    onChange={(e) => setNewSchedule({ ...newSchedule, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={newSchedule.endDate}
                    onChange={(e) => setNewSchedule({ ...newSchedule, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Select
                  value={newSchedule.projectId}
                  onValueChange={(v) => setNewSchedule({ ...newSchedule, projectId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeProjects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Work Description</Label>
                <Textarea
                  placeholder="Describe the work to be done..."
                  value={newSchedule.work}
                  onChange={(e) => setNewSchedule({ ...newSchedule, work: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Assign Workers</Label>
                <Select
                  value=""
                  onValueChange={(v) => {
                    if (!newSchedule.workers.includes(v)) {
                      setNewSchedule({ ...newSchedule, workers: [...newSchedule.workers, v] });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add workers" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeWorkers.map(w => (
                      <SelectItem key={w.id} value={w.name}>{w.name} ({w.role})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {newSchedule.workers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newSchedule.workers.map(w => (
                      <span
                        key={w}
                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {w}
                        <button
                          onClick={() => setNewSchedule({
                            ...newSchedule,
                            workers: newSchedule.workers.filter(x => x !== w)
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
                <Label>Materials Required</Label>
                <Input
                  placeholder="e.g., Artificial Grass, Silica Sand"
                  value={newSchedule.materials}
                  onChange={(e) => setNewSchedule({ ...newSchedule, materials: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Raw Materials Delivery</Label>
                <Input
                  placeholder="e.g., Cement Bags, Gravel (comma separated)"
                  value={newSchedule.deliveryMaterials}
                  onChange={(e) => setNewSchedule({ ...newSchedule, deliveryMaterials: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleAddSchedule}>
                Schedule Work
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Week Navigation */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigateWeek(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <p className="font-semibold">
                {weekDates[0].toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
              <p className="text-sm text-muted-foreground">
                Week of {weekDates[0].toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {weekDates[6].toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigateWeek(1)}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDates.map((date) => {
          const daySchedule = getScheduleForDate(date);
          const isToday = formatDate(date) === formatDate(new Date());

          return (
            <Card
              key={formatDate(date)}
              className={`${isToday ? 'ring-2 ring-accent' : ''}`}
            >
              <CardHeader className="py-3 px-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {date.toLocaleDateString('en-IN', { weekday: 'short' })}
                  </p>
                  <p className={`text-lg font-bold ${isToday ? 'text-accent' : ''}`}>
                    {date.getDate()}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="px-2 pb-3">
                {daySchedule.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No work scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {daySchedule.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 rounded-lg bg-muted/50 text-xs space-y-1"
                      >
                        <p className="font-medium truncate">{item.work}</p>
                        <p className="text-muted-foreground truncate">{item.projectName}</p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="w-3 h-3" />
                          <span>{item.workers.length}</span>
                        </div>
                        {item.deliveryMaterials && item.deliveryMaterials.length > 0 && (
                          <div className="flex items-center gap-2 text-primary font-medium">
                            <Package className="w-3 h-3" />
                            <span>Delivery: {item.deliveryMaterials.length} items</span>
                          </div>
                        )}
                        <Select
                          value={item.status}
                          onValueChange={(v) => handleStatusChange(item.id, v)}
                        >
                          <SelectTrigger className="h-6 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Delayed">Delayed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
