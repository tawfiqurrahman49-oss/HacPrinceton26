import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { api, InvestorProfile, StartupProfile } from '@/lib/api';
import { SwipeCard } from '@/components/SwipeCard';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function Discover() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<(InvestorProfile | StartupProfile)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      // Try to fetch from backend
      try {
        const feed = await api.getFeed(20);
        setProfiles(feed);
      } catch (apiError) {
        // Fallback to mock data if backend is not available
        console.log('Backend not available, using demo data');
        const { mockProfiles } = await import('@/lib/mockData');
        setProfiles(mockProfiles);
      }
      setCurrentIndex(0);
    } catch (error) {
      toast.error('Failed to load profiles');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleSwipe = async (direction: 'left' | 'right') => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    try {
      const result = await api.swipe(currentProfile.user_id, direction);
      
      if (result.matched) {
        toast.success("It's a match!", {
          description: 'You can now connect with each other',
          icon: <Sparkles className="w-4 h-4" />,
        });
      }

      setCurrentIndex((prev) => prev + 1);

      // Load more profiles when running low
      if (currentIndex >= profiles.length - 3) {
        loadProfiles();
      }
    } catch (error) {
      toast.error('Failed to swipe');
      console.error(error);
    }
  };

  const currentProfile = profiles[currentIndex];

  if (loading && profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <Sparkles className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-2xl font-bold">No more profiles</h2>
          <p className="text-muted-foreground">
            Check back later for new {user?.role === 'investor' ? 'startups' : 'investors'}
          </p>
          <Button onClick={loadProfiles}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 pb-32">
      <SwipeCard
        key={currentProfile.id}
        profile={currentProfile}
        onSwipe={handleSwipe}
        isInvestor={user?.role === 'startup'}
      />
    </div>
  );
}
