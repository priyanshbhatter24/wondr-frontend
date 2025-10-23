import { useState, useEffect } from 'react';
import { useApiClient } from './api-client';
import { BrandAssetsData } from '@/types/brand-assets';

/**
 * React hook to fetch brand assets from user ICP configuration
 *
 * Fetches company logo and brand assets from the backend and transforms
 * them into a format suitable for the brand assets sidebar.
 *
 * @returns Object containing assets data and loading state
 */
export function useBrandAssets() {
  const [assets, setAssets] = useState<BrandAssetsData | null>(null);
  const [loading, setLoading] = useState(true);
  const api = useApiClient();

  useEffect(() => {
    async function fetchAssets() {
      try {
        // Fetch user ICP configuration which contains brand assets
        const config = await api.userConfig.getIcp();

        // Transform into BrandAssetsData format
        setAssets({
          logo: config.company_logo_url
            ? { url: config.company_logo_url, label: 'Company Logo' }
            : null,
          assets: config.brand_assets || []
        });
      } catch (err) {
        console.error('Failed to fetch brand assets:', err);
        // Set empty data on error
        setAssets({ logo: null, assets: [] });
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
  }, [api]);

  return { assets, loading };
}
