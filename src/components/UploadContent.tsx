import { useState, useEffect } from "react";
import { Upload, File, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  description: string;
  uploadedAt: Date;
}

const UploadContent = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isWebhookLoading, setIsWebhookLoading] = useState(false);

  // Load webhook URL from localStorage
  useEffect(() => {
    const savedWebhook = localStorage.getItem("n8n_webhook_url");
    if (savedWebhook) {
      setWebhookUrl(savedWebhook);
    }
  }, []);

  // Save webhook URL to localStorage
  const handleWebhookUrlChange = (url: string) => {
    setWebhookUrl(url);
    localStorage.setItem("n8n_webhook_url", url);
  };

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

    // Send to n8n webhook if configured
    if (webhookUrl) {
      setIsWebhookLoading(true);
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            files: newFiles.map(f => ({
              id: f.id,
              name: f.name,
              size: f.size,
              description: f.description,
              uploadedAt: f.uploadedAt.toISOString(),
            })),
            timestamp: new Date().toISOString(),
            source: "content-upload",
          }),
        });
        
        toast.success("Content sent to n8n workflow!");
      } catch (error) {
        console.error("Error sending to n8n webhook:", error);
        toast.error("Failed to send to n8n workflow");
      } finally {
        setIsWebhookLoading(false);
      }
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
          <div className="space-y-3">
            <Label htmlFor="webhook-url" className="text-sm font-medium">
              n8n Webhook URL
            </Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://your-n8n-instance.com/webhook/..."
              value={webhookUrl}
              onChange={(e) => handleWebhookUrlChange(e.target.value)}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Uploads will automatically trigger your n8n workflow when configured
            </p>
          </div>

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
            />
            <label htmlFor="file-upload">
              <Button 
                variant="outline" 
                className="cursor-pointer" 
                disabled={isWebhookLoading}
                asChild
              >
                <span>{isWebhookLoading ? "Processing..." : "Choose Files"}</span>
              </Button>
            </label>
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
