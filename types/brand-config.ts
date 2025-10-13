/**
 * Brand configuration types for company branding
 */

export interface BrandColor {
  hex_code: string; // Format: #RRGGBB
  weight: number; // 1-5, represents importance/proportion
}

export interface BrandConfig {
  company_name: string;
  company_website: string;
  brand_colors: BrandColor[];
}
