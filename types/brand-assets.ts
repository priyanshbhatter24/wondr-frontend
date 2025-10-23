export interface BrandAssetsData {
  logo: { url: string; label: string } | null;
  assets: Array<{
    asset_id: string;
    s3_url: string;
    label: string;
  }>;
}

// Note: Fabric.js uses built-in fabric.Object for placed assets,
// so we don't need custom PlacedAsset type
