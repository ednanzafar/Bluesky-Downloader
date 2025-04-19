
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Download, Plus, X } from "lucide-react";

export function BatchDownloader() {
  const [urls, setUrls] = useState<string[]>(['']);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, '']);
    } else {
      toast({
        title: "Maximum URLs reached",
        description: "You can only process up to 5 URLs at once",
        variant: "destructive",
      });
    }
  };

  const handleRemoveUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleBatchProcess = () => {
    const validUrls = urls.filter(url => url.trim() !== "" && url.includes("bsky.app"));
    
    if (validUrls.length === 0) {
      toast({
        title: "No valid URLs",
        description: "Please enter at least one valid Bluesky URL",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Mock processing - in a real app, this would call an API
    setTimeout(() => {
      toast({
        title: "Batch processing started",
        description: `Processing ${validUrls.length} URLs`,
      });
      setIsProcessing(false);
    }, 1500);
  };

  const handleBulkTextInput = (text: string) => {
    const extractedUrls = text.split(/[\n,]/)
      .map(url => url.trim())
      .filter(url => url !== "")
      .slice(0, 5);
    
    setUrls(extractedUrls.length > 0 ? extractedUrls : ['']);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl text-center">Batch Download</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {urls.map((url, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder={`Bluesky URL #${index + 1}`}
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                className="input-focus"
              />
              {urls.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveUrl(index)}
                  className="shrink-0"
                  aria-label="Remove URL"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handleAddUrl}
            disabled={urls.length >= 5}
            className="text-sm"
          >
            <Plus size={16} className="mr-1" /> Add URL
            <span className="ml-1 text-muted-foreground">({urls.length}/5)</span>
          </Button>
          
          <Button
            onClick={handleBatchProcess}
            disabled={isProcessing}
            className="bg-bluesky hover:bg-bluesky-dark text-white"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Download size={16} />
                Process All
              </div>
            )}
          </Button>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">
            Or paste multiple URLs separated by commas or line breaks:
          </p>
          <Textarea
            placeholder="Paste multiple URLs here..."
            onChange={(e) => handleBulkTextInput(e.target.value)}
            className="input-focus"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
