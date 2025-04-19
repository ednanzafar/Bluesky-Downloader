
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Play } from "lucide-react";

interface UrlInputProps {
  onProcess: (url: string) => void;
  isProcessing: boolean;
}

export function UrlInput({ onProcess, isProcessing }: UrlInputProps) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Bluesky URL",
        variant: "destructive",
      });
      return;
    }

    if (!url.includes("bsky.app")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Bluesky post URL (should contain bsky.app)",
        variant: "destructive",
      });
      return;
    }

    // Check for proper Bluesky post URL format
    // Example: https://bsky.app/profile/username.bsky.social/post/postid
    if (!url.includes("/profile/") || !url.includes("/post/")) {
      toast({
        title: "Invalid Bluesky URL format",
        description: "URL should be in the format: https://bsky.app/profile/username/post/postid",
        variant: "destructive",
      });
      return;
    }

    onProcess(url);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <Input
          type="url"
          placeholder="Paste Bluesky video URL (e.g., https://bsky.app/profile/username.bsky.social/post/...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 input-focus text-base py-6"
          disabled={isProcessing}
          required
        />
        <Button 
          type="submit" 
          className="bg-bluesky hover:bg-bluesky-dark py-6 px-8 font-medium text-white"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play size={16} />
              Process Video
            </div>
          )}
        </Button>
      </form>
      <p className="text-xs text-muted-foreground mt-2">
        Enter a Bluesky video post URL to download or convert the video
      </p>
    </div>
  );
}
