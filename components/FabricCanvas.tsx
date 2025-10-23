"use client";

import { useEffect } from 'react';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { fabric } from 'fabric';

interface FabricCanvasProps {
  width: number;
  height: number;
  onCanvasReady?: (editor: any) => void;
  onSelectionChange?: (hasSelection: boolean) => void;
}

/**
 * Fabric.js canvas wrapper component
 *
 * Provides a Fabric.js canvas overlay for placing draggable/resizable brand assets
 * on top of generated images. Uses fabricjs-react for React integration.
 */
export function FabricCanvas({
  width,
  height,
  onCanvasReady,
  onSelectionChange
}: FabricCanvasProps) {
  const { editor, onReady } = useFabricJSEditor();

  // Initialize canvas when editor is ready
  useEffect(() => {
    if (!editor?.canvas) return;

    const canvas = editor.canvas;

    // Set canvas dimensions to match the image
    canvas.setWidth(width);
    canvas.setHeight(height);

    // Configure canvas behavior
    canvas.selection = true;  // Allow multi-select with mouse drag
    canvas.preserveObjectStacking = true;  // Maintain z-index order

    // Customize selection appearance
    fabric.Object.prototype.set({
      borderColor: '#C5D86D',
      borderScaleFactor: 2,
      cornerColor: '#C5D86D',
      cornerSize: 12,
      transparentCorners: false,
      cornerStyle: 'circle',
    });

    // Selection event handlers
    canvas.on('selection:created', () => {
      onSelectionChange?.(true);
    });

    canvas.on('selection:updated', () => {
      onSelectionChange?.(true);
    });

    canvas.on('selection:cleared', () => {
      onSelectionChange?.(false);
    });

    // Object modification events (useful for future undo/redo)
    canvas.on('object:modified', () => {
      console.log('Canvas object modified');
    });

    canvas.on('object:added', () => {
      console.log('Canvas object added');
    });

    canvas.on('object:removed', () => {
      console.log('Canvas object removed');
    });

    // Notify parent component that canvas is ready
    onCanvasReady?.(editor);

    // Cleanup function
    return () => {
      canvas.off('selection:created');
      canvas.off('selection:updated');
      canvas.off('selection:cleared');
      canvas.off('object:modified');
      canvas.off('object:added');
      canvas.off('object:removed');
    };
  }, [editor, width, height, onCanvasReady, onSelectionChange]);

  return (
    <div className="absolute inset-0 pointer-events-auto">
      <FabricJSCanvas
        className="fabric-canvas"
        onReady={onReady}
      />

      {/* Global canvas styles */}
      <style jsx global>{`
        .fabric-canvas canvas {
          border: none !important;
        }
        .canvas-container {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
        }
        /* Customize control corners */
        .canvas-container .upper-canvas {
          border: none !important;
        }
      `}</style>
    </div>
  );
}
