
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { animations, AnimationAsset } from './data';

const AnimationsPage = () => {
  const [activeTab, setActiveTab] = useState('stickers');

  const handleShare = async (asset: AnimationAsset) => {
    const shareUrl = `${window.location.origin}/animations/${asset.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: asset.title,
          text: `Check out this animation: ${asset.title}`,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const renderGrid = (type: 'Sticker' | 'GIF' | 'Emoji') => {
    const assets = animations.filter((a) => a.type === type);
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {assets.map((asset) => (
          <Card key={asset.id} className="group overflow-hidden">
            <CardContent className="p-0 relative">
              <Image
                src={asset.src}
                alt={asset.title}
                width={200}
                height={200}
                className="w-full h-full object-contain aspect-square"
                unoptimized={asset.type === 'GIF'}
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 text-center">
                <p className="text-white font-semibold text-sm mb-2">{asset.title}</p>
                <Button size="sm" onClick={() => handleShare(asset)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold mb-2 text-center">Amazing Animations</h1>
      <p className="text-lg text-muted-foreground text-center mb-8">
        Discover and share fun stickers, GIFs, and emojis.
      </p>

      <Tabs defaultValue="stickers" className="w-full" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="stickers">Stickers</TabsTrigger>
          <TabsTrigger value="gifs">GIFs</TabsTrigger>
          <TabsTrigger value="emojis">Emojis</TabsTrigger>
        </TabsList>
        <TabsContent value="stickers">{renderGrid('Sticker')}</TabsContent>
        <TabsContent value="gifs">{renderGrid('GIF')}</TabsContent>
        <TabsContent value="emojis">{renderGrid('Emoji')}</TabsContent>
      </Tabs>
    </div>
  );
};

export default AnimationsPage;
