import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { X, Heart, MapPin, Globe, Briefcase } from 'lucide-react';
import { InvestorProfile, StartupProfile } from '@/lib/api';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface SwipeCardProps {
  profile: InvestorProfile | StartupProfile;
  onSwipe: (direction: 'left' | 'right') => void;
  isInvestor: boolean;
}

export function SwipeCard({ profile, onSwipe, isInvestor }: SwipeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const images = profile.images && profile.images.length > 0 
    ? profile.images 
    : ['/placeholder.svg'];

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      setExitDirection(direction);
      setTimeout(() => onSwipe(direction), 200);
    }
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    setExitDirection(direction);
    setTimeout(() => onSwipe(direction), 200);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const startupProfile = !isInvestor ? profile as StartupProfile : null;
  const investorProfile = isInvestor ? profile as InvestorProfile : null;

  return (
    <div className="relative w-full max-w-sm mx-auto h-[600px]">
      <motion.div
        className="absolute inset-0 bg-card rounded-2xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={
          exitDirection
            ? { x: exitDirection === 'right' ? 400 : -400, opacity: 0 }
            : { x: 0, opacity: 1 }
        }
        transition={{ duration: 0.3 }}
      >
        {/* Image Carousel */}
        <div className="relative h-[400px] bg-muted">
          <img
            src={images[currentImageIndex]}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          
          {/* Image Navigation */}
          {images.length > 1 && (
            <>
              <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 px-4">
                {images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      idx === currentImageIndex ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              
              <div className="absolute inset-0 flex">
                <button
                  onClick={prevImage}
                  className="flex-1 cursor-w-resize"
                  aria-label="Previous image"
                />
                <button
                  onClick={nextImage}
                  className="flex-1 cursor-e-resize"
                  aria-label="Next image"
                />
              </div>
            </>
          )}

          {/* Swipe Indicators */}
          <motion.div
            className="absolute top-8 left-8 bg-destructive text-destructive-foreground px-6 py-3 rounded-xl font-bold text-2xl border-4 border-destructive rotate-[-20deg]"
            style={{ opacity: useTransform(x, [-200, 0], [1, 0]) }}
          >
            NOPE
          </motion.div>
          <motion.div
            className="absolute top-8 right-8 bg-success text-success-foreground px-6 py-3 rounded-xl font-bold text-2xl border-4 border-success rotate-[20deg]"
            style={{ opacity: useTransform(x, [0, 200], [0, 1]) }}
          >
            LIKE
          </motion.div>
        </div>

        {/* Profile Info */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{profile.name}</h3>
            {profile.location && (
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{profile.location}</span>
              </div>
            )}
          </div>

          <p className="text-foreground/80 line-clamp-3">
            {startupProfile?.pitch || investorProfile?.bio}
          </p>

          <div className="flex flex-wrap gap-2">
            {startupProfile?.industry && (
              <Badge variant="secondary">
                <Briefcase className="w-3 h-3 mr-1" />
                {startupProfile.industry}
              </Badge>
            )}
            {startupProfile?.stage && (
              <Badge variant="secondary">{startupProfile.stage}</Badge>
            )}
            {investorProfile?.focus_areas?.slice(0, 3).map((area) => (
              <Badge key={area} variant="secondary">{area}</Badge>
            ))}
            {investorProfile?.investment_range && (
              <Badge variant="secondary">{investorProfile.investment_range}</Badge>
            )}
          </div>

          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary text-sm hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              <Globe className="w-4 h-4" />
              {profile.website.replace(/^https?:\/\//, '')}
            </a>
          )}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="absolute -bottom-20 left-0 right-0 flex justify-center gap-6">
        <Button
          size="lg"
          variant="destructive"
          className="w-16 h-16 rounded-full shadow-lg"
          onClick={() => handleButtonSwipe('left')}
        >
          <X className="w-8 h-8" />
        </Button>
        <Button
          size="lg"
          className="w-16 h-16 rounded-full shadow-lg bg-success hover:bg-success/90"
          onClick={() => handleButtonSwipe('right')}
        >
          <Heart className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
}
