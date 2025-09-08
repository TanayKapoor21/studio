"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Leaf,
  Sprout,
  LayoutDashboard,
  Settings,
  DollarSign,
  Thermometer,
} from 'lucide-react';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const mainLinks = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/fertilizer', label: 'Fertilizer', icon: Leaf },
  { href: '/price-prediction', label: 'Price Prediction', icon: DollarSign },
  { href: '/environment', label: 'Environment', icon: Thermometer },
  { href: '/crop-recommendation', label: 'Crop Suggestion', icon: Sprout },
];

const bottomLinks = [
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground group-data-[collapsible=icon]:hidden">
            AgriVision
          </span>
        </Link>
      </SidebarHeader>

      <SidebarMenu className="flex-1">
        {mainLinks.map(link => (
          <SidebarMenuItem key={link.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === link.href}
              tooltip={{ children: link.label }}
            >
              <Link href={link.href}>
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      
      <SidebarSeparator />

      <SidebarMenu>
        {bottomLinks.map(link => (
          <SidebarMenuItem key={link.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === link.href}
              tooltip={{ children: link.label }}
            >
              <Link href={link.href}>
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
