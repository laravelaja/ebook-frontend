import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../api/supabaseClient';
import { apiClient } from '../../../api/client';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          navigate('/login');
          return;
        }

        const user = session.user;
        
        // Register/login user in our backend
        try {
          const { data } = await apiClient.post('/auth/google', {
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            avatar_url: user.user_metadata?.avatar_url || '',
            google_id: user.id,
          });

          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('logged_in_user', JSON.stringify(data.user));
          
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        } catch {
          // Fallback: save basic info
          const basicUser = {
            name: user.user_metadata?.full_name || 'User',
            email: user.email,
            role: 'user',
            avatar_url: user.user_metadata?.avatar_url || '',
          };
          localStorage.setItem('logged_in_user', JSON.stringify(basicUser));
          navigate('/');
        }
      } catch {
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-full w-full flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400 font-medium">Memproses login...</span>
      </div>
    </div>
  );
};
