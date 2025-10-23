import * as fabric from 'fabric';
import { PlacedAsset } from '@/types/image-generation';

/**
 * Load an image and add it to the canvas at the center
 *
 * @param canvas - Fabric.js canvas instance
 * @param imageUrl - URL of the image to load
 * @param label - Label/identifier for the image
 * @returns Promise resolving to the added fabric.FabricImage object
 */
export async function addImageToCanvas(
  canvas: fabric.Canvas,
  imageUrl: string,
  label: string
): Promise<fabric.FabricImage> {
  return new Promise((resolve, reject) => {
    fabric.FabricImage.fromURL(imageUrl, { crossOrigin: 'anonymous' })
      .then((img) => {
        if (!img) {
          reject(new Error('Failed to load image'));
          return;
        }

        // Scale to reasonable default size (100px width)
        const scale = 100 / (img.width || 100);
        img.scale(scale);

        // Center the image on canvas
        const centerPoint = canvas.getCenterPoint();
        img.set({
          left: centerPoint.x - (img.getScaledWidth() / 2),
          top: centerPoint.y - (img.getScaledHeight() / 2),
          selectable: true,
          hasControls: true,
          hasBorders: true,
          // Store metadata
          data: { assetLabel: label }
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        resolve(img);
      })
      .catch((err) => {
        reject(new Error(`Failed to load image: ${err.message}`));
      });
  });
}

/**
 * Export canvas with background image as a composite PNG blob
 *
 * @param canvas - Fabric.js canvas instance
 * @param baseImageUrl - URL of the base/background image
 * @returns Promise resolving to a Blob of the exported image
 */
export async function exportCanvasAsImage(
  canvas: fabric.Canvas,
  baseImageUrl: string
): Promise<Blob> {
  // Get canvas dimensions
  const width = canvas.width || 800;
  const height = canvas.height || 800;

  // Create temporary offscreen canvas element
  const tempCanvasEl = document.createElement('canvas');
  tempCanvasEl.width = width;
  tempCanvasEl.height = height;
  const ctx = tempCanvasEl.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Load and draw background image
  const bgImage = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load background image'));
    img.src = baseImageUrl;
  });

  // Draw background image
  ctx.drawImage(bgImage, 0, 0, width, height);

  // Draw all canvas objects on top
  const objects = canvas.getObjects();
  for (const obj of objects) {
    // Convert each Fabric object to an image and draw it
    const objDataURL = obj.toDataURL({ format: 'png' });
    const objImage = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load object image'));
      img.src = objDataURL;
    });

    // Calculate position and size
    const left = obj.left || 0;
    const top = obj.top || 0;
    const scaledWidth = obj.getScaledWidth();
    const scaledHeight = obj.getScaledHeight();

    ctx.drawImage(objImage, left, top, scaledWidth, scaledHeight);
  }

  // Convert to blob
  return new Promise((resolve, reject) => {
    tempCanvasEl.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/png');
  });
}

/**
 * Clear all objects from the canvas
 *
 * @param canvas - Fabric.js canvas instance
 */
export function clearCanvas(canvas: fabric.Canvas): void {
  canvas.clear();
  canvas.renderAll();
}

/**
 * Serialize canvas objects to PlacedAsset format for persistence
 *
 * @param canvas - Fabric.js canvas instance
 * @returns Array of PlacedAsset objects with position and transform data
 */
export function serializeCanvasData(canvas: fabric.Canvas): PlacedAsset[] {
  const objects = canvas.getObjects();

  return objects.map(obj => {
    const data = obj.data as { assetLabel?: string } | undefined;

    return {
      asset_url: (obj as any).src || (obj as any)._originalElement?.src || '',
      asset_label: data?.assetLabel || 'Unknown Asset',
      left: obj.left || 0,
      top: obj.top || 0,
      scaleX: obj.scaleX || 1,
      scaleY: obj.scaleY || 1,
      angle: obj.angle || 0,
    };
  });
}

/**
 * Restore canvas from PlacedAsset data
 *
 * @param canvas - Fabric.js canvas instance
 * @param canvasData - Array of PlacedAsset objects to restore
 */
export async function restoreCanvasData(
  canvas: fabric.Canvas,
  canvasData: PlacedAsset[]
): Promise<void> {
  // Clear existing objects
  canvas.clear();

  // Load each asset
  for (const asset of canvasData) {
    try {
      const img = await fabric.FabricImage.fromURL(asset.asset_url, {
        crossOrigin: 'anonymous'
      });

      if (!img) {
        console.warn(`Failed to load asset: ${asset.asset_label}`);
        continue;
      }

      // Restore position and transform
      img.set({
        left: asset.left,
        top: asset.top,
        scaleX: asset.scaleX,
        scaleY: asset.scaleY,
        angle: asset.angle,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        data: { assetLabel: asset.asset_label }
      });

      canvas.add(img);
    } catch (err) {
      console.error(`Error restoring asset ${asset.asset_label}:`, err);
    }
  }

  canvas.renderAll();
  console.log(`✅ Restored ${canvasData.length} assets to canvas`);
}
