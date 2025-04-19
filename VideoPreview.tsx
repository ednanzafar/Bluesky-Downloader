
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Video } from "lucide-react";
import { VideoFormat, VideoQuality } from "./FormatSelector";

interface VideoPreviewProps {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  author?: string;
  duration?: string;
  format: VideoFormat;
  quality: VideoQuality;
  isDownloading: boolean;
  onDownload: () => void;
}

export function VideoPreview({
  videoUrl,
  thumbnailUrl,
  title,
  author,
  duration,
  format,
  quality,
  isDownloading,
  onDownload,
}: VideoPreviewProps) {
  return (
    <Card className="overflow-hidden card-shadow animate-bounce-in">
      <div className="relative aspect-video bg-muted">
        {thumbnailUrl ? (
          <img 
            src={thumbnailUrl} 
            alt={title || "Video thumbnail"}
            className="object-cover w-full h-full"
            onError={(e) => {
              // If image fails to load, show a placeholder
              e.currentTarget.src = "/placeholder.svg";
              console.log("Thumbnail failed to load:", thumbnailUrl);
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Video className="h-12 w-12 text-muted-foreground opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div 
            className="w-16 h-16 rounded-full bg-black bg-opacity-50 flex items-center justify-center cursor-pointer hover:bg-opacity-70 transition-all"
            onClick={() => window.open(videoUrl, "_blank")}
          >
            <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
          </div>
        </div>
        
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-medium text-lg line-clamp-1" title={title}>
            {title || "Bluesky Video"}
          </h3>
          {author && (
            <p className="text-sm text-muted-foreground mb-1">
              By: {author}
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            Format: {format.toUpperCase()} | Quality: {quality}
          </p>
        </div>
        
        <Button 
          onClick={onDownload} 
          disabled={isDownloading} 
          className="w-full btn-gradient"
        >
          {isDownloading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Downloading...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Download size={16} />
              Download
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
