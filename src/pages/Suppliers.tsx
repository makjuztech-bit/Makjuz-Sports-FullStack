import { useState } from 'react';
import { Search, Star, Phone, Mail, Plus, MapPin, Clock, Edit } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Supplier } from '@/data/mockData';

export default function Suppliers() {
  const { suppliers, addSupplier, updateSupplier } = useData();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    email: '',
    yearsInTouch: '',
    experience: '',
    location: '',
    rating: '0'
  });

  const handleOpenDialog = (supplier?: Supplier) => {
    if (supplier) {
      setEditingSupplier(supplier);
      setNewSupplier({
        name: supplier.name,
        contact: supplier.contact,
        email: supplier.email,
        yearsInTouch: supplier.yearsInTouch.toString(),
        experience: supplier.experience,
        location: supplier.location,
        rating: supplier.rating.toString()
      });
    } else {
      setEditingSupplier(null);
      setNewSupplier({ name: '', contact: '', email: '', yearsInTouch: '', experience: '', location: '', rating: '0' });
    }
    setIsDialogOpen(true);
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.materials.some(m => m.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSaveSupplier = () => {
    const supplierData = {
      name: newSupplier.name,
      contact: newSupplier.contact,
      email: newSupplier.email,
      yearsInTouch: parseInt(newSupplier.yearsInTouch) || 0,
      experience: newSupplier.experience,
      location: newSupplier.location,
      rating: parseFloat(newSupplier.rating) || 0,
    };

    if (editingSupplier) {
      updateSupplier(editingSupplier.id, supplierData);
      toast({ title: "Supplier updated", description: `${newSupplier.name} has been updated.` });
    } else {
      const supplier: Supplier = {
        id: `SUP${String(suppliers.length + 1).padStart(3, '0')}`,
        ...supplierData,
        materials: [],
        amountPaid: 0,
        notes: '',
      };
      addSupplier(supplier);
      toast({ title: "Supplier added", description: `${newSupplier.name} has been added.` });
    }
    setIsDialogOpen(false);
    setNewSupplier({ name: '', contact: '', email: '', yearsInTouch: '', experience: '', location: '', rating: '0' });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Suppliers"
        description="Manage your material suppliers and vendors"
      >
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </PageHeader>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Supplier Name</Label>
              <Input
                placeholder="e.g., ABC Turf Supplies"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Number</Label>
              <Input
                placeholder="e.g., 9876543210"
                value={newSupplier.contact}
                onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="e.g., contact@supplier.com"
                value={newSupplier.email}
                onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Experience</Label>
                <Input
                  placeholder="e.g., 10 Years"
                  value={newSupplier.experience}
                  onChange={(e) => setNewSupplier({ ...newSupplier, experience: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Years in Touch</Label>
                <Input
                  type="number"
                  placeholder="e.g., 5"
                  value={newSupplier.yearsInTouch}
                  onChange={(e) => setNewSupplier({ ...newSupplier, yearsInTouch: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  placeholder="e.g., Chennai, TN"
                  value={newSupplier.location}
                  onChange={(e) => setNewSupplier({ ...newSupplier, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Rating (0-5)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.5"
                  value={newSupplier.rating}
                  onChange={(e) => setNewSupplier({ ...newSupplier, rating: e.target.value })}
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleSaveSupplier}>
              {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search suppliers or materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Supplier Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{supplier.id}</p>
                </div>
                <div className="flex items-center gap-1 bg-warning/10 text-warning px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-sm font-medium">{supplier.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{supplier.contact}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{supplier.email}</span>
                </div>
                {supplier.location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{supplier.location}</span>
                  </div>
                )}
                {(supplier.experience || supplier.yearsInTouch) && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {supplier.experience ? `${supplier.experience} Exp.` : ''}
                      {supplier.experience && supplier.yearsInTouch ? ' • ' : ''}
                      {supplier.yearsInTouch ? `${supplier.yearsInTouch} Years with us` : ''}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Materials Supplied</p>
                <div className="flex flex-wrap gap-1">
                  {supplier.materials.map((material) => (
                    <Badge key={material} variant="secondary" className="text-xs">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-b">
                <span className="text-sm text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-primary">₹{supplier.amountPaid?.toLocaleString('en-IN') || 0}</span>
              </div>

              {supplier.notes && (
                <p className="text-sm text-muted-foreground italic">
                  "{supplier.notes}"
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => toast({ title: "History", description: `Viewing history for ${supplier.name}...` })}
                >
                  View History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleOpenDialog(supplier)}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No suppliers found</p>
        </div>
      )}
    </div>
  );
}
