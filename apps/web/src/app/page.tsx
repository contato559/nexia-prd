'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const name = localStorage.getItem('nexia-user-name');
    router.replace(name ? '/chat' : '/login');
  }, [router]);

  return null;
}
