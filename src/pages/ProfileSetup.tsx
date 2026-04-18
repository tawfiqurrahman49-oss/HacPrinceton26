import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [industry, setIndustry] = useState('');
  const [stage, setStage] = useState('');
  const [focusAreas, setFocusAreas] = useState('');
  const [investmentRange, setInvestmentRange] = useState('');

  const isStartup = user?.role === 'startup';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isStartup) {
        await api.createStartupProfile({
          name,
          pitch: description,
          location,
          website,
          industry,
          stage,
          images,
        });
      } else {
        await api.createInvestorProfile({
          name,
          bio: description,
          location,
          website,
          focus_areas: focusAreas.split(',').map((s) => s.trim()),
          investment_range: investmentRange,
          images,
        });
      }

      toast.success('Profile created!');
      navigate('/discover');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 py-20">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Set Up Your Profile</CardTitle>
          <CardDescription>
            Tell us about your {isStartup ? 'startup' : 'investment focus'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images */}
            <div className="space-y-2">
              <Label>Photos</Label>
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                    <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
                {images.length < 6 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex items-center justify-center transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Add up to 6 photos to showcase your {isStartup ? 'product' : 'portfolio'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{isStartup ? 'Company Name' : 'Name'}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                {isStartup ? 'Pitch' : 'Bio'}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                placeholder={
                  isStartup
                    ? 'What problem are you solving?'
                    : 'What do you look for in startups?'
                }
              />
            </div>

            {isStartup ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. FinTech"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage</Label>
                    <Input
                      id="stage"
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      placeholder="e.g. Seed"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="focusAreas">Focus Areas</Label>
                  <Input
                    id="focusAreas"
                    value={focusAreas}
                    onChange={(e) => setFocusAreas(e.target.value)}
                    placeholder="e.g. FinTech, HealthTech, AI"
                  />
                  <p className="text-xs text-muted-foreground">Separate with commas</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investmentRange">Investment Range</Label>
                  <Input
                    id="investmentRange"
                    value={investmentRange}
                    onChange={(e) => setInvestmentRange(e.target.value)}
                    placeholder="e.g. $100K - $1M"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
