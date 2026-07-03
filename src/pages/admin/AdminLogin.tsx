import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Coffee, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && session) {
      navigate('/admin', { replace: true });
    }
  }, [authLoading, session, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      toast.error(error.message || 'Đăng nhập thất bại');
      return;
    }

    toast.success('Đăng nhập thành công');
    navigate('/admin', { replace: true });
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-neutral-950 p-6">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-amber-600/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-rose-700/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 shadow-lg shadow-amber-900/40">
            <Coffee className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Bảng điều khiển quản trị</h1>
          <p className="mt-1 text-sm text-neutral-400">Đăng nhập để quản lý nội dung website</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="text-sm font-medium text-neutral-200">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-neutral-500 focus-visible:ring-amber-500/60"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="text-sm font-medium text-neutral-200">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 border-white/10 bg-white/5 px-10 text-white placeholder:text-neutral-500 focus-visible:ring-amber-500/60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-300"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || authLoading}
              className="h-11 w-full bg-gradient-to-r from-amber-500 to-rose-600 font-semibold text-white shadow-lg shadow-amber-900/30 transition-opacity hover:opacity-90"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang đăng nhập…
                </span>
              ) : (
                'Đăng nhập'
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          Chỉ dành cho quản trị viên được cấp quyền.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
