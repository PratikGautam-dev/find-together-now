import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Video, MapPin, Calendar, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UploadFootage = () => {
  const [formData, setFormData] = useState({
    caseId: '',
    location: '',
    dateTime: '',
    comments: '',
    video: null as File | null
  });
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.video || !formData.caseId) {
      toast({
        title: "Error",
        description: "Please select a video file and case ID",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Upload video to Supabase Storage
      const fileExt = formData.video.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `footage/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('footage')
        .upload(filePath, formData.video);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('footage')
        .getPublicUrl(filePath);

      toast({
        title: "Upload successful",
        description: "Video uploaded successfully. Starting AI processing...",
      });

      setUploading(false);
      setProcessing(true);

      // Call the processFootage Edge Function
      const { data, error } = await supabase.functions.invoke('processFootage', {
        body: {
          video_url: urlData.publicUrl,
          case_id: formData.caseId
        }
      });

      if (error) {
        throw error;
      }

      setProcessing(false);

      toast({
        title: "Processing complete",
        description: data.message,
      });

      // Reset form
      setFormData({
        caseId: '',
        location: '',
        dateTime: '',
        comments: '',
        video: null
      });

    } catch (error) {
      console.error('Error uploading footage:', error);
      toast({
        title: "Error",
        description: "Failed to upload footage. Please try again.",
        variant: "destructive"
      });
      setUploading(false);
      setProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, video: file }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Upload Footage
            </h1>
            <p className="text-lg text-muted-foreground">
              Help us find missing persons by uploading surveillance footage or videos
            </p>
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Video Upload */}
                <div className="space-y-2">
                  <Label htmlFor="video">Video File *</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload MP4, AVI, or MOV files (max 100MB)
                    </p>
                    <input
                      type="file"
                      id="video"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('video')?.click()}
                    >
                      Choose Video File
                    </Button>
                    {formData.video && (
                      <p className="text-sm text-primary mt-2">
                        Selected: {formData.video.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Case Selection */}
                <div className="space-y-2">
                  <Label htmlFor="caseId">Related Case ID *</Label>
                  <Select value={formData.caseId} onValueChange={(value) => setFormData(prev => ({ ...prev, caseId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a case" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="case-001">John Doe - Case #001</SelectItem>
                      <SelectItem value="case-002">Sarah Wilson - Case #002</SelectItem>
                      <SelectItem value="case-003">Michael Chen - Case #003</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Where was this recorded?"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateTime">Date & Time</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="dateTime"
                        type="datetime-local"
                        value={formData.dateTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  <Label htmlFor="comments">Additional Comments</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
                    <Textarea
                      id="comments"
                      value={formData.comments}
                      onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                      placeholder="Any additional details about this footage..."
                      rows={3}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                  <Button type="button" variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                  <Button 
                    type="submit" 
                    variant="hero" 
                    className="flex-1"
                    disabled={uploading || processing}
                  >
                    {uploading ? 'Uploading...' : processing ? 'Processing...' : 'Upload & Process'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>AI Processing:</strong> Once uploaded, our AI system will automatically analyze the footage for facial recognition and matching with missing persons cases. You'll be notified of any potential matches.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UploadFootage;