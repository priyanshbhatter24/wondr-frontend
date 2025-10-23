import { fabric } from 'fabric';

/**
 * Load an image and add it to the canvas at the center
 *
 * @param canvas - Fabric.js canvas instance
 * @param imageUrl - URL of the image to load
 * @param label - Label/identifier for the image
 * @returns Promise resolving to the added fabric.Image object
 */
export async function addImageToCanvas(
  canvas: fabric.Canvas,
  imageUrl: string,
  label: string
): Promise<fabric.Image> {
  return new Promise((resolve, reject) => {
    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        if (!img) {
          reject(new Error('Failed to load image'));
          return;
        }

        // Scale to reasonable default size (100px width)
        img.scaleToWidth(100);

        // Center the image on canvas
        const canvasCenter = canvas.getCenter();
        img.set({
          left: canvasCenter.left - (img.getScaledWidth() / 2),
          top: canvasCenter.top - (img.getScaledHeight() / 2),
          selectable: true,
          hasControls: true,
          hasBorders: true,
          // Store metadata
          data: { assetLabel: label } as any
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        resolve(img);
      },
      { crossOrigin: 'anonymous' }  // Required for S3/CORS images
    );
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

  // Create temporary offscreen canvas
  const tempCanvas = new fabric.Canvas(null as any, {
    width,
    height
  });

  // Load and set background image
  await new Promise<void>((resolve, reject) => {
    fabric.Image.fromURL(
      baseImageUrl,
      (img) => {
        if (!img) {
          reject(new Error('Failed to load background image'));
          return;
        }

        // Scale background to fill canvas
        const scaleX = width / (img.width || 1);
        const scaleY = height / (img.height || 1);
        img.set({ scaleX, scaleY });

        tempCanvas.setBackgroundImage(img, () => {
          tempCanvas.renderAll();
          resolve();
        });
      },
      { crossOrigin: 'anonymous' }
    );
  });

  // Copy all objects from main canvas to temp canvas
  const objects = canvas.getObjects();
  for (const obj of objects) {
    const cloned = await new Promise<fabric.Object>((resolve) => {
      obj.clone((clonedObj: fabric.Object) => resolve(clonedObj));
    });
    tempCanvas.add(cloned);
  }

  tempCanvas.renderAll();

  // Convert to blob
  return new Promise((resolve, reject) => {
    const canvasEl = tempCanvas.toCanvasElement();
    canvasEl.toBlob((blob) => {
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
