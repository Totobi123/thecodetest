import { QueryClient } from "@tanstack/react-query";

// Pure frontend query client - no API calls needed
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
      enabled: false, // Disable all queries by default
    },
    mutations: {
      retry: false,
    },
  },
});
