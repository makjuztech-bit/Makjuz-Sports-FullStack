import { useState } from 'react';
import { Search, Star, Phone, Mail, Plus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Suppliers() {
  const { suppliers } = useData();
  const [search, setSearch] = useState('');

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.materials.some(m => m.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Suppliers"
        description="Manage your material suppliers and vendors"
      >
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </PageHeader>

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

              {supplier.notes && (
                <p className="text-sm text-muted-foreground italic">
                  "{supplier.notes}"
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View History
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
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
