import React from 'react';
import type { PictureNamingItem } from '../../content/storyHouse';

interface PictureNamingArtProps {
  illustrationKey: PictureNamingItem['illustrationKey'];
  className?: string;
}

const NAMING_IMAGE_MAP: Record<PictureNamingItem['illustrationKey'], string> = {
  dog: '/images/naming_dog.jpg',
  butterfly: '/images/naming_butterfly.jpg',
  frog: '/images/naming_frog.jpg',
  elephant: '/images/naming_elephant.jpg',
  key: '/images/naming_key.jpg',
  umbrella: '/images/naming_umbrella.jpg',
  cup: '/images/naming_cup.jpg',
  bicycle: '/images/naming_bicycle.jpg',
  jumping: '/images/naming_jumping.jpg',
  reading: '/images/naming_reading.jpg',
};

export const PictureNamingArt: React.FC<PictureNamingArtProps> = ({
  illustrationKey,
  className = 'w-64 h-64',
}) => {
  return (
    <img
      src={NAMING_IMAGE_MAP[illustrationKey]}
      alt="איור לשיום"
      className={`${className} rounded-[2rem] border-4 border-amber-200 bg-amber-50 object-cover shadow-md`}
    />
  );
};
