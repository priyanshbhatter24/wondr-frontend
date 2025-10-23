"use client";

import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';

interface FabricCanvasProps {
  width: number;
  height: number;
  onCanvasReady?: (editor: { canvas: fabric.Canvas }) => void;
  onSelectionChange?: (hasSelection: boolean) => void;
}

/**
 * Fabric.js canvas wrapper component
 *
 * Provides a Fabric.js canvas overlay for placing draggable/resizable brand assets
 * on top of generated images. Direct Fabric.js integration (React 19 compatible).
 */
export function FabricCanvas({
  width,
  height,
  onCanvasReady,
  onSelectionChange
}: FabricCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    // Create Fabric canvas
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      selection: true,  // Allow multi-select with mouse drag
      preserveObjectStacking: true,  // Maintain z-index order
    });

    fabricCanvasRef.current = canvas;

    // Customize selection appearance
    fabric.FabricObject.prototype.set({
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
    onCanvasReady?.({ canvas });

    // Cleanup function
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []); // Only run once on mount

  // Update canvas dimensions when they change
  useEffect(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.setDimensions({ width, height });
      fabricCanvasRef.current.renderAll();
    }
  }, [width, height]);

  return (
    <div className="absolute inset-0 pointer-events-auto">
      <canvas ref={canvasRef} />

      {/* Global canvas styles */}
      <style jsx global>{`
        .canvas-container {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
        }
        .canvas-container canvas {
          border: none !important;
        }
        .upper-canvas {
          border: none !important;
        }
      `}</style>
    </div>
  );
}
