import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Video, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center bg-background">
            <main className="flex flex-col items-center justify-center flex-1 p-4 md:p-8">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-primary">
                    Connectonic.com
                </h1>
                <p className="max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground mb-8">
                    Your ultimate hub for discovering new music and connecting with artists. Explore tracks, watch videos, and dive into the world of sound.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <Button asChild size="lg">
                        <Link href="/artists">
                            <Music className="mr-2 h-5 w-5" /> Explore Artists
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary">
                        <Link href="/artists">
                            <Video className="mr-2 h-5 w-5" /> Watch Videos
                        </Link>
                    </Button>
                </div>

                <div className="w-full max-w-4xl grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>What is Connectonic?</CardTitle>
                            <CardDescription>A revolutionary platform for music lovers.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-left text-muted-foreground">
                                Connectonic is designed to bridge the gap between artists and their fans. We provide a space for creators to share their work and for listeners to discover their next favorite song.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <footer className="w-full py-6 border-t mt-12">
                <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Connectonic.com. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
}
