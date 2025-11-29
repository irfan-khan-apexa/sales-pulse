import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, ROLE_LABELS } from '@/config/api';
import { cn } from '@/lib/utils';

const roles: { role: UserRole; description: string }[] = [
  { role: 'RSM', description: 'View all regions & areas performance' },
  { role: 'ASM', description: 'View area-level insights & territories' },
  { role: 'TSM', description: 'View territory & DSR performance' },
  { role: 'SO', description: 'View sales team performance' },
  { role: 'DSR', description: 'View personal performance & outlets' },
];

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('RSM');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userName = name.trim() || `Demo ${selectedRole}`;
    login(selectedRole, userName);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <TrendingUp className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">FMCG Analytics</h1>
              <p className="text-sm text-sidebar-muted">Sales Hierarchy Dashboard</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-sidebar-foreground leading-tight">
                Data-Driven Sales<br />Performance Insights
              </h2>
              <p className="mt-4 text-sidebar-muted max-w-md">
                Monitor your sales hierarchy from region to DSR level. Track KPIs, 
                identify opportunities, and make informed decisions.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Real-time KPIs', value: 'Live tracking' },
                { label: 'Hierarchical Views', value: 'Region → DSR' },
                { label: 'Smart Alerts', value: 'Proactive insights' },
                { label: 'SKU Analytics', value: 'Penetration maps' },
              ].map((item, i) => (
                <div key={i} className="bg-sidebar-accent rounded-lg p-4">
                  <p className="text-sidebar-muted text-sm">{item.label}</p>
                  <p className="text-sidebar-foreground font-medium mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <p className="text-sidebar-muted text-sm">
          © 2024 FMCG Analytics Platform. All rights reserved.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-foreground">FMCG Analytics</h1>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Select your role to access the dashboard
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Your Name (optional)</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11"
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Select Your Role</Label>
              <div className="space-y-2">
                {roles.map(({ role, description }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      'w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left',
                      selectedRole === role
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        selectedRole === role
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      )}>
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{role}</p>
                        <p className="text-xs text-muted-foreground">{ROLE_LABELS[role]}</p>
                      </div>
                    </div>
                    <div className={cn(
                      'h-5 w-5 rounded-full border-2 flex items-center justify-center',
                      selectedRole === role
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    )}>
                      {selectedRole === role && (
                        <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Role Description */}
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{selectedRole}: </span>
                {roles.find(r => r.role === selectedRole)?.description}
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-11 gap-2" size="lg">
              Continue to Dashboard
              <ChevronRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            This is a demo application. Select any role to explore the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
