import { useState } from 'react';
import { User, Bell, Shield, Database, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_LABELS } from '@/config/api';
import { API_CONFIG } from '@/config/api';
import { toast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [useMocks, setUseMocks] = useState(API_CONFIG.USE_MOCKS);
  const [useMetabaseEmbed, setUseMetabaseEmbed] = useState(API_CONFIG.USE_METABASE_EMBED);

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and application preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Database className="h-4 w-4" />
            Data Source
          </TabsTrigger>
          <TabsTrigger value="display" className="gap-2">
            <Palette className="h-4 w-4" />
            Display
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your account details and role assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{user?.name || 'User'}</h3>
                  <p className="text-muted-foreground">{ROLE_LABELS[user?.role || 'RSM']}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ID: {user?.id || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" defaultValue={user?.name || ''} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your.email@company.com" />
                </div>
                <div className="grid gap-2">
                  <Label>Assigned Region</Label>
                  <Input value={user?.regionId || 'All Regions'} disabled />
                  <p className="text-xs text-muted-foreground">
                    Region assignment is managed by your administrator
                  </p>
                </div>
              </div>

              <Button onClick={handleSave}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive alerts and updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: 'critical', label: 'Critical Alerts', description: 'Receive immediate notifications for critical issues', defaultChecked: true },
                { id: 'performance', label: 'Performance Updates', description: 'Daily summary of KPI changes', defaultChecked: true },
                { id: 'target', label: 'Target Achievements', description: 'Notifications when DSRs hit targets', defaultChecked: true },
                { id: 'lapsed', label: 'Lapsed Outlet Alerts', description: 'Alerts for outlets with no recent activity', defaultChecked: false },
                { id: 'weekly', label: 'Weekly Digest', description: 'Weekly summary report via email', defaultChecked: true },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor={item.id}>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch id={item.id} defaultChecked={item.defaultChecked} />
                </div>
              ))}
              
              <Button onClick={handleSave}>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API/Data Source Tab */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Data Source Configuration</CardTitle>
              <CardDescription>
                Configure API endpoints and data source settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <h4 className="font-medium text-foreground mb-2">Current Configuration</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Mode:</span>
                    <span className="font-medium text-foreground">
                      {useMocks ? 'Mock Data' : 'Live API'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base URL:</span>
                    <span className="font-mono text-xs text-foreground">{API_CONFIG.BASE_URL}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cache TTL:</span>
                    <span className="text-foreground">{API_CONFIG.CACHE_TTL / 1000 / 60} minutes</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Use Mock Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to use sample data instead of live API
                    </p>
                  </div>
                  <Switch 
                    checked={useMocks} 
                    onCheckedChange={setUseMocks}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Metabase Embed</Label>
                    <p className="text-sm text-muted-foreground">
                      Use Metabase embedded dashboards (requires configuration)
                    </p>
                  </div>
                  <Switch 
                    checked={useMetabaseEmbed} 
                    onCheckedChange={setUseMetabaseEmbed}
                  />
                </div>

                {useMetabaseEmbed && (
                  <div className="grid gap-2">
                    <Label htmlFor="metabase-url">Metabase Embed URL</Label>
                    <Input 
                      id="metabase-url" 
                      placeholder="https://your-metabase.com/embed/dashboard/..."
                      defaultValue={API_CONFIG.METABASE_EMBED_URL}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter your signed Metabase embed URL. Contact your admin for the secure URL.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex gap-2">
                  <Shield className="h-5 w-5 text-warning shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Production Note</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      In production, use secure OAuth authentication and server-side signed Metabase embeds. 
                      Never use public Metabase links for internal data.
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSave}>Save Configuration</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compact Tables</Label>
                    <p className="text-sm text-muted-foreground">
                      Use condensed row spacing in data tables
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Forecasts</Label>
                    <p className="text-sm text-muted-foreground">
                      Display forecast bands on charts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Animation Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable smooth transitions and animations
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="grid gap-2">
                  <Label>Default Date Range</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="last7">Last 7 days</option>
                    <option value="last30" selected>Last 30 days</option>
                    <option value="last90">Last 90 days</option>
                  </select>
                </div>
              </div>

              <Button onClick={handleSave}>Save Display Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
