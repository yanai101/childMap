import React from 'react';

interface PictureDescriptionArtProps {
  className?: string;
}

export const PictureDescriptionArt: React.FC<PictureDescriptionArtProps> = ({
  className = 'w-full h-auto max-h-[460px]',
}) => {
  return (
    <img
      src="/images/park_scene.jpg"
      alt="יום שמח בפארק של הכפר"
      className={`${className} rounded-2xl object-contain`}
    />
  );
};
