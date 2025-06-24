import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check for token in localStorage (or cookies if you prefer)
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);
}