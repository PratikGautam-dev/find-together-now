import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, User, MapPin, Calendar, Phone, FileText } from 'lucide-react';

const SubmitCase = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    lastSeenLocation: '',
    lastSeenDate: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    description: '',
    distinguishingFeatures: '',
    photo: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submitting case:', formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, photo: file }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Submit a Missing Person Case
            </h1>
            <p className="text-lg text-muted-foreground">
              Help us help you find your loved one. Every detail matters.
            </p>
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Missing Person Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="photo">Recent Photo *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('photo')?.click()}
                    >
                      Choose File
                    </Button>
                    {formData.photo && (
                      <p className="text-sm text-primary mt-2">
                        Selected: {formData.photo.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Age"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastSeenDate">Last Seen Date *</Label>
                    <Input
                      id="lastSeenDate"
                      type="date"
                      value={formData.lastSeenDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastSeenDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastSeenLocation">Last Seen Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="lastSeenLocation"
                      value={formData.lastSeenLocation}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastSeenLocation: e.target.value }))}
                      placeholder="Enter specific address or area"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        value={formData.contactName}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                        placeholder="Your name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Phone Number *</Label>
                      <Input
                        id="contactPhone"
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email Address *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Additional Details
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description of Circumstances</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the circumstances of the disappearance, what they were wearing, where they were going, etc."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distinguishingFeatures">Distinguishing Features</Label>
                    <Textarea
                      id="distinguishingFeatures"
                      value={formData.distinguishingFeatures}
                      onChange={(e) => setFormData(prev => ({ ...prev, distinguishingFeatures: e.target.value }))}
                      placeholder="Scars, birthmarks, tattoos, medical conditions, etc."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                  <Button type="button" variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                  <Button type="submit" variant="hero" className="flex-1">
                    Submit Case
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Important:</strong> All submitted cases are reviewed by our team before being published. 
              You will receive a confirmation email once your case is approved. For immediate emergencies, 
              please contact local law enforcement at 911.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SubmitCase;