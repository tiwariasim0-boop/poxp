const BASE = import.meta.env.VITE_API_BASE || "/api";

export interface Campaign {
  id: number;
  name: string;
  platform: string[];
  allowed_regions: string[];
  blocked_regions: string[];
  money_html_json: Record<string, string>;
  filter_filename: string;
  page_filenames: Record<string, string>;
  safe_page_url: string;
  cookie_days: number;
  fail_mode: string;
  api_endpoint: string;
  api_secret: string;
  created_at: string;
  active: boolean;
}

export interface CampaignCreate {
  name: string;
  platform: string[];
  allowed_regions: string[];
  blocked_regions: string[];
  safe_page_url: string;
  cookie_days: number;
  fail_mode: string;
  api_endpoint: string;
  api_secret?: string;
  money_html: Record<string, string>;
}

export interface SetupStep {
  title: string;
  body: string;
}

export interface SetupInstructions {
  campaign_id: number;
  filter_filename: string;
  page_filenames: Record<string, string>;
  money_pages: Record<string, string>;
  api_secret: string;
  safe_page_snippet: string;
  safe_page_template: string;
  steps: SetupStep[];
}

export async function listCampaigns(): Promise<Campaign[]> {
  const res = await fetch(`${BASE}/campaigns/`);
  return res.json();
}

export async function getCampaign(id: string | number): Promise<Campaign> {
  const res = await fetch(`${BASE}/campaigns/${id}`);
  return res.json();
}

export async function createCampaign(
  payload: CampaignCreate
): Promise<Campaign> {
  const res = await fetch(`${BASE}/campaigns/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create campaign");
  return res.json();
}

export async function getSetupInstructions(
  id: string | number
): Promise<SetupInstructions> {
  const res = await fetch(`${BASE}/campaigns/${id}/setup-instructions`);
  return res.json();
}

export function downloadFilterUrl(id: string | number): string {
  return `${BASE}/campaigns/${id}/download-filter`;
}

export function downloadPageUrl(id: string | number, device: string): string {
  return `${BASE}/campaigns/${id}/download-page/${device}`;
}

export function downloadBundleUrl(id: string | number): string {
  return `${BASE}/campaigns/${id}/download-bundle`;
}

export async function getAnalyticsSummary(
  id: string | number,
  days = 7
): Promise<any> {
  const res = await fetch(
    `${BASE}/analytics/summary?campaign_id=${id}&days=${days}`
  );
  return res.json();
}

export async function getAnalyticsTimeline(
  id: string | number,
  days = 7
): Promise<any[]> {
  const res = await fetch(
    `${BASE}/analytics/timeline?campaign_id=${id}&days=${days}`
  );
  return res.json();
}

export async function getRecentEvents(
  id: string | number,
  limit = 50
): Promise<any[]> {
  const res = await fetch(
    `${BASE}/analytics/recent?campaign_id=${id}&limit=${limit}`
  );
  return res.json();
}
