'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="min-h-screen flex flex-col">
        <div className="p-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-semibold text-xl text-slate-900">BoardMaster</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          {children}
        </div>

        <footer className="p-6 text-center text-sm text-slate-500">
          © 2024 BoardMaster. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
