export interface FaceEmbedding {
  id: string;
  case_id: string;
  embedding: number[];
  created_at: string;
}

export interface Match {
  id: string;
  case_id: string;
  frame_timestamp: number;
  confidence: number;
  processed_at: string;
}

export interface ProcessFootageRequest {
  video_url: string;
  case_id: string;
}

export interface ProcessFootageResponse {
  success: boolean;
  message: string;
  matches_found: number;
}