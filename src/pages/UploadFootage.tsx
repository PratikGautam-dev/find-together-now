import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Video, MapPin, Calendar, FileText, Brain, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import { faceDetectionService } from '@/services/faceDetection';

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
  const [progress, setProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'uploading' | 'processing' | 'completed' | 'failed'>('idle');
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const cid = searchParams.get('caseId');
    if (cid) {
      setFormData(prev => ({ ...prev, caseId: cid }));
    }
  }, [searchParams]);

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
    setProcessingStatus('uploading');
    setProgress(5);

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
        description: "Video uploaded successfully. Starting real AI processing...",
      });

      setUploading(false);
      setProcessing(true);
      setProcessingStatus('processing');
      setProgress(20);

      // Initialize AI models
      console.log('Initializing real AI models...');
      await faceDetectionService.initialize();
      setProgress(30);

      // Extract frames from video using real browser-based processing
      console.log('Extracting frames from video...');
      const frames = await faceDetectionService.extractVideoFrames(formData.video);
      setProgress(50);

      // Get existing face embeddings for comparison
      const { data: embeddingsData } = await supabase
        .from('face_embeddings')
        .select('embedding')
        .eq('case_id', formData.caseId);

      const existingEmbeddings = embeddingsData || [];
      setProgress(60);

      let matchesFound = 0;
      const similarityThreshold = 0.7;

      // Process each frame with real AI face detection
      console.log(`Processing ${frames.length} frames with real AI models...`);
      
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        
        try {
          // Real face detection using Hugging Face models
          const { faces } = await faceDetectionService.detectFaces(frame.imageUrl);
          
          console.log(`Frame ${i + 1}: Found ${faces.length} faces`);

          // Compare with existing embeddings
          for (const face of faces) {
            for (const existing of existingEmbeddings) {
              const similarity = faceDetectionService.calculateSimilarity(
                face.embedding, 
                existing.embedding as number[]
              );

              if (similarity >= similarityThreshold) {
                console.log(`REAL AI MATCH FOUND! Similarity: ${(similarity * 100).toFixed(1)}%`);

                // Create match record with real AI results
                const { error: matchError } = await supabase
                  .from('matches')
                  .insert({
                    case_id: formData.caseId,
                    frame_timestamp: frame.timestamp,
                    confidence: similarity,
                    thumbnail_url: frame.imageUrl, // Using frame data URL as thumbnail
                    frame_url: frame.imageUrl,
                    processed_at: new Date().toISOString(),
                    status: 'pending',
                    processing_status: 'completed'
                  });

                if (!matchError) {
                  matchesFound++;
                }
              }
            }
          }
        } catch (frameError) {
          console.error(`Error processing frame ${i + 1}:`, frameError);
        }

        // Update progress
        const frameProgress = 60 + (i / frames.length) * 35;
        setProgress(Math.round(frameProgress));
      }

      setProcessing(false);
      setProcessingStatus('completed');
      setProgress(100);

      toast({
        title: "Real AI Processing Complete!",
        description: `Found ${matchesFound} potential matches using real face detection models. Results saved to database.`,
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
      console.error('Error in real AI processing:', error);
      toast({
        title: "Error",
        description: "Failed to process footage with real AI. Please try again.",
        variant: "destructive"
      });
      setUploading(false);
      setProcessing(false);
      setProcessingStatus('failed');
      setProgress(0);
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
                  <Input
                    id="caseId"
                    value={formData.caseId}
                    onChange={(e) => setFormData(prev => ({ ...prev, caseId: e.target.value }))}
                    placeholder="Enter related case ID"
                  />
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
                    {uploading ? (
                      <>
                        <Upload className="w-4 h-4 mr-2 animate-pulse" />
                        Uploading...
                      </>
                    ) : processing ? (
                      <>
                        <Brain className="w-4 h-4 mr-2 animate-pulse" />
                        Processing with AI...
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Upload & Process
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Enhanced Processing Status */}
          {processingStatus !== 'idle' && (
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Face-Matching Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {processingStatus === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : processingStatus === 'failed' ? (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <Brain className="w-4 h-4 animate-pulse text-blue-500" />
                    )}
                    <span className="capitalize">
                      {processingStatus === 'uploading' ? 'Uploading video...' :
                       processingStatus === 'processing' ? 'Running AI analysis...' :
                       processingStatus === 'completed' ? 'Analysis complete' :
                       processingStatus === 'failed' ? 'Processing failed' : 'Ready'}
                    </span>
                  </div>
                  
                  {processingStatus === 'processing' && (
                    <div className="text-xs space-y-1">
                      <div>• Loading real AI models (HuggingFace Transformers)</div>
                      <div>• Extracting video frames in browser</div>
                      <div>• Detecting faces with YOLOv8 face detection</div>
                      <div>• Computing embeddings with CLIP vision model</div>
                      <div>• Comparing with existing case embeddings</div>
                      <div>• Saving results to database</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Real Browser-Based AI Pipeline:</strong> Our system uses HuggingFace Transformers with YOLOv8 for face detection and CLIP for embedding generation. Processing happens directly in your browser using WebGPU acceleration for privacy and speed. All matches are compared against existing case embeddings with high accuracy.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UploadFootage;