"use client";

import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { App as AntdApp, ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { supabaseClient } from "@/lib/supabase";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <RefineKbarProvider>
        <AntdApp>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#3b82f6",
                borderRadius: 8,
              },
            }}
          >
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider(supabaseClient)}
              liveProvider={liveProvider(supabaseClient)}
              resources={[
              {
                name: "houses",
                list: "/admin/houses",
                create: "/admin/houses/new",
                edit: "/admin/houses/:id",
                meta: {
                  label: "Houses",
                },
              },
              {
                name: "services",
                list: "/admin/services",
                create: "/admin/services/new",
                edit: "/admin/services/:id",
                meta: {
                  label: "Services",
                },
              },
              {
                name: "amenities",
                list: "/admin/amenities", 
                create: "/admin/amenities/new",
                edit: "/admin/amenities/:id",
                meta: {
                  label: "Amenities",
                },
              },
              {
                name: "site_settings",
                list: "/admin/site-settings",
                meta: {
                  label: "Site Settings",
                },
              },
            ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              <RefineKbar />
              {children}
            </Refine>
          </ConfigProvider>
        </AntdApp>
      </RefineKbarProvider>
    </QueryClientProvider>
  );
}