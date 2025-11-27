
'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Sidebar from '@/app/components/Sidebar';
import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import PWAInstaller from '@/components/PWAInstaller'; // Import the PWAInstaller component

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleContextmenu = (e: MouseEvent) => {
            // Allow context menu in development
            if (process.env.NODE_ENV === 'development') return;
            e.preventDefault();
        };

        const handleKeydown = (e: KeyboardEvent) => {
            // Allow dev tools in development
            if (process.env.NODE_ENV === 'development') return;
            // Prevent F12
            if (e.key === 'F12' || e.keyCode === 123) {
                e.preventDefault();
            }
            // Prevent Ctrl+Shift+I
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
                e.preventDefault();
            }
            // Prevent Ctrl+Shift+J
            if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
                e.preventDefault();
            }
            // Prevent Ctrl+U
            if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
                e.preventDefault();
            }
        };

        // Add event listeners
        document.addEventListener('contextmenu', handleContextmenu);
        document.addEventListener('keydown', handleKeydown);

        // Cleanup function to remove event listeners
        return () => {
            document.removeEventListener('contextmenu', handleContextmenu);
            document.removeEventListener('keydown', handleKeydown);
        };
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const manifestUrl = pathname === '/tunnel' ? '/tunnel-manifest.json' : '/manifest.json';

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                    />
                    <link rel="manifest" href={manifestUrl} />
                    <meta name="theme-color" content="#000000" />
                    <meta name="google-adsense-account" content="ca-pub-2583060052563516" />

            </head>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <div className="flex h-screen bg-background">
                            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
                            <div className="flex flex-col flex-1">
                                <Header onMenuClick={toggleSidebar} />
                                <main className="flex-1 overflow-y-auto">{children}</main>
                            </div>
                        </div>
                        <PWAInstaller />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
