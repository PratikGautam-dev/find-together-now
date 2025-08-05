import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Eye, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MissingPersonCardProps {
  id: string;
  name: string;
  age: number;
  lastSeenLocation: string;
  lastSeenDate: string;
  photo: string;
  gender: 'male' | 'female' | 'other';
  status: 'active' | 'found' | 'closed';
  description?: string;
  className?: string;
}

const MissingPersonCard: React.FC<MissingPersonCardProps> = ({
  id,
  name,
  age,
  lastSeenLocation,
  lastSeenDate,
  photo,
  gender,
  status,
  description,
  className
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'found':
        return <Badge className="bg-success text-success-foreground">Found</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge className="bg-warning text-warning-foreground">Active</Badge>;
    }
  };

  const getGenderColor = () => {
    switch (gender) {
      case 'male':
        return 'text-blue-600';
      case 'female':
        return 'text-pink-600';
      default:
        return 'text-purple-600';
    }
  };

  return (
    <Card className={cn("overflow-hidden hover:shadow-medium transition-all duration-200 group", className)}>
      <div className="relative">
        <img
          src={photo}
          alt={`${name} - Missing Person`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-white font-semibold text-lg">{name}</h3>
          <p className={cn("text-white/90 text-sm", getGenderColor())}>
            {gender.charAt(0).toUpperCase() + gender.slice(1)}, {age} years old
          </p>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm truncate">{lastSeenLocation}</span>
        </div>

        <div className="flex items-center space-x-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{lastSeenDate}</span>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          <Button size="sm" variant="ghost">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissingPersonCard;