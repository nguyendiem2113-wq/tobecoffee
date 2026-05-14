import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && session) {
      navigate('/admin', { replace: true });
    }
  }, [authLoading, session, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || 'Login failed');
      return;
    }

    toast.success('Logged in successfully');
    navigate('/admin', { replace: true });
  };

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-white flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-900 border border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <p className="text-sm text-slate-400 mt-1">
            Sign in with your Supabase admin credentials to access the dashboard.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2"
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading || authLoading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
