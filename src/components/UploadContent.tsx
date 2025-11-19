import { useState, useRef } from "react";
import { Upload, File, X, Video, ExternalLink, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  description: string;
  uploadedAt: Date;
}

const WEBHOOK_URL = "http://localhost:5678/webhook/4700b78a-8cd8-4e77-a65c-fe473adddfba";

const UploadContent = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isWebhookLoading, setIsWebhookLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      description: description,
      uploadedAt: new Date(),
    }));

    setFiles([...files, ...newFiles]);
    setDescription("");
    toast.success(`${newFiles.length} file(s) uploaded successfully!`);

    // Send to n8n webhook (POST) as multipart/form-data (all files in one request)
    setIsWebhookLoading(true);
    try {
      const formData = new FormData();
      Array.from(selectedFiles).forEach((file, idx) => {
        formData.append(`data${idx}`, file); // n8n expects data0, data1, ...
        formData.append(`name${idx}`, file.name);
        formData.append(`size${idx}`, file.size.toString());
        formData.append(`description${idx}`, description);
        formData.append(`uploadedAt${idx}`, new Date().toISOString());
      });
      formData.append("fileCount", selectedFiles.length.toString());

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
      }

      toast.success("Content sent to n8n workflow!");
    } catch (error) {
      console.error("Error sending to n8n webhook:", error);
      toast.error("Failed to send to n8n workflow");
    } finally {
      setIsWebhookLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
    toast.info("File removed");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Section 1: File Upload */}
      <Card className="border-border bg-gradient-to-br from-card to-card/50 backdrop-blur-sm" style={{ boxShadow: 'var(--shadow-card)' }}>
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Upload Your Content
          </CardTitle>
          <CardDescription>
            Upload videos, images, or documents to analyze and monetize
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
              isDragging
                ? "border-primary bg-primary/10 scale-105"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-glow" />
            <h3 className="text-lg font-semibold mb-2">Drag & Drop Files Here</h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse from your device
            </p>
            <Input
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
              id="file-upload"
              ref={fileInputRef}
            />
            <Button
              variant="outline"
              className="cursor-pointer"
              disabled={isWebhookLoading}
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              {isWebhookLoading ? "Processing..." : "Choose Files"}
            </Button>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              placeholder="Add a description for your content..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none transition-all duration-300 focus:scale-[1.02]"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Blotato Creative Section */}
      <Card className="border-border bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm relative overflow-hidden group" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary via-purple-500 to-accent bg-clip-text text-transparent">
              Explore Blotato
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Discover and manage your video content with Blotato's powerful platform
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10 space-y-6">
          <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/30">
                <Video className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Video Hub Awaits
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
              Access your video library, manage content, and unlock new monetization opportunities with Blotato's intuitive platform.
            </p>
            
            <Button
              onClick={() => window.open("https://my.blotato.com/videos", "_blank")}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg group/btn relative overflow-hidden"
              style={{ boxShadow: 'var(--shadow-glow)' }}
              size="lg"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Visit Blotato</span>
                <ExternalLink className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card className="border-border bg-gradient-to-br from-card to-card/50 animate-fade-in" style={{ boxShadow: 'var(--shadow-card)' }}>
          <CardHeader>
            <CardTitle className="text-xl">Uploaded Files ({files.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/70 transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <File className="h-5 w-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatFileSize(file.size)}</span>
                        <span>•</span>
                        <span>{file.uploadedAt.toLocaleString()}</span>
                      </div>
                      {file.description && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {file.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                    className="hover:bg-destructive/20 hover:text-destructive transition-all duration-300 hover:scale-110"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UploadContent;
