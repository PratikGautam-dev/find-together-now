import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MissingPersonCard from '@/components/MissingPersonCard';
import StatsCard from '@/components/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Users, Eye, Heart, MapPin, Plus, AlertTriangle } from 'lucide-react';

// Mock data for missing persons
const mockMissingPersons = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 24,
    lastSeenLocation: 'Downtown Seattle, WA',
    lastSeenDate: '2024-01-15',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b765?w=400&h=400&fit=crop&crop=face',
    gender: 'female' as const,
    status: 'active' as const,
    description: 'Last seen wearing blue jeans and a red jacket. Has a small scar on left cheek.'
  },
  {
    id: '2',
    name: 'Michael Chen',
    age: 16,
    lastSeenLocation: 'Central Park, New York, NY',
    lastSeenDate: '2024-01-12',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    gender: 'male' as const,
    status: 'active' as const,
    description: 'Missing teenager, last seen with school backpack. Wearing glasses.'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    age: 8,
    lastSeenLocation: 'Miami Beach, FL',
    lastSeenDate: '2024-01-10',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
    gender: 'female' as const,
    status: 'found' as const,
    description: 'Found safe! Thank you to everyone who helped in the search.'
  },
  {
    id: '4',
    name: 'David Thompson',
    age: 45,
    lastSeenLocation: 'Phoenix, AZ',
    lastSeenDate: '2024-01-08',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    gender: 'male' as const,
    status: 'active' as const,
    description: 'Missing adult with medical condition. Last seen driving blue Honda Civic.'
  }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPersons = mockMissingPersons.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.lastSeenLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === 'all' || person.gender === genderFilter;
    const matchesStatus = statusFilter === 'all' || person.status === statusFilter;
    
    return matchesSearch && matchesGender && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Together We Bring Them Home
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            A community-driven platform connecting families, volunteers, and law enforcement to find missing persons through advanced technology and collective effort.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="hope" className="text-lg" asChild>
              <a href="/submit-case">
                <Plus className="w-5 h-5 mr-2" />
                Submit a Case
              </a>
            </Button>
            <Button size="xl" variant="outline" className="text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="/report-sighting">
                <Eye className="w-5 h-5 mr-2" />
                Report a Sighting
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              title="Active Cases"
              value="1,247"
              icon={Users}
              variant="warning"
              trend={{ value: 12, isPositive: false }}
            />
            <StatsCard
              title="People Found"
              value="892"
              icon={Heart}
              variant="success"
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              title="Community Tips"
              value="5,634"
              icon={Eye}
              variant="primary"
              trend={{ value: 15, isPositive: true }}
            />
            <StatsCard
              title="Success Rate"
              value="71.6%"
              icon={AlertTriangle}
              variant="success"
              trend={{ value: 3, isPositive: true }}
            />
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="found">Found</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Showing {filteredPersons.length} of {mockMissingPersons.length} cases
            </span>
            <Badge variant="secondary" className="ml-2">
              {mockMissingPersons.filter(p => p.status === 'active').length} Active
            </Badge>
          </div>
        </div>
      </section>

      {/* Missing Persons Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPersons.map((person) => (
              <MissingPersonCard key={person.id} {...person} />
            ))}
          </div>

          {filteredPersons.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No cases found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-hope text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Every Second Counts
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join our community of helpers. Whether you submit a case, report a sighting, or share on social media - every action brings families closer to reunion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
              <MapPin className="w-5 h-5 mr-2" />
              View Heatmap
            </Button>
            <Button size="lg" variant="hero">
              <Heart className="w-5 h-5 mr-2" />
              Get Involved
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
