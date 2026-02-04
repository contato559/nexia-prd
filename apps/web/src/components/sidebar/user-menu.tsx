'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface UserMenuProps {
  user?: {
    name: string;
    email: string;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const defaultUser = user || {
    name: 'Usuário Teste',
    email: 'teste@exemplo.com',
  };

  const initials = defaultUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-150 cursor-pointer">
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-neutral-900 text-white text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{defaultUser.name}</p>
        <p className="text-xs text-gray-500 truncate">{defaultUser.email}</p>
      </div>
    </div>
  );
}
