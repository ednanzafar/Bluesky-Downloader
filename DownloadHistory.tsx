
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Download,
  History,
  Trash,
  Trash2 
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DownloadRecord {
  id: string;
  title: string;
  url: string;
  format: string;
  quality: string;
  date: string;
}

export function DownloadHistory() {
  const [history, setHistory] = useState<DownloadRecord[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("downloadHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error parsing download history:", error);
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("downloadHistory");
    setHistory([]);
    toast({
      title: "History cleared",
      description: "Your download history has been cleared",
    });
  };

  const downloadHistoryCSV = () => {
    if (history.length === 0) {
      toast({
        title: "No history to export",
        description: "Your download history is empty",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Title", "URL", "Format", "Quality", "Date"];
    const csvContent = [
      headers.join(","),
      ...history.map(item => 
        [
          `"${item.title.replace(/"/g, '""')}"`,
          `"${item.url}"`,
          item.format,
          item.quality,
          item.date
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "skyswoop_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History size={18} />
          Download History
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={downloadHistoryCSV}
            disabled={history.length === 0}
            className="text-xs"
          >
            <Download size={14} className="mr-1" /> Export
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearHistory}
            disabled={history.length === 0}
            className="text-xs text-destructive hover:text-destructive"
          >
            <Trash2 size={14} className="mr-1" /> Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No download history yet</p>
            <p className="text-sm mt-1">Your download history will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {item.title}
                    </TableCell>
                    <TableCell>{item.format.toUpperCase()}</TableCell>
                    <TableCell>{item.quality}</TableCell>
                    <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(item.url, "_blank")}
                        className="h-8 w-8 p-0"
                      >
                        <Download size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
