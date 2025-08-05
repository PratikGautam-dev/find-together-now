import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { video_url, case_id } = await req.json();
    
    if (!video_url || !case_id) {
      return new Response(
        JSON.stringify({ error: 'Missing video_url or case_id' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing footage for case ${case_id}: ${video_url}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Simulate video processing and face detection
    // In a real implementation, you would:
    // 1. Download video from storage
    // 2. Extract frames using ffmpeg.wasm
    // 3. Run face detection/embedding with MediaPipe or similar
    // 4. Compare embeddings with stored ones
    
    console.log('Downloading video and extracting frames...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate processing time

    // Simulate frame extraction (1 frame per second for 10 seconds)
    const frameTimestamps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let matchesFound = 0;

    // Get existing face embeddings for this case
    const { data: existingEmbeddings, error: embeddingError } = await supabase
      .from('face_embeddings')
      .select('*')
      .eq('case_id', case_id);

    if (embeddingError) {
      console.error('Error fetching embeddings:', embeddingError);
      throw embeddingError;
    }

    console.log(`Found ${existingEmbeddings?.length || 0} existing embeddings for case ${case_id}`);

    // Simulate face detection and matching for each frame
    for (const timestamp of frameTimestamps) {
      console.log(`Processing frame at timestamp ${timestamp}s`);
      
      // Simulate face detection (mock embedding)
      const mockDetectedEmbedding = Array.from({ length: 128 }, () => Math.random());
      
      // Compare with existing embeddings
      if (existingEmbeddings && existingEmbeddings.length > 0) {
        for (const existing of existingEmbeddings) {
          // Simulate similarity calculation (cosine similarity)
          const similarity = calculateMockSimilarity(mockDetectedEmbedding, existing.embedding as number[]);
          
          console.log(`Similarity score: ${similarity}`);
          
          // If similarity >= 0.7, consider it a match
          if (similarity >= 0.7) {
            console.log(`Match found at timestamp ${timestamp}s with confidence ${similarity}`);
            
            // Insert match record
            const { error: insertError } = await supabase
              .from('matches')
              .insert({
                case_id,
                frame_timestamp: timestamp,
                confidence: similarity
              });

            if (insertError) {
              console.error('Error inserting match:', insertError);
            } else {
              matchesFound++;
            }
          }
        }
      } else {
        // If no existing embeddings, create one from the first frame
        if (timestamp === 1) {
          console.log('No existing embeddings found, creating initial embedding from first frame');
          
          const { error: embeddingInsertError } = await supabase
            .from('face_embeddings')
            .insert({
              case_id,
              embedding: mockDetectedEmbedding
            });

          if (embeddingInsertError) {
            console.error('Error inserting face embedding:', embeddingInsertError);
          } else {
            console.log('Initial face embedding created for case');
          }
        }
      }
    }

    console.log(`Processing complete. Found ${matchesFound} matches.`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processing complete. Found ${matchesFound} matches.`,
        matches_found: matchesFound
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in processFootage function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Mock similarity calculation (cosine similarity)
function calculateMockSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    return 0;
  }

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    norm1 += embedding1[i] * embedding1[i];
    norm2 += embedding2[i] * embedding2[i];
  }

  const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  
  // Add some randomness to simulate real detection variability
  const randomFactor = 0.1 + Math.random() * 0.8; // 0.1 to 0.9
  return Math.min(similarity * randomFactor, 1.0);
}