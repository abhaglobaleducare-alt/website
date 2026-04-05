/**
 * ABHA Global Educare - TypeScript Types & Interfaces
 */

// Navigation Types
export interface NavLink {
  label: string;
  href: string;
  children?: NavLink[];
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  course: string;
  neetScore?: string;
  preferredCountry?: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Destination Types
export interface Destination {
  id: string;
  name: string;
  flag: string;
  image: string;
  universities: number;
  duration: string;
  fees: string;
  recognition: string;
  highlights: string[];
  description?: string;
  slug?: string;
}

// University Types
export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  image: string;
  logo?: string;
  established: number;
  ranking?: number;
  recognition: string[];
  fees: {
    tuition: number;
    hostel: number;
    total: number;
  };
  duration: string;
  intake: string[];
  medium: string;
  facilities: string[];
  description: string;
  highlights: string[];
  slug: string;
}

// Service Types
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features?: string[];
}

// Testimonial Types
export interface Testimonial {
  id: number;
  name: string;
  university: string;
  batch: string;
  image: string;
  rating: number;
  content: string;
  videoUrl?: string;
}

// Blog Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: Author;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  featured?: boolean;
}

export interface Author {
  name: string;
  avatar?: string;
  bio?: string;
  role?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

// FAQ Types
export interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

// Statistics Types
export interface Stat {
  value: string;
  label: string;
  suffix?: string;
  icon?: string;
}

// Office/Contact Types
export interface Office {
  label: string;
  companyName?: string;
  address: string;
  phone: string;
  phoneRaw: string;
  email: string;
  mapUrl: string;
  timings: string;
}

// Social Links
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  twitter?: string;
  whatsapp?: string;
}

// SEO Types
export interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

// API Response Types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Email Types
export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

// Form Field Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

// Component Props Types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  hoverable?: boolean;
  onClick?: () => void;
}

// Animation Types
export interface AnimationProps {
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  once?: boolean;
}

// Locale Types
export type Locale = 'en' | 'hi';

export interface LocaleMessages {
  nav: Record<string, string>;
  hero: Record<string, string>;
  about: Record<string, string>;
  services: Record<string, string>;
  destinations: Record<string, string>;
  testimonials: Record<string, string>;
  contact: Record<string, string>;
  footer: Record<string, string>;
  common: Record<string, string>;
}

// Utility Types
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
