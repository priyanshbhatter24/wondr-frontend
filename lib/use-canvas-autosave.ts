import { useEffect, useRef, useCallback } from 'react';
import * as fabric from 'fabric';
import { serializeCanvasData } from './fabric-utils';

interface UseCanvasAutosaveOptions {
  canvas: fabric.Canvas | null;
  generationId: string | undefined;
  enabled: boolean;
  apiClient: any; // Client-side API from useApiClient hook
}

/**
 * Auto-save hook for canvas data with debouncing
 *
 * Automatically saves canvas state to the backend after 2 seconds of inactivity.
 * Listens to object:modified, object:added, and object:removed events.
 */
export function useCanvasAutosave({
  canvas,
  generationId,
  enabled,
  apiClient
}: UseCanvasAutosaveOptions) {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSavingRef = useRef(false);

  const saveCanvasData = useCallback(async () => {
    if (!canvas || !generationId || isSavingRef.current || !enabled || !apiClient) return;

    try {
      isSavingRef.current = true;
      const canvasData = serializeCanvasData(canvas);

      await apiClient.imageGeneration.saveCanvasData(generationId, {
        canvas_data: canvasData
      });

      console.log(`✅ Auto-saved ${canvasData.length} assets for generation ${generationId}`);
    } catch (err) {
      console.error('❌ Failed to auto-save canvas data:', err);
    } finally {
      isSavingRef.current = false;
    }
  }, [canvas, generationId, enabled, apiClient]);

  const debouncedSave = useCallback(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for 2 seconds
    saveTimeoutRef.current = setTimeout(() => {
      saveCanvasData();
    }, 2000);
  }, [saveCanvasData]);

  useEffect(() => {
    if (!canvas || !enabled) return;

    // Event handlers
    const handleModified = () => {
      console.log('Canvas modified - scheduling auto-save');
      debouncedSave();
    };

    const handleAdded = () => {
      console.log('Object added - scheduling auto-save');
      debouncedSave();
    };

    const handleRemoved = () => {
      console.log('Object removed - scheduling auto-save');
      debouncedSave();
    };

    // Register event listeners
    canvas.on('object:modified', handleModified);
    canvas.on('object:added', handleAdded);
    canvas.on('object:removed', handleRemoved);

    // Cleanup
    return () => {
      canvas.off('object:modified', handleModified);
      canvas.off('object:added', handleAdded);
      canvas.off('object:removed', handleRemoved);

      // Clear pending timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [canvas, debouncedSave, enabled]);

  return { saveCanvasData };
}
