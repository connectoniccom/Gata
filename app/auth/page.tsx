'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoogleReCaptcha from 'react-google-recaptcha';

const AuthPage = () => {
  const { user, signInWithGoogle, signInWithGithub, signInWithFacebook, loading, error } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignIn = async (provider: () => Promise<void>, providerName: string) => {
    setIsSigningIn(providerName);
    try {
      await provider();
    } finally {
      setIsSigningIn(null);
    }
  };

  if (loading && !isSigningIn) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
      );
  }


  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Authentication</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="pt-6 space-y-4">
              <CardDescription className="text-center">Sign in with your email and password</CardDescription>
              <EmailPasswordForm type="login" />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button onClick={() => handleSignIn(signInWithGoogle, 'google')} className="w-full" variant="outline" disabled={!!isSigningIn}>
                {isSigningIn === 'google' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image src="https://www.vectorlogo.zone/logos/google/google-icon.svg" alt="Google" width={20} height={20} className="mr-2" />}
                Sign in with Google
              </Button>
              <Button onClick={() => handleSignIn(signInWithFacebook, 'facebook')} className="w-full" variant="outline" disabled={!!isSigningIn}>
                {isSigningIn === 'facebook' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image src="https://www.vectorlogo.zone/logos/facebook/facebook-icon.svg" alt="Facebook" width={20} height={20} className="mr-2" />}
                Sign in with Facebook
              </Button>
              <Button onClick={() => handleSignIn(signInWithGithub, 'github')} className="w-full" variant="outline" disabled={!!isSigningIn}>
                {isSigningIn === 'github' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Image src="https://www.vectorlogo.zone/logos/github/github-icon.svg" alt="GitHub" width={20} height={20} className="mr-2" />}
                Sign in with GitHub
              </Button>
              {error && <p className="text-sm text-center text-destructive">{error}</p>}
            </TabsContent>
            <TabsContent value="signup" className="pt-6 space-y-4">
              <CardDescription className="text-center">Create a new account with your email and password</CardDescription>
              <EmailPasswordForm type="signup" />
              {error && <p className="text-sm text-center text-destructive">{error}</p>}
            </TabsContent>
          </Tabs>

        </CardContent>
      </Card>
    </div>
  );
};

const EmailPasswordForm: React.FC<{ type: 'login' | 'signup' }> = ({ type }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup, loading: authLoading, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const reCaptchaRef = useRef<GoogleReCaptcha>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = await reCaptchaRef.current?.executeAsync();
    reCaptchaRef.current?.reset();

    if (!token) {
        console.error("reCAPTCHA token not found");
        setIsLoading(false);
        return;
    }

    try {
      if (type === 'login') {
        await login(email, password, token);
      } else {
        await signup(email, password, token);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor={`${type}-email`} className="block text-sm font-medium mb-1">Email</label>
        <input
          id={`${type}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor={`${type}-password`} className="block text-sm font-medium mb-1">Password</label>
        <input
          id={`${type}-password`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
       <div className="flex justify-center pt-2">
        <GoogleReCaptcha
          sitekey="6LeIxAcqAAAAAM2a4Fpn3v58J2w5XANh4sJgz0a1"
          ref={reCaptchaRef}
          size="invisible"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading || authLoading}>
        {isLoading || authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {type === 'login' ? 'Sign In' : 'Sign Up'}
      </Button>
      {authError && <p className="text-sm text-center text-destructive">{authError}</p>}
    </form>
  );
};

export default AuthPage;
