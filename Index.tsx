import React, { useState } from "react";
import { Header } from "@/components/Header";
import { UrlInput } from "@/components/UrlInput";
import { VideoPreview } from "@/components/VideoPreview";
import { FormatSelector, VideoFormat, VideoQuality } from "@/components/FormatSelector";
import { BatchDownloader } from "@/components/BatchDownloader";
import { DownloadHistory } from "@/components/DownloadHistory";
import { fetchVideoInfo, downloadVideo, getEstimatedFileSize } from "@/utils/downloadUtils";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [videoFormat, setVideoFormat] = useState<VideoFormat>("mp4");
  const [videoQuality, setVideoQuality] = useState<VideoQuality>("720p");
  const [videoInfo, setVideoInfo] = useState<{
    id: string;
    url: string;
    thumbnailUrl: string;
    title: string;
    author?: string;
    duration?: string;
  } | null>(null);

  const handleProcessUrl = async (url: string) => {
    setIsProcessing(true);

    try {
      const info = await fetchVideoInfo(url);
      setVideoInfo(info);
      toast({
        title: "Video processed successfully",
        description: "Your video is ready to download",
      });
    } catch (error) {
      console.error("Error processing video:", error);
      toast({
        title: "Error processing video",
        description: "Unable to process the video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo) return;

    setIsDownloading(true);

    try {
      const success = await downloadVideo(videoInfo, videoFormat, videoQuality);
      
      if (success) {
        toast({
          title: "Download complete",
          description: `Your video has been downloaded in ${videoFormat.toUpperCase()} format at ${videoQuality} quality.`,
        });
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "Unable to download the video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6 md:py-10">
        <section className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-bluesky to-light-green">
            Bluesky Downloader
          </h1>
          <p className="text-lg text-muted-foreground">
            Download videos from Bluesky in various formats and qualities
          </p>
        </section>

        <Tabs defaultValue="download" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="download">Single Download</TabsTrigger>
            <TabsTrigger value="batch">Batch Download</TabsTrigger>
            <TabsTrigger value="history">Download History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="download" className="space-y-8 animate-fade-in">
            <div className="bg-muted/40 border rounded-lg p-6">
              <UrlInput onProcess={handleProcessUrl} isProcessing={isProcessing} />

              {!videoInfo && !isProcessing && (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-muted flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                      <path d="M22 9.92285C22 15.7747 15.5 21.629 12 21.9999C8.5 21.629 2 15.7747 2 9.92285C2 5.92285 5.5 1.99985 12 1.99985C18.5 1.99985 22 5.92285 22 9.92285Z" />
                      <path d="M12 11.4999C13.1046 11.4999 14 10.6044 14 9.49986C14 8.39529 13.1046 7.49986 12 7.49986C10.8954 7.49986 10 8.39529 10 9.49986C10 10.6044 10.8954 11.4999 12 11.4999Z" />
                      <path d="M12 11.4999V14.9999" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium mb-1">Paste a Bluesky URL to get started</h3>
                  <p className="text-muted-foreground text-sm">
                    Enter the URL of the Bluesky post containing the video you want to download
                  </p>
                </div>
              )}

              {videoInfo && (
                <div className="mt-8 space-y-6">
                  <Separator />
                  
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Download Options</h3>
                      <FormatSelector
                        selectedFormat={videoFormat}
                        selectedQuality={videoQuality}
                        onFormatChange={setVideoFormat}
                        onQualityChange={setVideoQuality}
                        disabled={isDownloading}
                      />
                      
                      <div className="bg-muted/50 rounded-md p-3 text-sm">
                        <p className="flex items-center gap-2 mb-1">
                          <span className="bg-bluesky/10 text-bluesky p-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 16v-4" />
                              <path d="M12 8h.01" />
                            </svg>
                          </span>
                          Download Information
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-5">
                          <li>Format: <span className="text-foreground">{videoFormat.toUpperCase()}</span></li>
                          <li>Quality: <span className="text-foreground">{videoQuality}</span></li>
                          <li>Estimated size: <span className="text-foreground">{getEstimatedFileSize(videoQuality)}</span></li>
                          {videoInfo.author && <li>Author: <span className="text-foreground">{videoInfo.author}</span></li>}
                          {videoInfo.duration && <li>Duration: <span className="text-foreground">{videoInfo.duration}</span></li>}
                        </ul>
                      </div>
                    </div>
                    
                    <VideoPreview
                      videoUrl={videoInfo.url}
                      thumbnailUrl={videoInfo.thumbnailUrl}
                      title={videoInfo.title}
                      author={videoInfo.author}
                      duration={videoInfo.duration}
                      format={videoFormat}
                      quality={videoQuality}
                      isDownloading={isDownloading}
                      onDownload={handleDownload}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center bg-muted/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">
                This tool is for personal use only. Respect copyright and Bluesky's terms of service.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="batch">
            <BatchDownloader />
          </TabsContent>
          
          <TabsContent value="history">
            <DownloadHistory />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-6 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Bluesky Downloader. All rights reserved.</p>
          <p className="mt-1">
            <a href="#" className="hover:text-bluesky">Privacy Policy</a>
            {" • "}
            <a href="#" className="hover:text-bluesky">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
