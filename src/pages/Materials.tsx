import { useState } from 'react';
import { Plus, Search, Package, AlertTriangle, Trash2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, getStatusVariant } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Material } from '@/data/mockData';
import { Card, CardContent } from '@/components/ui/card';

export default function Materials() {
  const { materials, addMaterial, updateMaterial, deleteMaterial } = useData();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    minStock: '',
    supplier: ''
  });

  const categories = [...new Set(materials.map(m => m.category))];
  const lowStockCount = materials.filter(m => m.quantity <= m.minStock).length;

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddMaterial = () => {
    const material: Material = {
      id: `MAT${String(materials.length + 1).padStart(3, '0')}`,
      name: newMaterial.name,
      category: newMaterial.category,
      quantity: parseFloat(newMaterial.quantity) || 0,
      unit: newMaterial.unit,
      minStock: parseFloat(newMaterial.minStock) || 0,
      supplier: newMaterial.supplier,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    addMaterial(material);
    setIsDialogOpen(false);
    setNewMaterial({ name: '', category: '', quantity: '', unit: '', minStock: '', supplier: '' });
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateMaterial(id, {
      quantity: newQuantity,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setEditingMaterial(null);
  };

  const getStockStatus = (material: Material) => {
    if (material.quantity <= material.minStock) return 'Low';
    if (material.quantity <= material.minStock * 2) return 'Medium';
    return 'Good';
  };

  const columns = [
    {
      key: 'name',
      header: 'Material Name',
      cell: (m: Material) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{m.name}</p>
            <p className="text-xs text-muted-foreground">{m.id}</p>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
    },
    {
      key: 'quantity',
      header: 'Quantity',
      cell: (m: Material) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold">{m.quantity}</span>
          <span className="text-muted-foreground">{m.unit}</span>
        </div>
      )
    },
    {
      key: 'minStock',
      header: 'Min Stock',
      cell: (m: Material) => (
        <span className="text-muted-foreground">{m.minStock} {m.unit}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (m: Material) => {
        const status = getStockStatus(m);
        return (
          <StatusBadge variant={getStatusVariant(status)}>
            {status === 'Low' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {status}
          </StatusBadge>
        );
      }
    },
    {
      key: 'supplier',
      header: 'Supplier',
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (m: Material) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setEditingMaterial(m);
            }}
          >
            Update Qty
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Are you sure you want to delete ${m.name}?`)) {
                deleteMaterial(m.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Raw Materials"
        description="Manage your inventory and stock levels"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Material</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Material Name</Label>
                <Input
                  placeholder="e.g., Artificial Grass"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  placeholder="e.g., Turf, Base Material"
                  value={newMaterial.category}
                  onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={newMaterial.quantity}
                    onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Input
                    placeholder="e.g., sq.ft, tons"
                    value={newMaterial.unit}
                    onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Minimum Stock Level</Label>
                <Input
                  type="number"
                  placeholder="50"
                  value={newMaterial.minStock}
                  onChange={(e) => setNewMaterial({ ...newMaterial, minStock: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Input
                  placeholder="e.g., ABC Turf Supplies"
                  value={newMaterial.supplier}
                  onChange={(e) => setNewMaterial({ ...newMaterial, supplier: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleAddMaterial}>
                Add Material
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <Card className="mb-6 border-warning/50 bg-warning/5">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <p className="text-sm">
              <span className="font-semibold">{lowStockCount} material(s)</span> are running low on stock
            </p>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredMaterials}
        emptyMessage="No materials found"
      />

      {/* Update Quantity Dialog */}
      <Dialog open={!!editingMaterial} onOpenChange={() => setEditingMaterial(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Quantity</DialogTitle>
          </DialogHeader>
          {editingMaterial && (
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                {editingMaterial.name}
              </p>
              <div className="space-y-2">
                <Label>New Quantity ({editingMaterial.unit})</Label>
                <Input
                  type="number"
                  defaultValue={editingMaterial.quantity}
                  id="newQuantity"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingMaterial(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    const input = document.getElementById('newQuantity') as HTMLInputElement;
                    handleUpdateQuantity(editingMaterial.id, parseFloat(input.value) || 0);
                  }}
                >
                  Update
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
