import { useState } from 'react';
import { exportCanvasAsImage } from './fabric-utils';
import * as fabric from 'fabric';

/**
 * React hook for exporting Fabric.js canvas with background image
 *
 * Handles the export process of compositing the canvas objects with
 * the base image and downloading the result as a PNG file.
 *
 * @returns Object containing exportImage function and export state
 */
export function useCanvasExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Export the canvas with background image and download as PNG
   *
   * @param canvas - Fabric.js canvas instance
   * @param baseImageUrl - URL of the base/background image
   * @param versionNumber - Version number for filename
   */
  async function exportImage(
    canvas: fabric.Canvas | undefined,
    baseImageUrl: string,
    versionNumber: number
  ): Promise<void> {
    if (!canvas) {
      setError('Canvas not initialized');
      console.error('❌ Export failed: Canvas not initialized');
      return;
    }

    try {
      setIsExporting(true);
      setError(null);

      console.log('📊 Starting canvas export...');

      // Export canvas with background image as blob
      const blob = await exportCanvasAsImage(canvas, baseImageUrl);

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wondr-post-v${versionNumber}.png`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up object URL
      URL.revokeObjectURL(url);

      console.log('✅ Image exported successfully');

      // TODO: Add toast notification for success
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Export failed:', errorMessage);
      setError(`Failed to export image: ${errorMessage}`);

      // TODO: Add toast notification for error
    } finally {
      setIsExporting(false);
    }
  }

  /**
   * Clear any export errors
   */
  function clearError(): void {
    setError(null);
  }

  return {
    exportImage,
    isExporting,
    error,
    clearError
  };
}
