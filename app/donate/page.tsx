
'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const DonatePage = () => {
    const paymentUrl = "https://flutterwave.com/pay/ugxeversend?email=matovuasuman481@gmail.com&firstname=Matovu&lastname=Asuman";

    return (
        <div className="flex justify-center items-center h-full p-4">
            <Card className="w-full max-w-lg text-center shadow-lg">
                <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        <Heart className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold mt-4">Support Connectonic</CardTitle>
                    <CardDescription>
                        Your contribution helps us keep the music playing and support artists everywhere.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                   <p className="text-muted-foreground">
                    Click the button below to make a secure donation. We appreciate your support!
                   </p>
                   <Button asChild size="lg">
                        <Link href={paymentUrl} target="_blank" rel="noopener noreferrer">
                            Donate Now
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                   </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default DonatePage;
