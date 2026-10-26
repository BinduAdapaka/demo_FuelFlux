'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, ArrowRight } from 'lucide-react';
import Script from 'next/script';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from '@/components/feedback/Toast';

// Form validation schema: handles email OR 10-digit Indian mobile numbers
const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, 'Email or mobile number is required')
    .refine(
      (val) => {
        const isEmail = z.string().email().safeParse(val).success;
        // 10-digit Indian mobile number check (starts with 6-9)
        const isPhone = /^[6-9]\d{9}$/.test(val);
        return isEmail || isPhone;
      },
      {
        message: 'Enter a valid email address or a 10-digit mobile number',
      }
    ),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin, isLoading, error } = useAuthStore();

  const handleGoogleLoginSuccess = async (response: any) => {
    try {
      const result = await googleLogin(response.credential);
      toast.success('Successfully logged in with Google!');

      const { user, activeRole } = useAuthStore.getState();
      const isAdmin = user?.roles?.some((r: string) => ['admin', 'superadmin'].includes(r));
      if (isAdmin) {
        toast.info('Admin access: Redirecting to Admin Security Portal (2FA OTP)...');
        router.push('/admin/login');
        return;
      }

      if (result.rolesCount === 1) {
        const roleDashboardMap: Record<string, string> = {
          pump_owner: '/dashboard',
          logistic:   '/logistic/dashboard',
          investor:   '/investor',
          employee:   '/employee',
        };
        const destination = roleDashboardMap[activeRole ?? ''] ?? '/dashboard';
        toast.info(`Welcome! Redirecting to your ${activeRole?.replace('_', ' ')} dashboard…`);
        router.push(destination);
      } else {
        router.push('/select-role');
      }
    } catch (err: any) {
      toast.error(err.message || 'Google Login failed.');
    }
  };

  const handleGoogleScriptReady = () => {
    if (typeof window !== 'undefined' && (window as any).google) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
          callback: handleGoogleLoginSuccess,
        });

        (window as any).google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          { theme: 'outline', size: 'large', width: '100%' }
        );
      } catch (err) {
        console.error('Error rendering Google button', err);
      }
    }
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google) {
      handleGoogleScriptReady();
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data.emailOrPhone, data.password, data.rememberMe);
      toast.success('Successfully logged in!');

      const { user, activeRole } = useAuthStore.getState();
      const isAdmin = user?.roles?.some((r: string) => ['admin', 'superadmin'].includes(r));

      // Admin accounts bypass role selection and require dedicated 2FA OTP at /admin/login
      if (isAdmin) {
        toast.info('Admin access: Redirecting to Admin Security Portal (2FA OTP)...');
        router.push('/admin/login');
        return;
      }

      if (result.rolesCount === 1) {
        // Single role → get the active role from store and redirect directly
        const roleDashboardMap: Record<string, string> = {
          pump_owner: '/dashboard',
          logistic:   '/logistic/dashboard',
          investor:   '/investor',
          employee:   '/employee',
        };
        const destination = roleDashboardMap[activeRole ?? ''] ?? '/dashboard';
        toast.info(`Welcome! Redirecting to your ${activeRole?.replace('_', ' ')} dashboard…`);
        router.push(destination);
      } else {
        // Multi-role → let user pick their role
        router.push('/select-role');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to access your FuelFlux dashboard"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
        {/* Email or Phone Input */}
        <Input
          {...register('emailOrPhone')}
          label="Email Address or Mobile Number"
          type="text"
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="you@fuelflux.com or 9876543210"
          error={errors.emailOrPhone?.message}
          disabled={isLoading}
        />

        {/* Password Input */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-text-primary tracking-wide">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-primary hover:text-primary-hover transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            {...register('password')}
            error={errors.password?.message}
            disabled={isLoading}
          />
        </div>

        {/* Remember Me Checkbox */}
        <label className="flex items-center gap-2 select-none cursor-pointer w-fit py-0.5">
          <input
            {...register('rememberMe')}
            type="checkbox"
            className="h-4 w-4 rounded border-slate-200 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
            disabled={isLoading}
          />
          <span className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors">
            Remember my session
          </span>
        </label>

        {/* Server Error Alert */}
        {error && !errors.emailOrPhone && !errors.password && (
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs font-medium text-red-600 flex items-center gap-2 animate-fadeIn">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        {/* Sign In Button */}
        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full mt-2 font-bold group">
          Sign In to Platform
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Divider */}
        <div className="relative flex items-center my-1">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-text-secondary tracking-widest uppercase">Or</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Google Sign In Container */}
        <div className="w-full flex justify-center">
          <div id="google-signin-btn" className="w-full"></div>
        </div>

        {/* Google Script Loader */}
        <Script
          src="https://accounts.google.com/gsi/client"
          onReady={handleGoogleScriptReady}
          strategy="afterInteractive"
        />

        {/* Signup redirection link */}
        <div className="text-center text-xs font-medium text-text-secondary mt-1">
          New to FuelFlux?{' '}
          <Link href="/register" className="font-bold text-primary hover:text-primary-hover transition-colors">
            Create an Account
          </Link>
        </div>

        {/* Portal Shortcuts */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 text-center text-xs">
          <div className="flex items-center justify-center gap-3 text-slate-500">
            <Link href="/employee/login" className="hover:text-primary font-semibold transition-colors">
              Attendant Login →
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/admin/login" className="hover:text-primary font-semibold transition-colors">
              Admin Portal →
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
