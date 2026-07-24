"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NotificationsProvider, useAuth } from "@/src/contexts";
import { Header } from "@/src/components/layout";
import { PageLoader } from "@/src/components/states";

function AppLayoutContent({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header />
      <main
        className="container px-4 sm:px-6 lg:px-8 py-6 mx-auto bg-[url('/images/bg4.jpg')] 
          bg-cover
          bg-center
          bg-no-repeat
          min-h-[calc(100dvh-66px)]"
      >
        {children}
      </main>
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <NotificationsProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </NotificationsProvider>
  );
}
