"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Copy, X, Palette, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PreviewSteps } from "./preview-steps";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { orgService } from "@/app/services/org.service";
import { getOrgItem, setLoading, setError } from "@/app/store/features/organizationSlice";
import { authService } from "@/app/services/auth.service";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// Custom loader component
import Loader from "@/components/ui/loader";

// Color input component with validation and preview
const ColorInput = ({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  // Function to check if a color is valid
  const isValidColor = (color: string): boolean => {
    if (!color) return false;

    // Check for hex colors
    if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) return true;

    // Check for rgb/rgba colors
    if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i.test(color)) return true;

    // Check for common color names
    const commonColors = [
      "red",
      "blue",
      "green",
      "yellow",
      "purple",
      "orange",
      "black",
      "gray",
      "pink",
      "brown",
      "cyan",
      "magenta",
      "lime",
      "olive",
      "navy",
      "teal",
      "aqua",
      "silver",
      "white",
    ];

    return commonColors.includes(color.toLowerCase());
  };

  // State for color picker
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(value || "#000000");
  const [colorMode, setColorMode] = useState("hex");
  const [colorPosition, setColorPosition] = useState({ x: 0.5, y: 0.5 });
  const [sliderPosition, setSliderPosition] = useState(0.5);
  const [recentColors, setRecentColors] = useState<string[]>([
    "#FFFFFF",
    "#8C8C9C",
    "#E0E0C8",
    "#3C3C3C",
    "#A978B8",
    "#C8D0F0",
    "#E88888",
  ]);

  // RGB values
  const [rgbValues, setRgbValues] = useState({ r: 115, g: 79, b: 159 });

  // Reference for the color area and slider
  const colorAreaRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // State for tracking dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragTarget, setDragTarget] = useState<"colorArea" | "slider" | null>(null);

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    try {
      // Remove the # if present
      hex = hex.replace("#", "");

      // Parse the hex values
      let r, g, b;
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }

      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        return { r: 0, g: 0, b: 0 };
      }

      return { r, g, b };
    } catch (e) {
      return { r: 0, g: 0, b: 0 };
    }
  };

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  // Update RGB values when selected color changes
  useEffect(() => {
    if (selectedColor && selectedColor.startsWith("#")) {
      const rgb = hexToRgb(selectedColor);
      setRgbValues(rgb);
    }
  }, [selectedColor]);

  // Handle color selection from the color picker
  const handleColorChange = (color: string) => {
    setSelectedColor(color);

    // Create a synthetic event to pass to the parent's onChange handler
    const syntheticEvent = {
      target: {
        id: "setcolor",
        value: color,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(syntheticEvent);

    // Add to recent colors if not already there
    if (!recentColors.includes(color)) {
      setRecentColors((prev) => [color, ...prev.slice(0, 6)]);
    }
  };

  // Handle RGB input changes
  const handleRgbChange = (component: "r" | "g" | "b", value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 255) return;

    const newRgb = { ...rgbValues, [component]: numValue };
    setRgbValues(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    handleColorChange(newHex);
  };

  // Handle direct hex input
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (newColor.startsWith("#") && (newColor.length === 4 || newColor.length === 7)) {
      handleColorChange(newColor);
    }
  };

  // Handle mouse down on color area
  const handleColorAreaMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!colorAreaRef.current) return;

    setIsDragging(true);
    setDragTarget("colorArea");
    handleColorAreaMove(e);

    // Prevent text selection
    e.preventDefault();
  };

  // Handle mouse down on slider
  const handleSliderMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    setIsDragging(true);
    setDragTarget("slider");
    handleSliderMove(e);

    // Prevent text selection
    e.preventDefault();
  };

  // Handle color area movement
  const handleColorAreaMove = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!colorAreaRef.current) return;

    const rect = colorAreaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    setColorPosition({ x, y });

    // Calculate color based on position and current hue
    const hue = sliderPosition * 360;
    const saturation = x * 100;
    const lightness = 100 - y * 100;

    // Use HSL for more predictable color selection
    const color = `hsl(${hue}, ${saturation}%, ${Math.max(0, Math.min(100, lightness / 2))}%)`;

    // Convert HSL to RGB for the input fields
    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 200; // Divide by 200 to get a value between 0 and 0.5

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const newRgb = {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };

    setRgbValues(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    handleColorChange(newHex);
  };

  // Handle slider movement
  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setSliderPosition(position);

    // Recalculate color based on new hue but keep same saturation and lightness
    const hue = position * 360;
    const saturation = colorPosition.x * 100;
    const lightness = 100 - colorPosition.y * 100;

    const color = `hsl(${hue}, ${saturation}%, ${Math.max(0, Math.min(100, lightness / 2))}%)`;

    // Update RGB values
    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 200; // Divide by 200 to get a value between 0 and 0.5

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const newRgb = {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };

    setRgbValues(newRgb);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    handleColorChange(newHex);
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragTarget(null);
  };

  // Add global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      if (dragTarget === "colorArea") {
        handleColorAreaMove(e);
      } else if (dragTarget === "slider") {
        handleSliderMove(e);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragTarget(null);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    window.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, dragTarget, colorPosition, sliderPosition]);

  // Calculate the base color for the gradient based on the slider position
  const baseColor = `hsl(${sliderPosition * 360}, 100%, 50%)`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor="setcolor">Color</Label>
      <div className="flex gap-2 items-center">
        <Input
          id="setcolor"
          className="h-9 flex-1"
          placeholder="Enter color name or code"
          value={value}
          onChange={(e) => {
            // Create a synthetic event with the correct id
            const syntheticEvent = {
              ...e,
              target: {
                ...e.target,
                id: "setcolor",
              },
            };
            onChange(syntheticEvent);
          }}
        />

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 flex-shrink-0" aria-label="Pick a color">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0 border-0 shadow-xl rounded-lg" align="end">
            <div className="flex flex-col bg-zinc-900 rounded-lg overflow-hidden">
              {/* Main color area */}
              <div
                ref={colorAreaRef}
                className="h-[200px] w-full relative cursor-crosshair select-none"
                style={{
                  background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%), 
                               linear-gradient(to right, #fff 0%, ${baseColor} 100%)`,
                }}
                onMouseDown={handleColorAreaMouseDown}
              >
                {/* Color selector circle */}
                <div
                  className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${colorPosition.x * 100}%`,
                    top: `${colorPosition.y * 100}%`,
                    backgroundColor: selectedColor,
                  }}
                ></div>
              </div>

              {/* Color slider */}
              <div className="px-3 py-2">
                <div
                  ref={sliderRef}
                  className="w-full h-5 mb-3 relative cursor-pointer rounded-full overflow-hidden select-none"
                  style={{
                    background: "linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)",
                  }}
                  onMouseDown={handleSliderMouseDown}
                >
                  {/* Slider handle */}
                  <div
                    className="absolute top-0 bottom-0 w-3 h-full bg-white rounded-full border-2 border-white shadow-md transform -translate-x-1/2 pointer-events-none"
                    style={{ left: `${sliderPosition * 100}%` }}
                  ></div>
                </div>

                {/* Color format and values */}
                <div className="grid grid-cols-4 gap-1 mt-2">
                  <div className="flex items-center justify-center bg-zinc-800 rounded-md p-1 text-white">
                    <button
                      className={`text-xs font-medium ${colorMode === "hex" ? "text-white" : "text-zinc-400"}`}
                      onClick={() => setColorMode("hex")}
                    >
                      Hex
                    </button>
                  </div>
                  <div className="flex items-center justify-center bg-zinc-800 rounded-md p-1 text-white">
                    <span className="text-xs font-medium">R</span>
                  </div>
                  <div className="flex items-center justify-center bg-zinc-800 rounded-md p-1 text-white">
                    <span className="text-xs font-medium">G</span>
                  </div>
                  <div className="flex items-center justify-center bg-zinc-800 rounded-md p-1 text-white">
                    <span className="text-xs font-medium">B</span>
                  </div>

                  <div className="bg-zinc-800 rounded-md p-1">
                    <input
                      type="text"
                      value={selectedColor}
                      onChange={handleHexChange}
                      className="w-full bg-transparent text-white text-xs text-center font-mono border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div className="bg-zinc-800 rounded-md p-1">
                    <input
                      type="text"
                      value={rgbValues.r}
                      onChange={(e) => handleRgbChange("r", e.target.value)}
                      className="w-full bg-transparent text-white text-xs text-center font-mono border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div className="bg-zinc-800 rounded-md p-1">
                    <input
                      type="text"
                      value={rgbValues.g}
                      onChange={(e) => handleRgbChange("g", e.target.value)}
                      className="w-full bg-transparent text-white text-xs text-center font-mono border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                  <div className="bg-zinc-800 rounded-md p-1">
                    <input
                      type="text"
                      value={rgbValues.b}
                      onChange={(e) => handleRgbChange("b", e.target.value)}
                      className="w-full bg-transparent text-white text-xs text-center font-mono border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>

                {/* Recent colors */}
                <div className="mt-3">
                  <div className="text-zinc-400 text-xs mb-1">Recent</div>
                  <div className="flex gap-1">
                    {recentColors.map((color, index) => (
                      <button
                        key={index}
                        className="w-6 h-6 rounded-md border border-zinc-700 overflow-hidden transition-all hover:scale-110 hover:shadow-lg hover:border-white/50 focus:ring-1 focus:ring-white/50"
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Warning for white color */}
              {value && value.toLowerCase() === "white" && (
                <div className="p-2 bg-red-900/50 text-red-200 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-xs">!</span>
                    <span>White color is not recommended.</span>
                  </div>
                </div>
              )}

              {/* Done button */}
              <div className="p-3 border-t border-zinc-800 flex justify-end">
                <Button size="sm" className="bg-zinc-800 hover:bg-zinc-700 text-white" onClick={() => setIsOpen(false)}>
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Done
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {value && isValidColor(value) && (
          <div
            className="h-9 w-9 rounded-full border-2 border-border flex-shrink-0 relative overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all hover:scale-105"
            title={value}
            onClick={() => setIsOpen(true)}
          >
            <div className="absolute inset-0" style={{ backgroundColor: value }} />
            {value.toLowerCase() === "white" && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-red-500 bg-gray-100">
                <span className="font-bold">!</span>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">*Do not select white color/code.</p>
    </div>
  );
};

export function OrganizationSection() {
  const dispatch = useAppDispatch();
  const { requestorg, loading, error } = useAppSelector((state) => state.organization);
  const { countries, loadingcountry } = useAppSelector((state) => state.auth);
  const [isLogoEditorOpen, setIsLogoEditorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState(
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_dirosvg-SlKV6MwAd8fixuyjmkq61ZTjUPmRnk.png"
  );
  const [scale, setScale] = useState(1);
  const [removeBackground, setRemoveBackground] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New state for dragging position
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    displayname: "",
    registrationnumber: "",
    organizationtype: "",
    website: "",
    country: "",
    setcolor: "",
    hmackey: "",
    invoicedescription: "",
  });

  // Fixed crop size
  const cropSize = { width: 500, height: 500 };

  // State to track the final edited image
  const [editedLogoStyle, setEditedLogoStyle] = useState({
    scale: 1,
    position: { x: 0, y: 0 },
    removeBackground: false,
  });

  // Update form data when requestorg changes
  useEffect(() => {
    if (requestorg) {
      setFormData({
        name: requestorg?.name || "",
        displayname: requestorg.displayname || "",
        registrationnumber: requestorg.registrationnumber || "",
        organizationtype: requestorg.organizationtype || "",
        website: requestorg.website || "",
        country: requestorg.country || "",
        setcolor: requestorg.color || "",
        hmackey: requestorg.hmackey || "",
        invoicedescription: requestorg.invoicedescription || "",
      });
    }
  }, [requestorg]);

  // Update logo source if organization data has a baseimage
  useEffect(() => {
    if (requestorg && requestorg.baseimage) {
      // Check if the baseimage is already in base64 format
      if (requestorg.baseimage.startsWith("data:image")) {
        console.log("Organization logo is already in base64 format");
        setLogoSrc(requestorg.baseimage);
      } else {
        console.log("Organization logo needs conversion to base64");
        // We'll convert it when needed during form submission
        setLogoSrc(requestorg.baseimage);

        // Optionally, you can convert it immediately:
        // ensureBase64Format(requestorg.baseimage).then(base64Image => {
        //   setLogoSrc(base64Image);
        // });
      }
    }
  }, [requestorg]);

  // Fetch countries if not already loaded
  useEffect(() => {
    if (!countries || countries.length === 0) {
      authService.getCountries();
    }
  }, [countries]);

  // Handle manual refresh of organization data
  const handleRefreshData = async () => {
    dispatch(setLoading(true));
    try {
      console.log("Manually refreshing organization data...");
      const response = await orgService.getOrg();
      if (response.success && response.data) {
        dispatch(getOrgItem(response.data));
        // Clear any existing error when data is successfully loaded
        dispatch(setError(null));
      } else {
        dispatch(setError(response.error || "Failed to fetch organization data"));
      }
    } catch (error) {
      console.error("Error refreshing organization data:", error);
      dispatch(setError(error));
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Function to verify and ensure base64 format
  const ensureBase64Format = async (imageUrl: string): Promise<string> => {
    // If already in base64 format, return as is
    if (imageUrl.startsWith("data:image")) {
      return imageUrl;
    }

    // If it's a URL, convert to base64
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            console.log("Converted URL to base64:", base64data.substring(0, 50) + "...");
            resolve(base64data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Error converting image to base64:", error);
        return imageUrl; // Return original if conversion fails
      }
    }

    // If not recognized format, return as is
    return imageUrl;
  };

  // Handle form submission
  const handleSaveProfile = async () => {
    dispatch(setLoading(true));

    try {
      // Ensure the image is in base64 format
      const baseImageData = await ensureBase64Format(logoSrc);

      // Prepare data for API
      const updateData = {
        ...formData,
        baseimage: baseImageData, // Use the base64 image data
        // Add any other fields needed for the API
      };

      console.log("Submitting form with base64 image:", baseImageData.substring(0, 50) + "...");

      const response = await orgService.updateOrg(updateData);

      if (response.success) {
        // Update Redux store with the updated data
        if (response.data) {
          dispatch(getOrgItem(response.data));
        }
      } else {
        dispatch(setError(response.error || "Failed to update organization"));
      }
    } catch (error) {
      dispatch(setError(error));
    }
  };

  const transitionConfig = {
    type: "spring",
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
    mass: 1,
  };

  const formContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
        staggerDirection: 1,
        when: "beforeChildren",
      },
    },
  };

  const formItem = {
    hidden: { opacity: 0, x: 200 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 40,
        damping: 20,
        mass: 1,
        duration: 0.8,
      },
    },
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, JPG, PNG, and SVG file types are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const base64String = e.target.result as string;
          // Ensure it's a valid base64 data URL
          if (base64String.startsWith("data:image")) {
            setLogoSrc(base64String);
            console.log("Image set as base64:", base64String.substring(0, 50) + "...");
          } else {
            console.error("Invalid base64 image format");
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleToggleBackground = () => {
    setRemoveBackground(!removeBackground);
  };

  const handleZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    const newScale = scale + (e.deltaY > 0 ? -0.1 : 0.1);
    if (newScale >= 0.5 && newScale <= 3) {
      setScale(newScale);
    }
  };

  // Mouse handlers for dragging only
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Update global mouse up handler
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, []);

  const handleSave = () => {
    // Save the current state to the editedLogoStyle for the preview
    setEditedLogoStyle({
      scale,
      position: { ...position },
      removeBackground,
    });

    // Log the current logo source to verify it's in base64 format
    if (logoSrc.startsWith("data:image")) {
      console.log("Logo is already in base64 format:", logoSrc.substring(0, 50) + "...");
    } else {
      console.log("Logo is not in base64 format, will be converted during save:", logoSrc.substring(0, 50) + "...");
    }

    setIsLogoEditorOpen(false);
  };

  // Update the error check to properly check if error is empty
  const hasError = error && (typeof error === "string" || Object.keys(error).length > 0);

  // Function to render country options
  const renderCountryOptions = () => {
    if (loadingcountry) {
      return <SelectItem value="loading">Loading countries...</SelectItem>;
    }

    if (countries && countries.length > 0) {
      return countries.map((country) => (
        <SelectItem key={country.alpha2code} value={country.country}>
          {country.country}
        </SelectItem>
      ));
    }

    return <SelectItem value="af">Afghanistan</SelectItem>;
  };

  const [inputType, setInputType] = useState("password");
  const [isCopied, setIsCopied] = useState(false);

  // Toggle password visibility
  const toggleInputType = () => {
    setInputType(inputType === "password" ? "text" : "password");
  };

  // Copy HMAC key to clipboard
  const copyToClipboard = () => {
    if (formData.hmackey) {
      navigator.clipboard.writeText(formData.hmackey);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  // Handle HMAC key input change with space validation
  const handleHmacKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!/\s/.test(newValue)) {
      handleInputChange(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 200 }}
      animate={{ opacity: 1, x: 0 }}
      transition={transitionConfig}
      className="w-full space-y-8 max-w-6xl mx-auto px-4 sm:px-6"
    >
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...transitionConfig, delay: 0.1 }}
        className="flex justify-between items-center py-4"
      >
        <h2 className="text-2xl font-semibold tracking-tight">Preferences</h2>
      </motion.div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader />
          <span className="ml-3">Loading organization data...</span>
        </div>
      )}

      {hasError && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> Failed to load organization data. Please try again later.</span>
        </div>
      )}

      {!loading && !hasError && (
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...transitionConfig, delay: 0.1 }}
          className="space-y-6 bg-card rounded-lg p-6 shadow-sm border"
        >
          {/* Logo Section */}
          <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-8 pb-6 border-b">
            <div className="w-[200px] h-[200px] bg-muted rounded-lg overflow-hidden relative">
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{
                  transform: `translate(${editedLogoStyle.position.x}px, ${editedLogoStyle.position.y}px)`,
                }}
              >
                <img
                  src={logoSrc}
                  alt="Organization logo"
                  className={`
                    ${editedLogoStyle.removeBackground ? "drop-shadow-lg" : ""}
                  `}
                  style={{
                    transform: `scale(${editedLogoStyle.scale})`,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsLogoEditorOpen(true)}>
                  Change Logo
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(true)}>
                  See how it looks
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Maximum logo size 2 MB only jpeg, jpg, png, svg types allowed.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Preview Steps Dialog */}
      <PreviewSteps isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} logoSrc={logoSrc} />

      {/* Logo Editor Dialog */}
      <Dialog open={isLogoEditorOpen} onOpenChange={setIsLogoEditorOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden border-border bg-background" onWheel={handleZoom}>
          <div className="absolute right-4 top-4 z-10">
            <Button variant="ghost" size="icon" onClick={() => setIsLogoEditorOpen(false)} className="h-6 w-6 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center p-6 border-b">
              <Button onClick={handleOpenFileInput} variant="outline" className="flex gap-2 h-9 px-4 transition-all">
                <span>Upload new</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                className="hidden"
                accept=".jpg,.jpeg,.png,.svg"
              />
              <Button
                onClick={handleToggleBackground}
                variant={removeBackground ? "default" : "outline"}
                className="h-9 px-4 transition-all"
              >
                {removeBackground ? "Restore background" : "Remove background"}
              </Button>
            </div>

            <div className="px-6 py-3 bg-muted/30 border-b flex justify-between items-center text-sm text-muted-foreground">
              <span>Scroll to zoom in/out</span>
              <span>Drag to position</span>
            </div>

            <div className="bg-muted/20 flex items-center justify-center" style={{ height: "500px" }}>
              <div className="relative select-none touch-none">
                <div
                  className={`
                    border-2 border-primary/70 border-dashed 
                    rounded-sm cursor-move overflow-hidden
                    shadow-sm backdrop-blur-sm
                    transition-all duration-200
                  `}
                  style={{
                    width: `${cropSize.width}px`,
                    height: `${cropSize.height}px`,
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                  >
                    <img
                      src={logoSrc}
                      alt="Logo to edit"
                      className={`
                        ${removeBackground ? "drop-shadow-lg" : ""}
                        ${isDragging ? "transition-none" : "transition-all duration-300 ease-out"}
                      `}
                      style={{
                        transform: `scale(${scale})`,
                        pointerEvents: "none",
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      draggable="false"
                    />
                  </div>

                  {/* Crosshair overlay */}
                  <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute left-1/3 top-0 bottom-0 border-l border-dashed border-primary/30"></div>
                    <div className="absolute right-1/3 top-0 bottom-0 border-l border-dashed border-primary/30"></div>
                    <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-primary/30"></div>
                    <div className="absolute bottom-1/3 left-0 right-0 border-t border-dashed border-primary/30"></div>
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full border border-primary/70"></div>
                  </div>

                  {/* Remove resize handles */}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center px-6 py-4 border-t">
              <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">Zoom: {Math.round(scale * 100)}%</div>
                <div className="w-32">
                  <input
                    type="range"
                    min="50"
                    max="300"
                    value={scale * 100}
                    onChange={(e) => setScale(Number(e.target.value) / 100)}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="px-6 font-medium">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {!loading && !hasError && (
        /* Organization Details */
        <motion.div
          variants={formContainer}
          initial="hidden"
          animate="show"
          className="space-y-8 bg-card rounded-lg p-6 shadow-sm border mt-6"
        >
          <motion.div variants={formItem} className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-3">Organization Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <motion.div variants={formItem} className="space-y-1.5">
                <Label htmlFor="name">Organization</Label>
                <Input
                  id="name"
                  className="h-9 w-full"
                  placeholder="Enter organization name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div variants={formItem} className="space-y-1.5">
                <Label htmlFor="displayname">Organization display name</Label>
                <Input
                  id="displayname"
                  className="h-9 w-full"
                  placeholder="Enter display name"
                  value={formData.displayname}
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div variants={formItem} className="space-y-1.5">
                <Label htmlFor="registrationnumber">Registration number</Label>
                <Input
                  id="registrationnumber"
                  className="h-9 w-full"
                  placeholder="Enter registration number"
                  value={formData.registrationnumber}
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div variants={formItem} className="space-y-1.5">
                <Label htmlFor="organizationtype">Organization type</Label>
                <Select
                  value={formData.organizationtype}
                  onValueChange={(value) => handleSelectChange("organizationtype", value)}
                >
                  <SelectTrigger id="organizationtype" className="h-9 w-full">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wallet">Wallet</SelectItem>
                    <SelectItem value="Bank">Bank</SelectItem>
                    <SelectItem value="Exchange">Exchange</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
              <motion.div variants={formItem} className="space-y-1.5">
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  className="h-9 w-full"
                  placeholder="Enter website URL"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div variants={formItem} className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => handleSelectChange("country", value)}>
                  <SelectTrigger id="country" className="h-9 w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>{renderCountryOptions()}</SelectContent>
                </Select>
              </motion.div>
            </div>
          </motion.div>

          {/* Color and HMAC Key Section */}
          <motion.div variants={formItem} className="space-y-6 pt-4 border-t">
            <h3 className="text-lg font-semibold pt-2">Appearance & Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <motion.div variants={formItem} className="space-y-1.5">
                <ColorInput value={formData.setcolor} onChange={handleInputChange} />
              </motion.div>
              <motion.div variants={formItem} className="space-y-1.5">
                <Label htmlFor="hmackey">HMAC Key</Label>
                <div className="flex gap-2 w-full">
                  <Input
                    id="hmackey"
                    type={inputType}
                    placeholder="Add key"
                    className="h-9 flex-1"
                    value={formData.hmackey}
                    onChange={handleHmacKeyChange}
                  />
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleInputType} disabled={!formData.hmackey}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9" onClick={copyToClipboard} disabled={!formData.hmackey}>
                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">*Spaces are not allowed in the HMAC Key</p>
                <p className="text-xs text-muted-foreground">NOTE: Required to retrieve sensitive customer documents</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Billing Details */}
          <motion.div variants={formItem} className="space-y-6 pt-4 border-t">
            <h3 className="text-lg font-semibold pt-2">Billing details</h3>
            <div className="w-full">
              <Textarea
                id="invoicedescription"
                placeholder="Enter billing details"
                className="min-h-[120px] resize-none w-full"
                value={formData.invoicedescription}
                onChange={handleInputChange}
              />
            </div>
          </motion.div>

          <motion.div variants={formItem} className="flex justify-end pt-6 mt-4 border-t">
            <Button disabled={loading} onClick={handleSaveProfile} className="px-6 py-2">
              {loading ? (
                <div className="flex items-center">
                  <Loader />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save profile"
              )}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
