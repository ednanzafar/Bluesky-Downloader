
import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Download } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm bg-background/90 border-b border-border">
      <div className="container flex items-center justify-between h-16 mx-auto px-4">
        <div className="flex items-center space-x-2">
          <Download className="h-6 w-6 text-bluesky" />
          <span className="font-bold text-lg md:text-xl">
            <span className="text-bluesky">Blue</span>sky Downloader
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-sm font-medium hover:text-bluesky transition-colors">
            Home
          </a>
          <a href="#" className="text-sm font-medium hover:text-bluesky transition-colors">
            Batch Download
          </a>
          <a href="#" className="text-sm font-medium hover:text-bluesky transition-colors">
            History
          </a>
          <a href="#" className="text-sm font-medium hover:text-bluesky transition-colors">
            About
          </a>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
