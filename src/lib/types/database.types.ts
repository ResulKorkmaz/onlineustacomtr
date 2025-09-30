/**
 * Database Types - Supabase Generated
 * Bu dosya production'da `supabase gen types typescript` ile generate edilmeli
 */

export type UserRole = "customer" | "provider";
export type ProviderKind = "individual" | "company";
export type JobStatus = "open" | "closed" | "awarded" | "cancelled";
export type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn";
export type NotificationType =
  | "new_job_in_city"
  | "new_bid_on_job"
  | "bid_accepted"
  | "bid_rejected"
  | "job_awarded"
  | "job_cancelled"
  | "system_announcement";

export interface Profile {
  id: string;
  role: UserRole;
  provider_kind: ProviderKind | null;
  full_name: string | null;
  company_name: string | null;
  tax_id: string | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  email_notifications: boolean;
  push_notifications: boolean;
  phone_visible: boolean;
  completed_jobs_count: number;
  average_rating: number | null;
  total_reviews_count: number;
  is_admin: boolean;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_seen_at: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon_name: string | null;
  parent_id: number | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ServiceArea {
  id: number;
  user_id: string;
  city: string;
  district: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Job {
  id: number;
  customer_id: string;
  title: string;
  description: string;
  category_id: number | null;
  city: string;
  district: string | null;
  address_detail: string | null;
  budget_min: number | null;
  budget_max: number | null;
  budget_currency: string;
  status: JobStatus;
  bid_count: number;
  view_count: number;
  expires_at: string | null;
  awarded_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Bid {
  id: number;
  job_id: number;
  provider_id: string;
  amount: number;
  currency: string;
  message: string;
  status: BidStatus;
  delivery_days: number | null;
  created_at: string;
  updated_at: string;
  responded_at: string | null;
}

export interface Notification {
  id: number;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  payload: Record<string, unknown> | null;
  link_url: string | null;
  is_read: boolean;
  is_sent_email: boolean;
  is_sent_push: boolean;
  created_at: string;
  read_at: string | null;
}

export interface Review {
  id: number;
  job_id: number;
  reviewer_id: string;
  reviewed_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

// Extended types with relations
export interface JobWithDetails extends Job {
  customer?: Profile;
  category?: Category;
  bids?: Bid[];
}

export interface BidWithDetails extends Bid {
  job?: Job;
  provider?: Profile;
}
