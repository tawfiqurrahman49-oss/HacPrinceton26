import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Building2, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'startup' | 'investor'>('startup');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(email, password, role, 'mock-captcha-token');
      toast.success('Account created! Set up your profile');
      navigate('/profile/setup');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignup = (provider: 'google' | 'yahoo' | 'linkedin') => {
    // Store role preference and return path for OAuth
    localStorage.setItem('oauth_role', role);
    localStorage.setItem('oauth_return_path', '/profile/setup');
    window.location.href = api.getOAuthUrl(provider, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/10">
      <Card className="w-full max-w-md border-border/50 backdrop-blur shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-primary/80 flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Create Account
          </CardTitle>
          <CardDescription className="text-base">
            Join the matching platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-base">I am a</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('startup')}
                className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                  role === 'startup'
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                    : 'border-border hover:border-primary/50 hover:bg-accent/5'
                }`}
              >
                <Building2 className={`w-7 h-7 mx-auto mb-2 ${role === 'startup' ? 'text-primary' : ''}`} />
                <div className="font-semibold">Startup</div>
                <div className="text-xs text-muted-foreground mt-1">Seeking funding</div>
              </button>
              <button
                type="button"
                onClick={() => setRole('investor')}
                className={`p-5 rounded-xl border-2 transition-all duration-200 ${
                  role === 'investor'
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                    : 'border-border hover:border-primary/50 hover:bg-accent/5'
                }`}
              >
                <Wallet className={`w-7 h-7 mx-auto mb-2 ${role === 'investor' ? 'text-primary' : ''}`} />
                <div className="font-semibold">Investor</div>
                <div className="text-xs text-muted-foreground mt-1">Looking to invest</div>
              </button>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-base font-medium hover:bg-accent/10 transition-all"
              onClick={() => handleOAuthSignup('google')}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-base font-medium hover:bg-accent/10 transition-all"
              onClick={() => handleOAuthSignup('linkedin')}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-base font-medium hover:bg-accent/10 transition-all"
              onClick={() => handleOAuthSignup('yahoo')}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.0001 1.99994C6.48608 1.99994 2.00008 6.48594 2.00008 11.9999C2.00008 17.5139 6.48608 21.9999 12.0001 21.9999C17.5141 21.9999 22.0001 17.5139 22.0001 11.9999C22.0001 6.48594 17.5141 1.99994 12.0001 1.99994ZM13.2001 17.9999H10.8001V15.5999H13.2001V17.9999ZM14.9521 11.3999L13.2001 14.3999V14.9999H10.8001V14.3999L9.04808 11.3999C8.52808 10.5119 8.40008 9.69594 8.40008 8.63994C8.40008 6.43194 10.1761 4.79994 12.0001 4.79994C13.8241 4.79994 15.6001 6.43194 15.6001 8.63994C15.6001 9.69594 15.4721 10.5119 14.9521 11.3999Z"/>
              </svg>
              Continue with Yahoo
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
