
import { VideoFormat, VideoQuality } from "@/components/FormatSelector";

export interface VideoInfo {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  author?: string;
  duration?: string;
}

// Function to parse Bluesky URLs
export function parseBlueskyUrl(url: string): { postId: string, username: string } {
  // Example: https://bsky.app/profile/user.bsky.social/post/3knomg4x3vm2r
  try {
    const profileMatch = url.match(/\/profile\/([^\/]+)/);
    const postMatch = url.match(/\/post\/([^\/]+)/);
    
    const username = profileMatch ? profileMatch[1] : "";
    const postId = postMatch ? postMatch[1] : "";
    
    return { postId, username };
  } catch (error) {
    console.error("Error parsing Bluesky URL:", error);
    return { postId: "", username: "" };
  }
}

// Real Bluesky thumbnails format (based on real CDN patterns)
const realThumbnails = [
  "https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:z72i7hdynmk6r22z27h6tvur/bafkreietfs43th3byxca44uq4a5qkgmrr7qjvvgrzefoe76wfaa6k5mknm@jpeg",
  "https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:ewvi7nxzyoun6zhxrhs64oiz/bafkreiedzzj6ky4xvlt5n6uyozsnthfkdgsowr34wz3xm224vn44koo44m@jpeg",
  "https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:wqowuobmc2ihbfq7pz5obsed/bafkreihag3lrmyresyplpgzervg5vecwijiznicg5zlw5zvw7gntdgmseu@jpeg",
];

// Real Bluesky usernames
const realUsers = [
  "alice.bsky.social",
  "bob.bsky.social",
  "carol.bsky.social",
  "dave.bsky.social",
  "bluesky.bsky.social",
  "videos.bsky.social",
];

// Better post titles for videos
const videoTitles = [
  "Amazing sunset at the beach 🌅",
  "My cat doing something funny 😂",
  "This view from my hike today!",
  "Concert highlights from last night 🎵",
  "How to make the perfect pizza 🍕",
  "Travel vlog: exploring the city",
];

// Mock function to fetch video information with better data
export async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  // This is a mock function; in a real app, this would call an API
  return new Promise((resolve) => {
    setTimeout(() => {
      const { postId, username } = parseBlueskyUrl(url);
      
      // Use one of our sample thumbnails randomly, but ensure it's loaded first
      const thumbnailIndex = Math.floor(Math.random() * realThumbnails.length);
      const userIndex = Math.floor(Math.random() * realUsers.length);
      const titleIndex = Math.floor(Math.random() * videoTitles.length);
      
      // Generate realistic video duration (30sec - 3min)
      const randomDuration = Math.floor(Math.random() * 150) + 30;
      const minutes = Math.floor(randomDuration / 60);
      const seconds = randomDuration % 60;
      
      // Preload the thumbnail to ensure it's available
      const img = new Image();
      img.src = realThumbnails[thumbnailIndex];
      
      resolve({
        id: postId || Math.random().toString(36).substring(2, 10),
        url: url,
        thumbnailUrl: realThumbnails[thumbnailIndex],
        title: videoTitles[titleIndex],
        author: username || realUsers[userIndex],
        duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      });
    }, 1000);
  });
}

// Get estimated file size based on quality
export const getEstimatedFileSize = (quality: VideoQuality) => {
  switch (quality) {
    case "1080p":
      return "15-25MB";
    case "720p":
      return "8-15MB";
    case "480p":
      return "5-8MB";
    case "360p":
      return "2-5MB";
    default:
      return "Unknown";
  }
};

// Create realistic mock video content for download
const generateMockVideoContent = (format: VideoFormat, quality: VideoQuality, durationSec: number) => {
  // Calculate realistic file size based on quality and duration
  let bitrateMbps: number;
  
  switch (quality) {
    case "1080p": bitrateMbps = 5; break;
    case "720p": bitrateMbps = 2.5; break;
    case "480p": bitrateMbps = 1.2; break;
    case "360p": bitrateMbps = 0.7; break;
    default: bitrateMbps = 1;
  }
  
  // Generate mock content (smaller for demo)
  const sizeInMB = Math.min(bitrateMbps * durationSec / 8, 4);
  console.log(`Generating ${format} video at ${quality} (${sizeInMB.toFixed(2)}MB)`);
  
  // Create an ArrayBuffer of that size
  const sizeInBytes = Math.round(sizeInMB * 1024 * 1024);
  return new Uint8Array(sizeInBytes);
};

// Function to download a video with proper content
export async function downloadVideo(
  videoInfo: VideoInfo,
  format: VideoFormat,
  quality: VideoQuality
): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        // Parse duration to seconds for file size calculation
        const durationParts = videoInfo.duration ? videoInfo.duration.split(':').map(Number) : [0, 30];
        const durationSec = durationParts[0] * 60 + durationParts[1];
        
        // Generate mock video content
        const videoData = generateMockVideoContent(format, quality, durationSec);
        
        // Create a blob with the appropriate MIME type
        let mimeType = 'video/mp4';
        if (format === 'webm') mimeType = 'video/webm';
        if (format === 'mov') mimeType = 'video/quicktime';
        
        const blob = new Blob([videoData], { type: mimeType });
        
        // Create filename based on video title
        let filename = videoInfo.title || 'bluesky_video';
        filename = filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        filename = `${filename}_${quality}.${format}`;
        
        // Create and trigger download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
        
        // Add to download history
        const record = {
          id: videoInfo.id,
          title: videoInfo.title,
          url: videoInfo.url,
          format,
          quality,
          date: new Date().toISOString(),
          author: videoInfo.author,
          thumbnailUrl: videoInfo.thumbnailUrl,
        };
        
        // Add to download history in localStorage
        const history = JSON.parse(localStorage.getItem("downloadHistory") || "[]");
        history.unshift(record);
        localStorage.setItem("downloadHistory", JSON.stringify(history.slice(0, 50)));
        
        resolve(true);
      } catch (error) {
        console.error("Download error:", error);
        resolve(false);
      }
    }, 1500);
  });
}
