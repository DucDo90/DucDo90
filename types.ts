import { LucideIcon } from 'lucide-react';

export type Language = 'en' | 'vi' | 'fr' | 'ko' | 'lo' | 'km';

export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface ChartDataPoint {
  month: string;
  traffic: number;
  conversions: number;
}

export interface ClientLogo {
  name: string;
  logo: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}