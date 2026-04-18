import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api, Match } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Mail, Globe, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMatches = async () => {
    try {
      const data = await api.getMatches();
      setMatches(data);
    } catch (error) {
      toast.error('Failed to load matches');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleUnmatch = async (matchId: number) => {
    try {
      await api.unmatch(matchId);
      setMatches((prev) => prev.filter((m) => m.id !== matchId));
      toast.success('Unmatched successfully');
    } catch (error) {
      toast.error('Failed to unmatch');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading matches...</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-2xl font-bold">No matches yet</h2>
          <p className="text-muted-foreground">
            Start swiping to find your perfect match!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Matches</h1>
          <p className="text-muted-foreground">{matches.length} connection{matches.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((match) => {
            const profile = user?.role === 'investor' ? match.startup : match.investor;
            if (!profile) return null;

            const firstImage = profile.images?.[0] || '/placeholder.svg';

            return (
              <Card key={match.id} className="overflow-hidden">
                <div className="flex gap-4 p-4">
                  <Avatar className="w-20 h-20 rounded-xl">
                    <AvatarImage src={firstImage} alt={profile.name} />
                    <AvatarFallback className="rounded-xl text-lg">
                      {profile.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{profile.name}</h3>
                    
                    {profile.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{profile.location}</span>
                      </div>
                    )}

                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {'pitch' in profile ? profile.pitch : profile.bio}
                    </p>

                    <div className="flex gap-2 mt-3">
                      {profile.website && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Globe className="w-3 h-3 mr-1" />
                            Visit
                          </a>
                        </Button>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-3 h-3 mr-1" />
                            Unmatch
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Unmatch {profile.name}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. You won't be able to see each other anymore.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleUnmatch(match.id)}>
                              Unmatch
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
