import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StatsCard from '@/components/StatsCard';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Eye, 
  Heart, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  MapPin,
  Star,
  Trophy,
  Camera
} from 'lucide-react';

const Dashboard = () => {
  type Case = { id: string; name: string; status: string; created_at: string };
  const [cases, setCases] = useState<Case[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setCases([]); setLoadingCases(false); return; }
      const { data, error } = await supabase
        .from('cases')
        .select('id,name,status,created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!mounted) return;
      if (error) { setCases([]); }
      else { setCases(data as Case[]); }
      setLoadingCases(false);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Community Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time statistics and community impact metrics
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Cases"
            value="—"
            icon={Users}
            variant="primary"
          />
          <StatsCard
            title="Successfully Found"
            value="—"
            icon={Heart}
            variant="success"
          />
          <StatsCard
            title="Community Tips"
            value="—"
            icon={Eye}
            variant="warning"
          />
          <StatsCard
            title="Success Rate"
            value="—"
            icon={TrendingUp}
            variant="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingCases ? (
                <div className="p-3 rounded-lg border border-border text-center text-muted-foreground">
                  Loading your cases...
                </div>
              ) : cases.length === 0 ? (
                <div className="p-3 rounded-lg border border-border text-center text-muted-foreground">
                  No cases yet. Submit your first case to see it here.
                </div>
              ) : (
                <div className="space-y-3">
                  {cases.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">ID: {c.id}</div>
                      </div>
                      <Badge variant={c.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                        {c.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Top Contributors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-lg border border-border text-center text-muted-foreground">
                No contributors yet.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="w-5 h-5" />
                Geographic Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active States</span>
                  <span className="font-semibold">—</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Major Cities</span>
                  <span className="font-semibold">—</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">International</span>
                  <span className="font-semibold">—</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Camera className="w-5 h-5" />
                Media Uploads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Photos</span>
                  <span className="font-semibold">—</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Videos</span>
                  <span className="font-semibold">—</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">AI Matches</span>
                  <Badge variant="secondary">—</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="w-5 h-5" />
                Response Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Avg. Response</span>
                  <span className="font-semibold">—</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fastest</span>
                  <span className="font-semibold text-success">—</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Emergency</span>
                  <span className="font-semibold text-destructive">—</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-hope text-secondary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Make a Difference Today</h2>
            <p className="text-lg mb-6 opacity-90">
              Every action counts. Join our community of helpers and bring families together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                Report a Sighting
              </Button>
              <Button variant="hero">
                Upload Footage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;