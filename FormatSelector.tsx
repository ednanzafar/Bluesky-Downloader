
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export type VideoFormat = "mp4" | "webm" | "avi";
export type VideoQuality = "360p" | "480p" | "720p" | "1080p";

interface FormatSelectorProps {
  selectedFormat: VideoFormat;
  selectedQuality: VideoQuality;
  onFormatChange: (format: VideoFormat) => void;
  onQualityChange: (quality: VideoQuality) => void;
  disabled?: boolean;
}

export function FormatSelector({
  selectedFormat,
  selectedQuality,
  onFormatChange,
  onQualityChange,
  disabled = false,
}: FormatSelectorProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Format:</span>
        <Select
          value={selectedFormat}
          onValueChange={(value) => onFormatChange(value as VideoFormat)}
          disabled={disabled}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mp4">MP4</SelectItem>
            <SelectItem value="webm">WEBM</SelectItem>
            <SelectItem value="avi">AVI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Quality:</span>
        <Select
          value={selectedQuality}
          onValueChange={(value) => onQualityChange(value as VideoQuality)}
          disabled={disabled}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Quality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="360p">360p</SelectItem>
            <SelectItem value="480p">480p</SelectItem>
            <SelectItem value="720p">720p</SelectItem>
            <SelectItem value="1080p">1080p</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
