
import { animations, AnimationAsset } from '../data';
import { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type Props = {
  params: { id: string };
};

// Find the asset by ID
function getAnimationAsset(id: string): AnimationAsset | undefined {
  return animations.find((a) => a.id === id);
}

// Generate metadata for social media previews ("blueprints")
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const asset = getAnimationAsset(params.id);

  if (!asset) {
    return {
      title: 'Animation Not Found',
    };
  }

  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  const imageUrl = asset.src.startsWith('http') ? asset.src : `${baseUrl}${asset.src}`;

  return {
    title: `Animation: ${asset.title}`,
    description: `Check out this cool ${asset.type.toLowerCase()} from Connectonic!`,
    openGraph: {
      title: `Animation: ${asset.title}`,
      description: `Check out this cool ${asset.type.toLowerCase()} from Connectonic!`,
      images: [
        {
          url: imageUrl,
          width: 400,
          height: 400,
          alt: asset.title,
        },
      ],
      url: `${baseUrl}/animations/${asset.id}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Animation: ${asset.title}`,
      description: `Check out this cool ${asset.type.toLowerCase()} from Connectonic!`,
      images: [imageUrl],
    },
  };
}


export default function AnimationPage({ params }: Props) {
  const asset = getAnimationAsset(params.id);

  if (!asset) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 flex justify-center items-center h-full">
        <div className="w-full max-w-md">
            <Button asChild variant="outline" className="mb-4">
                <Link href="/animations">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Animations
                </Link>
            </Button>
            <Card className="text-center">
                <CardHeader>
                <CardTitle className="text-2xl">{asset.title}</CardTitle>
                <CardDescription>
                    This is a preview page for sharing the {asset.type.toLowerCase()}.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="aspect-square relative">
                    <Image
                    src={asset.src}
                    alt={asset.title}
                    fill
                    className="object-contain"
                    unoptimized={asset.type === 'GIF'}
                    />
                </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

// Generate static paths for each animation
export async function generateStaticParams() {
  return animations.map((asset) => ({
    id: asset.id,
  }));
}
