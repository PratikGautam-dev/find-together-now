import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import StatsCard from '@/components/StatsCard';
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
            value="1,247"
            icon={Users}
            variant="primary"
            trend={{ value: 5, isPositive: false }}
          />
          <StatsCard
            title="Successfully Found"
            value="892"
            icon={Heart}
            variant="success"
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Community Tips"
            value="5,634"
            icon={Eye}
            variant="warning"
            trend={{ value: 23, isPositive: true }}
          />
          <StatsCard
            title="Success Rate"
            value="71.6%"
            icon={TrendingUp}
            variant="success"
            trend={{ value: 3, isPositive: true }}
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
              <div className="space-y-4">
                {[
                  {
                    type: 'found',
                    message: 'Emma Rodriguez found safe in Miami Beach',
                    time: '2 hours ago',
                    variant: 'success'
                  },
                  {
                    type: 'tip',
                    message: 'New sighting reported for Michael Chen in Brooklyn',
                    time: '4 hours ago',
                    variant: 'warning'
                  },
                  {
                    type: 'case',
                    message: 'New case submitted: David Thompson, Phoenix',
                    time: '6 hours ago',
                    variant: 'default'
                  },
                  {
                    type: 'footage',
                    message: 'Video footage uploaded for Sarah Johnson case',
                    time: '8 hours ago',
                    variant: 'default'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.variant === 'success' ? 'bg-success' :
                        activity.variant === 'warning' ? 'bg-warning' :
                        'bg-primary'
                      }`} />
                      <span className="text-sm text-foreground">{activity.message}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
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
              <div className="space-y-3">
                {[
                  { name: 'Sarah M.', tips: 23, rank: 1 },
                  { name: 'Michael K.', tips: 19, rank: 2 },
                  { name: 'Jennifer L.', tips: 15, rank: 3 },
                  { name: 'David R.', tips: 12, rank: 4 },
                  { name: 'Lisa T.', tips: 10, rank: 5 }
                ].map((contributor, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        contributor.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        contributor.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        contributor.rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {contributor.rank}
                      </div>
                      <span className="text-sm font-medium">{contributor.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-warning" />
                      <span className="text-xs text-muted-foreground">{contributor.tips}</span>
                    </div>
                  </div>
                ))}
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
                  <span className="font-semibold">47</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Major Cities</span>
                  <span className="font-semibold">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">International</span>
                  <span className="font-semibold">12</span>
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
                  <span className="font-semibold">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Videos</span>
                  <span className="font-semibold">432</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Processing</span>
                  <Badge variant="secondary">23</Badge>
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
                  <span className="font-semibold">2.3 hrs</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fastest</span>
                  <span className="font-semibold text-success">12 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Emergency</span>
                  <span className="font-semibold text-destructive">&lt; 30 min</span>
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