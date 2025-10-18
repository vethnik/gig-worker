import React from 'react';
import { useTranslation } from 'react-i18next';

interface LogoProps {
  className?: string;
  showText?: boolean;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = "", showText = true, showTagline = true, size = 'md' }) => {
  const { t } = useTranslation();
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };
  
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Background Circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-lg"></div>
        
        {/* Main Icon - Construction/Work Theme */}
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
          >
            {/* Hard Hat */}
            <path
              d="M12 2C8.5 2 6 4.5 6 8V10C6 10.5 6.5 11 7 11H17C17.5 11 18 10.5 18 10V8C18 4.5 15.5 2 12 2Z"
              fill="currentColor"
            />
            {/* Hat Brim */}
            <path
              d="M4 11C4 10.5 4.5 10 5 10H19C19.5 10 20 10.5 20 11C20 11.5 19.5 12 19 12H5C4.5 12 4 11.5 4 11Z"
              fill="currentColor"
            />
            {/* Tools - Hammer and Wrench */}
            <path
              d="M8 14L10 16L14 12L12 10L8 14Z"
              fill="currentColor"
              opacity="0.8"
            />
            <path
              d="M14 16L16 14L20 18L18 20L14 16Z"
              fill="currentColor"
              opacity="0.8"
            />
            {/* Building/Construction Elements */}
            <rect
              x="6"
              y="18"
              width="12"
              height="4"
              fill="currentColor"
              opacity="0.6"
            />
            <rect
              x="8"
              y="16"
              width="2"
              height="2"
              fill="currentColor"
              opacity="0.7"
            />
            <rect
              x="14"
              y="16"
              width="2"
              height="2"
              fill="currentColor"
              opacity="0.7"
            />
          </svg>
        </div>
        
        {/* Accent Dot */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white shadow-sm"></div>
      </div>
      
      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-foreground leading-tight ${textSizeClasses[size]}`}>
            {t('gig_worker')}
          </span>
          {showTagline && (
            <span className="text-xs text-muted-foreground font-medium -mt-1">
              {t('logo_tagline')}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
