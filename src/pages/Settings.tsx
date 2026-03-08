import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Building2, User, Bell, Shield, Palette } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [companyName, setCompanyName] = useState('Arena Construction Co.');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    daily: true
  });

  useEffect(() => {
    const savedName = localStorage.getItem('companyName');
    const savedNotifications = localStorage.getItem('notifications');
    if (savedName) setCompanyName(savedName);
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  const handleSave = () => {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences"
      />

      <div className="grid gap-6 max-w-2xl">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <CardTitle>Company Information</CardTitle>
            </div>
            <CardDescription>
              Update your company details and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-primary-foreground" />
                </div>
                <Button variant="outline" size="sm">
                  Change Logo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-muted-foreground" />
              <CardTitle>User Profile</CardTitle>
            </div>
            <CardDescription>
              Your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={user?.name || ''} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={user?.role || ''} readOnly className="bg-muted" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} readOnly className="bg-muted" />
            </div>
            <div className="pt-2">
              <Button variant="outline">Change Password</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Browser push notifications</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Summary</p>
                <p className="text-sm text-muted-foreground">Receive daily progress summary</p>
              </div>
              <Switch
                checked={notifications.daily}
                onCheckedChange={(checked) => setNotifications({ ...notifications, daily: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Demo Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-muted-foreground" />
              <CardTitle>Demo Settings</CardTitle>
            </div>
            <CardDescription>
              This is a demo application with mock data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Demo Credentials:</strong>
              </p>
              <ul className="text-sm space-y-1">
                <li>Admin: admin / admin123</li>
                <li>Manager: manager / manager123</li>
                <li>Supervisor: supervisor / super123</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
