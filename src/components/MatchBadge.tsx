import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface MatchBadgeProps {
  status: 'processing' | 'matched' | 'no-match';
  confidence?: number;
}

const MatchBadge: React.FC<MatchBadgeProps> = ({ status, confidence }) => {
  switch (status) {
    case 'processing':
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock className="w-3 h-3 animate-pulse" />
          Processing...
        </Badge>
      );
    case 'matched':
      return (
        <Badge variant="default" className="flex items-center gap-1 bg-success text-success-foreground">
          <CheckCircle className="w-3 h-3" />
          Match found!
          {confidence && (
            <span className="text-xs">
              ({Math.round(confidence * 100)}%)
            </span>
          )}
        </Badge>
      );
    case 'no-match':
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          No match
        </Badge>
      );
    default:
      return null;
  }
};

export default MatchBadge;