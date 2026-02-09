'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar/sidebar';
import { MaterialsView } from '@/components/materials/materials-view';
import { AppProvider, useApp } from '@/contexts/app-context';

function AuthContent({ children }: { children: React.ReactNode }) {
  const { activeView } = useApp();

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView === 'chat' ? children : <MaterialsView />}
      </main>
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('nexia-user-name');
    if (!name) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null;

  return (
    <AppProvider>
      <AuthContent>{children}</AuthContent>
    </AppProvider>
  );
}
