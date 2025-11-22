import { BarChart, Globe, Megaphone, Search, Smartphone, Zap } from 'lucide-react';
import { ClientLogo, ChartDataPoint } from './types';

// Nav links structure only (Text comes from translations)
export const NAV_LINKS_CONFIG = [
  { id: 'services', href: '#services' },
  { id: 'results', href: '#results' },
  { id: 'aiTools', href: '#ai-tools' },
  { id: 'testimonials', href: '#testimonials' },
  { id: 'contact', href: '#contact' },
];

// Service Icons map
export const SERVICE_ICONS = [
  Search,
  Megaphone,
  Smartphone,
  Globe,
  BarChart,
  Zap,
];

// Testimonial Images map
export const TESTIMONIAL_IMAGES = [
  "https://picsum.photos/100/100?random=1",
  "https://picsum.photos/100/100?random=2",
  "https://picsum.photos/100/100?random=3",
  "https://picsum.photos/100/100?random=4"
];

// Chart data is numerical, so it stays constant mostly, but month names could be translated if needed.
// For simplicity in this demo, we keep 'Jan', 'Feb' etc as standard codes or update via props if strictly needed.
export const CHART_DATA: ChartDataPoint[] = [
  { month: 'Jan', traffic: 4000, conversions: 240 },
  { month: 'Feb', traffic: 5500, conversions: 398 },
  { month: 'Mar', traffic: 7000, conversions: 600 },
  { month: 'Apr', traffic: 9500, conversions: 850 },
  { month: 'May', traffic: 12000, conversions: 1200 },
  { month: 'Jun', traffic: 15000, conversions: 1600 },
];

export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'TechFlow', logo: 'https://placehold.co/200x60/0f172a/94a3b8?text=TechFlow&font=montserrat' },
  { name: 'NexaCorp', logo: 'https://placehold.co/200x60/0f172a/94a3b8?text=NexaCorp&font=montserrat' },
  { name: 'Velocity', logo: 'https://placehold.co/200x60/0f172a/94a3b8?text=Velocity&font=montserrat' },
  { name: 'Quantum', logo: 'https://placehold.co/200x60/0f172a/94a3b8?text=Quantum&font=montserrat' },
  { name: 'EchoSys', logo: 'https://placehold.co/200x60/0f172a/94a3b8?text=EchoSys&font=montserrat' },
  { name: 'Stratos', logo: 'https://placehold.co/200x60/0f172a/94a3b8?text=Stratos&font=montserrat' },
];