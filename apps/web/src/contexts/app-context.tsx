'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type ActiveView = 'chat' | 'materials';

interface AppContextValue {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ActiveView>('chat');
  const [userName, setUserName] = useState('');

  return (
    <AppContext.Provider value={{ activeView, setActiveView, userName, setUserName }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
