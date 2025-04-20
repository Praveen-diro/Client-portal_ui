"use client";

import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
  open: boolean;
}

// Function to create a cropped image
const createCroppedImage = (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Set canvas dimensions to the cropped size
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // Draw the cropped image onto the canvas
      ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);

      // Convert canvas to a data URL and resolve the promise
      resolve(canvas.toDataURL("image/jpeg"));
    };

    image.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel, aspectRatio = 1, open }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // Reset crop settings when a new image is loaded
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  }, [imageSrc]);

  const onCropChange = (location: { x: number; y: number }) => {
    setCrop(location);
  };

  const onZoomChange = (newZoom: number | number[]) => {
    setZoom(Array.isArray(newZoom) ? newZoom[0] : newZoom);
  };

  const onRotationChange = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const onCropCompleted = useCallback(async (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropImage = async () => {
    try {
      if (croppedAreaPixels) {
        const croppedImageUrl = await createCroppedImage(imageSrc, croppedAreaPixels);
        onCropComplete(croppedImageUrl);
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-80 overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800 mt-4">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspectRatio}
              onCropChange={onCropChange}
              onCropComplete={onCropCompleted}
              onZoomChange={setZoom}
              objectFit="contain"
            />
          )}
        </div>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="zoom">Zoom</Label>
              <span className="text-xs text-muted-foreground">{zoom.toFixed(1)}x</span>
            </div>
            <Slider id="zoom" min={1} max={3} step={0.1} value={[zoom]} onValueChange={onZoomChange} className="w-full" />
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between mt-6">
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="icon" onClick={onRotationChange} title="Rotate image">
              {/* <Rotate3D className="h-4 w-4" /> */}
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))}
              title="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
              title="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCropImage}>
              Crop Image
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
