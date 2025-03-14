"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { checkUserSubscription } from "@/app/actions";

// Create a context to store subscription status
import { createContext, useContext } from "react";

interface SubscriptionContextType {
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isSubscribed: false,
  isLoading: true,
  error: null,
});

export function useSubscription() {
  return useContext(SubscriptionContext);
}

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<SubscriptionContextType>({
    isSubscribed: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function checkSubscription() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();

        if (!data.user) {
          if (isMounted) {
            setState({
              isSubscribed: false,
              isLoading: false,
              error: "Not authenticated",
            });
          }
          window.location.href = "/sign-in";
          return;
        }

        const isSubscribed = await checkUserSubscription(data.user.id);

        if (isMounted) {
          setState({ isSubscribed, isLoading: false, error: null });
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        if (isMounted) {
          setState({
            isSubscribed: false,
            isLoading: false,
            error: "Error checking subscription",
          });
        }
      }
    }

    checkSubscription();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SubscriptionContext.Provider value={state}>
      {children}
    </SubscriptionContext.Provider>
  );
}

interface SubscriptionCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function SubscriptionCheck({
  children,
  redirectTo = "/pricing",
}: SubscriptionCheckProps) {
  const { isSubscribed, isLoading, error } = useSubscription();

  useEffect(() => {
    if (!isLoading && !isSubscribed && !error) {
      window.location.href = redirectTo;
    }
  }, [isLoading, isSubscribed, error, redirectTo]);

  // Only show loading on initial page load, not on transitions
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex space-x-2">
          <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
          <div className="h-2 w-2 bg-purple-600 rounded-full animation-delay-200"></div>
          <div className="h-2 w-2 bg-purple-600 rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  if (!isSubscribed && !error) {
    return null; // Will redirect in the useEffect
  }

  return <>{children}</>;
}
