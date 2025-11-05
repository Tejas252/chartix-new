import { useState, useEffect } from 'react';

export function useMediaQuery() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'laptop' | 'desktop' | null>(null);
  const [dimensions, setDimensions] = useState({ 
    width: typeof window !== 'undefined' ? window.innerWidth : 0, 
    height: typeof window !== 'undefined' ? window.innerHeight : 0 
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({ width, height });
      
      if (width < 768) {
        setDevice('mobile');
      } else if (width >= 768 && width < 1024) {
        setDevice('tablet');
      } else if (width >= 1024 && width < 1440) {
        setDevice('laptop');
      } else {
        setDevice('desktop');
      }
    };

    // Initialize on mount
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    device,
    width: dimensions.width,
    height: dimensions.height,
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isLaptop: device === 'laptop',
    isDesktop: device === 'desktop',
    isMobileOrTablet: device === 'mobile' || device === 'tablet'
  };
}