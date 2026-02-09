'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function UserMenu() {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(localStorage.getItem('nexia-user-name') || 'Usuario');
  }, []);

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-primary text-white text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
      </div>
    </div>
  );
}
