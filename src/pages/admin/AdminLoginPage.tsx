// ============================================================
// NEXORA — Admin Login Page
// ============================================================

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back, Admin');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src="/assets/nexora-logo.png"
            alt="NEXORA"
            className="h-16 w-auto mx-auto mb-4 object-contain brightness-0 invert opacity-80"
          />
          <h1 className="text-xs font-bold tracking-[0.3em] uppercase text-[#888]">Admin Access</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider mb-1.5 block">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full bg-[#121212] border border-[#222] px-4 py-3 text-sm text-[#f3f3f3] placeholder:text-[#333] focus:outline-none focus:border-[#ffaa33] transition-colors"
              placeholder="admin@nexora.store"
            />
            {errors.email && (
              <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-[10px] text-[#555] uppercase tracking-wider mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className="w-full bg-[#121212] border border-[#222] px-4 py-3 pr-10 text-sm text-[#f3f3f3] placeholder:text-[#333] focus:outline-none focus:border-[#ffaa33] transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-400 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#ffaa33] text-[#0a0a0a] font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#ffbb44] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4" />
            {isSubmitting ? 'Authenticating...' : 'Access Command Deck'}
          </button>
        </form>

        <p className="text-center text-[10px] text-[#333] mt-6 tracking-wider">
          NEXORA ADMIN — AUTHORIZED PERSONNEL ONLY
        </p>
      </div>
    </div>
  );
}
