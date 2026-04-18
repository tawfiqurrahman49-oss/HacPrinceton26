import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const provider = window.location.pathname.split('/').pop()?.replace('-callback', '');
      const error = searchParams.get('error');

      if (error) {
        toast.error(`Authentication failed: ${error}`);
        navigate('/login');
        return;
      }

      if (!code || !provider) {
        toast.error('Invalid authentication response');
        navigate('/login');
        return;
      }

      try {
        await api.handleOAuthCallback(provider, code);
        toast.success('Successfully signed in!');
        
        // Get stored return path or default to discover
        const returnPath = localStorage.getItem('oauth_return_path') || '/discover';
        localStorage.removeItem('oauth_return_path');
        localStorage.removeItem('oauth_role');
        
        navigate(returnPath);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Authentication failed');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/10">
      <Card className="w-full max-w-md border-border/50 backdrop-blur">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Completing sign in...</h2>
            <p className="text-muted-foreground">Please wait while we verify your account</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
