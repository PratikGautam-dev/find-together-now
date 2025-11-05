import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Video, Play, Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface FootageUpload {
  id: string;
  case_id: string;
  user_id: string;
  video_url: string;
  status: string;
  uploaded_at: string;
  processed_at: string | null;
  error_message: string | null;
}

const AdminFootage = () => {
  const [footage, setFootage] = useState<FootageUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchFootage();
    
    // Real-time subscription for footage updates
    const channel = supabase
      .channel('footage-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'footage_uploads'
        },
        () => {
          fetchFootage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFootage = async () => {
    try {
      const { data, error } = await supabase
        .from('footage_uploads')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setFootage(data || []);
    } catch (error) {
      console.error('Error fetching footage:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch footage uploads',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const processWithAI = async (footageId: string, caseId: string, videoUrl: string) => {
    setProcessing(footageId);
    try {
      // Simulate AI processing (replace with actual AI logic later)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock: Create some dummy matches
      const numMatches = Math.floor(Math.random() * 5);
      for (let i = 0; i < numMatches; i++) {
        const { error: matchError } = await supabase
          .from('matches')
          .insert({
            case_id: caseId,
            frame_timestamp: Math.random() * 60,
            confidence: 0.7 + Math.random() * 0.3,
            status: 'pending'
          });
        
        if (matchError) console.error('Error creating match:', matchError);
      }

      // Update footage status
      const { error: updateError } = await supabase
        .from('footage_uploads')
        .update({ 
          status: 'done',
          processed_at: new Date().toISOString()
        })
        .eq('id', footageId);

      if (updateError) throw updateError;

      toast({
        title: 'Processing Complete',
        description: `Found ${numMatches} potential matches. Check the Matches page for review.`,
      });

      fetchFootage();
    } catch (error) {
      console.error('Error processing footage:', error);
      toast({
        title: 'Processing Failed',
        description: 'Failed to process footage with AI',
        variant: 'destructive',
      });
    } finally {
      setProcessing(null);
    }
  };

  const updateStatus = async (footageId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('footage_uploads')
        .update({ status })
        .eq('id', footageId);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Footage status updated to ${status}`,
      });

      fetchFootage();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return <Badge className="bg-success text-success-foreground">Done</Badge>;
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const filteredFootage = statusFilter === 'all' 
    ? footage 
    : footage.filter(f => f.status === statusFilter);

  const stats = {
    pending: footage.filter(f => f.status === 'pending').length,
    processing: footage.filter(f => f.status === 'processing').length,
    done: footage.filter(f => f.status === 'done').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading footage...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Footage Management
          </h1>
          <p className="text-muted-foreground">
            Review uploaded footage and process with AI
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-warning">{stats.pending}</p>
                </div>
                <Video className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold text-primary">{stats.processing}</p>
                </div>
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-success">{stats.done}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={statusFilter === 'processing' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('processing')}
          >
            Processing
          </Button>
          <Button 
            variant={statusFilter === 'done' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('done')}
          >
            Done
          </Button>
        </div>

        {/* Footage List */}
        <div className="space-y-4">
          {filteredFootage.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No footage uploads found</p>
              </CardContent>
            </Card>
          ) : (
            filteredFootage.map((upload) => (
              <Card key={upload.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">Case ID: {upload.case_id.slice(0, 8)}...</h3>
                        {getStatusBadge(upload.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Uploaded:</span>{' '}
                          {new Date(upload.uploaded_at).toLocaleString()}
                        </div>
                        {upload.processed_at && (
                          <div>
                            <span className="font-medium">Processed:</span>{' '}
                            {new Date(upload.processed_at).toLocaleString()}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Upload ID:</span> {upload.id.slice(0, 8)}...
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>View Footage</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <video 
                              src={upload.video_url} 
                              controls 
                              className="w-full rounded-lg"
                            />
                            <div className="text-sm text-muted-foreground">
                              <p><strong>Case ID:</strong> {upload.case_id}</p>
                              <p><strong>Status:</strong> {upload.status}</p>
                              <p><strong>Uploaded:</strong> {new Date(upload.uploaded_at).toLocaleString()}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {upload.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => processWithAI(upload.id, upload.case_id, upload.video_url)}
                          disabled={processing === upload.id}
                        >
                          {processing === upload.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Process with AI
                            </>
                          )}
                        </Button>
                      )}

                      {upload.status === 'processing' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(upload.id, 'done')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Done
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminFootage;
