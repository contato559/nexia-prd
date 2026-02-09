'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    localStorage.setItem('nexia-user-name', trimmed);
    router.push('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">N</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Nexia PRD</h1>
          <p className="text-sm text-gray-500 mt-1">Gerador de documentos com IA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Seu nome
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
