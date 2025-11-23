"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";

type UploadedImage = {
  file: File;
  preview: string | ArrayBuffer | null;
  name: string;
};

export default function VideoCallSettings() {
  const [timerValue, setTimerValue] = useState([60]);
  const [selectedColor, setSelectedColor] = useState("#4F46E5");
  const [freeAddTimeUses, setFreeAddTimeUses] = useState("");
  const [maxCallDuration, setMaxCallDuration] = useState("");
  const [savedColors, setSavedColors] = useState([
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#a855f7",
    "#6366f1",
    "#0ea5e9",
    "#10b981",
    "#84cc16",
  ]);
  const [colorFormat, setColorFormat] = useState("Hex");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError("");

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setUploadError("File size exceeds 2MB limit");
        return;
      }

      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setUploadError("Only .jpg and .png files are allowed");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage({
          file,
          preview: reader.result,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };


  // Remove uploaded image
  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).value = "";
    }
  };

  // Add current color to saved colors
  const handleAddColor = () => {
    if (selectedColor && !savedColors.includes(selectedColor)) {
      setSavedColors([...savedColors, selectedColor]);
    }
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Get color value based on format
  const getColorValue = () => {
    if (colorFormat === "RGB") {
      const rgb = hexToRgb(selectedColor);
      return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : selectedColor;
    }
    return selectedColor;
  };

  // Handle save changes
  const handleSaveChanges = () => {
    const settings = {
      initialTimerDuration: timerValue[0],
      freeAddTimeUses: freeAddTimeUses,
      maxCallDuration: maxCallDuration,
      backgroundColor: selectedColor,
      backgroundImage: uploadedImage ? (uploadedImage as { name: string }).name : null,
      savedColors: savedColors,
    };

    console.log("Saved Settings:", settings);
    alert("Settings saved successfully!");
  };

  // Handle numeric input validation
  const handleNumericInput = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const numValue = value.replace(/[^0-9]/g, "");
    setter(numValue);
  };

  return (
    <div className="px-6 py-6">
      <div className="backdrop-blur-md bg-white/20 border rounded-lg p-6 space-y-8">
        {/* Initial Timer Duration */}
        <div>
          <h3 className="text-4xl font-[Bebas_Neue] text-white mb-2">
            INITIAL TIMER DURATION
          </h3>
          <p className="text-gray-300 text-sm mb-6">
            Set the initial length of a video call before a user needs to add
            time.
          </p>

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Slider
                value={timerValue}
                onValueChange={setTimerValue}
                max={300}
                min={30}
                step={30}
                className="w-full"
              />
            </div>
            <div className="bg-[#00bcd4] text-white px-4 py-2 rounded-lg font-semibold min-w-[80px] text-center">
              {timerValue[0]} Sec
            </div>
          </div>
        </div>

        {/* Call Time Restraints */}
        <div>
          <h3 className="text-4xl font-[Bebas_Neue] text-white mb-2">
            CALL TIME RESTRAINTS
          </h3>
          <p className="text-gray-300 text-sm mb-6">
            Set limits on extending call durations to encourage purchasing time.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Free &quot;Add Time&quot; Uses
              </label>
              <Input
                type="number"
                value={freeAddTimeUses}
                onChange={(e) =>
                  handleNumericInput(e.target.value, setFreeAddTimeUses)
                }
                placeholder="add value"
                className="bg-white text-gray-800 border-0 h-12"
                min="0"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Max Call Duration (minutes)
              </label>
              <Input
                type="number"
                value={maxCallDuration}
                onChange={(e) =>
                  handleNumericInput(e.target.value, setMaxCallDuration)
                }
                placeholder="Add Value"
                className="bg-white text-gray-800 border-0 h-12"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Call Background Theme */}
        <div>
          <h3 className="text-4xl text-white mb-2 font-[Bebas_Neue]">
            CALL BACKGROUND THEME
          </h3>
          <p className="text-gray-300 text-sm mb-6">
            Select the default background image for video calls. Users may
            override this.
          </p>

          <div className="grid grid-cols-2 gap-6">
            {/* Color Picker */}
            <Card className="bg-white rounded-lg p-6">
              <CardContent className="p-0">
                {/* Gradient Preview */}
                <div
                  className="w-full h-32 rounded-lg mb-4 cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${selectedColor}, #1a1a1a)`,
                  }}
                  onClick={() => {
                    const el = document.getElementById("colorInput");
                    if (el) (el as HTMLInputElement).click();
                  }}
                ></div>

                {/* Hidden color input */}
                <input
                  id="colorInput"
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="hidden"
                />

                {/* Color Spectrum */}
                <div className="mb-4">
                  <div
                    className="w-full h-4 rounded-lg mb-2 cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(to right, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)",
                    }}
                    onClick={() => {
                      const el = document.getElementById("colorInput");
                      if (el) (el as HTMLInputElement).click();
                    }}
                  ></div>
                  <div
                    className="w-full h-4 rounded-lg cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #ffffff, ${selectedColor}, #000000)`,
                    }}
                    onClick={() => {
                      const el = document.getElementById("colorInput");
                      if (el) (el as HTMLInputElement).click();
                    }}
                  ></div>
                </div>

                {/* Hex Input */}
                <div className="flex items-center space-x-2 mb-4">
                  <select
                    className="border border-gray-300 rounded px-2 py-1 text-sm text-gray-800"
                    value={colorFormat}
                    onChange={(e) => setColorFormat(e.target.value)}
                  >
                    <option>Hex</option>
                    <option>RGB</option>
                  </select>
                  <Input
                    value={getColorValue()}
                    onChange={(e) => {
                      if (colorFormat === "Hex") {
                        setSelectedColor(e.target.value);
                      }
                    }}
                    className="flex-1 text-gray-800 border-gray-300"
                    readOnly={colorFormat === "RGB"}
                  />
                  <span className="text-sm text-gray-600">100%</span>
                </div>

                {/* Saved Colors */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Saved colors:</span>
                    <button
                      className="text-sm text-blue-600 hover:text-blue-700"
                      onClick={handleAddColor}
                    >
                      + Add
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {savedColors.map((color, index) => (
                      <button
                        key={index}
                        className="w-6 h-6 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-all"
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Image */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Upload Image
              </label>
              {!uploadedImage ? (
                <div
                  className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center bg-transparent cursor-pointer hover:border-gray-300 transition-colors"
                  onClick={() => {
                    const input = fileInputRef.current as unknown as HTMLInputElement;
                    input?.click();
                  }}
                >
                  <Upload className="w-12 h-12 text-gray-50 mx-auto mb-4" />
                  <p className="text-gray-50 text-sm">
                    Upload photo (Max: 2MB, .jpg, .png).
                  </p>
                  {uploadError && (
                    <p className="text-red-400 text-xs mt-2">{uploadError}</p>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border-2 border-gray-400 rounded-lg p-4 bg-white/10 relative">
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <Image
                    src={(uploadedImage as { preview: string }).preview || ""}
                    alt="Uploaded preview"
                    width={200}
                    height={100}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <p className="text-gray-50 text-sm text-center truncate">
                    {(uploadedImage as { name: string }).name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveChanges}
            className="bg-[#00bcd4] hover:bg-[#00acc1] text-white px-8 py-3 rounded-lg font-semibold"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}