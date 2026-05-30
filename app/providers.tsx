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
                name: "islands",
                list: "/admin/islands",
                create: "/admin/islands/new",
                edit: "/admin/islands/:id",
                meta: { label: "Islands" },
              },
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
                name: "experiences",
                list: "/admin/experiences",
                create: "/admin/experiences/new",
                edit: "/admin/experiences/:id",
                meta: { label: "Experiences" },
              },
              {
                name: "experience_categories",
                list: "/admin/experience-categories",
                create: "/admin/experience-categories/new",
                edit: "/admin/experience-categories/:id",
                meta: { label: "Experience Categories" },
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