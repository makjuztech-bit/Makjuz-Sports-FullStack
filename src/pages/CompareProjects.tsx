import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ArrowLeftRight, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getStatusVariant, StatusBadge } from '@/components/ui/status-badge';

export default function CompareProjects() {
    const { projects } = useData();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id)
                ? prev.filter(pId => pId !== id)
                : [...prev, id]
        );
    };

    const selectedProjects = projects.filter(p => selectedIds.includes(p.id));

    // Comparison fields configuration
    const fields = [
        { label: 'Status', key: 'status', render: (p: any) => <StatusBadge variant={getStatusVariant(p.status)}>{p.status}</StatusBadge> },
        { label: 'Turf Type', key: 'turfType' },
        { label: 'Location', key: 'location' },
        { label: 'Start Date', key: 'startDate', render: (p: any) => new Date(p.startDate).toLocaleDateString() },
        { label: 'Completion', key: 'expectedCompletion', render: (p: any) => new Date(p.expectedCompletion).toLocaleDateString() },
        { label: 'Progress', key: 'progress', render: (p: any) => <Badge variant={p.progress === 100 ? "default" : "secondary"}>{p.progress}%</Badge> },
        { label: 'Budget', key: 'budget', render: (p: any) => <span className="font-semibold">₹{p.budget.toLocaleString()}</span> },
        { label: 'Spent', key: 'spent', render: (p: any) => <span className={p.spent > p.budget ? "text-destructive font-semibold" : "text-success font-semibold"}>₹{p.spent.toLocaleString()}</span> },
        { label: 'Balance', key: 'balance', render: (p: any) => <span>₹{(p.budget - p.spent).toLocaleString()}</span> },
    ];

    return (
        <div className="animate-fade-in space-y-6">
            <PageHeader
                title="Compare Projects"
                description="Select multiple projects to compare their details side-by-side"
            />

            {/* Selection Area */}
            <Card>
                <CardContent className="py-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <ArrowLeftRight className="w-4 h-4" />
                        Select Projects ({selectedIds.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {projects.map(project => (
                            <div
                                key={project.id}
                                className={`
                  flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors
                  ${selectedIds.includes(project.id) ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}
                `}
                                onClick={() => toggleSelection(project.id)}
                            >
                                <Checkbox
                                    checked={selectedIds.includes(project.id)}
                                    onCheckedChange={() => toggleSelection(project.id)}
                                />
                                <div className="min-w-0">
                                    <p className="font-medium text-sm truncate">{project.name}</p>
                                    <p className="text-xs text-muted-foreground">{project.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedIds.length > 0 && (
                        <div className="mt-4 flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => setSelectedIds([])} className="gap-2">
                                <X className="w-3 h-3" /> Clear Selection
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Comparison Table */}
            {selectedIds.length > 0 ? (
                <Card className="overflow-hidden">
                    <ScrollArea className="w-full">
                        <div className="min-w-[800px]">
                            <div className="grid border-b bg-muted/30" style={{ gridTemplateColumns: `200px repeat(${selectedIds.length}, minmax(200px, 1fr))` }}>
                                <div className="p-4 font-bold text-muted-foreground flex items-center">
                                    Project Details
                                </div>
                                {selectedProjects.map(project => (
                                    <div key={project.id} className="p-4 font-bold border-l relative group">
                                        <div className="flex justify-between items-start gap-2">
                                            <span>{project.name}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => toggleSelection(project.id)}
                                            >
                                                <X className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground font-normal mt-1">{project.id}</p>
                                    </div>
                                ))}
                            </div>

                            {fields.map((field, index) => (
                                <div
                                    key={field.key}
                                    className={`grid ${index !== fields.length - 1 ? 'border-b' : ''} hover:bg-muted/20 transition-colors`}
                                    style={{ gridTemplateColumns: `200px repeat(${selectedIds.length}, minmax(200px, 1fr))` }}
                                >
                                    <div className="p-4 text-sm font-medium text-muted-foreground bg-muted/10">
                                        {field.label}
                                    </div>
                                    {selectedProjects.map(project => (
                                        <div key={`${project.id}-${field.key}`} className="p-4 text-sm border-l flex items-center">
                                            {field.render ? field.render(project) : (project as any)[field.key]}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </Card>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/10">
                    <ArrowLeftRight className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <h3 className="text-lg font-semibold text-muted-foreground">No projects selected</h3>
                    <p className="text-sm text-muted-foreground/80">Select at least one project above to view details</p>
                </div>
            )}
        </div>
    );
}
