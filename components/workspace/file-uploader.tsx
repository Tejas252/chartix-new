"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, X, UploadCloud, BarChart2, Upload, Download } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useWorkspace } from "@/hooks/useWorkspace";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type FileWithPreview = File & {
  preview?: string;
};

// Mock data for demonstration
const mockData = [
  { id: 1, name: "John Doe", age: 30, city: "New York", country: "USA" },
  { id: 2, name: "Jane Smith", age: 25, city: "London", country: "UK" },
  { id: 3, name: "Bob Johnson", age: 40, city: "Sydney", country: "Australia" },
  { id: 4, name: "Alice Brown", age: 35, city: "Toronto", country: "Canada" },
  { id: 5, name: "Charlie Wilson", age: 28, city: "Berlin", country: "Germany" },
];

// Type for file upload status
type FileUploadStatus = {
  id: string;
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
};

export function FileUploader() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [fileUploadStatus, setFileUploadStatus] = useState<Record<string, FileUploadStatus>>({});
  const {workspaceId,setWorkspaceId, setPendingPrompt} = useWorkspace()
  const router = useRouter()

  // File upload mutation
  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, fileId }: { file: File; fileId: string }) => {
      // Update status to uploading
      setFileUploadStatus(prev => ({
        ...prev,
        [fileId]: { id: fileId, status: 'uploading', progress: 0 }
      }));

      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate progress for better UX (in a real app, you'd use fetch with progress tracking)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Update status to success
      setFileUploadStatus(prev => ({
        ...prev,
        [fileId]: { id: fileId, status: 'success', progress: 100 }
      }));
      
      // Show success toast
      toast.success(`File ${file.name} uploaded successfully!`);
      
      return { file, result, fileId };
    },
    onError: (error: Error, variables) => {
      console.error(`Upload failed for file: ${variables.file.name}`, error);
      setFileUploadStatus(prev => ({
        ...prev,
        [variables.fileId]: { 
          id: variables.fileId, 
          status: 'error', 
          error: error.message || 'Upload failed' 
        }
      }));
      
      // Show error toast
      toast.error(`Upload failed for ${variables.file.name}`, {
        description: error.message || 'Please try again',
      });
    },
  });

  // Function to handle file upload and visualization generation
  const handleGenerateVisualization = async () => {
    if (files.length === 0 || !prompt.trim()) return;
    
    setIsLoading(true);
    try {
      // Upload the single file with tracking
      const file = files[0];
      const fileId = `${file.name}-${file.size}-0`;
      const uploadResult = await uploadFileMutation.mutateAsync({ file, fileId });
      
      console.log("File uploaded successfully:", uploadResult);

      if(!uploadResult.result.conversationId){
        toast.error("Something Went Wrong")
      }

      setWorkspaceId(uploadResult.result.conversationId)

      // Store the prompt to be sent after redirect
      setPendingPrompt(prompt);
      
      // Here you would typically send the file and prompt to your API using the upload result information
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // After successful visualization generation
      // You would update the state with the generated visualization data
      console.log("Generating visualization with prompt:", prompt);
      
      // Show success toast for visualization generation
      toast.success("Visualization generated successfully!", {
        description: "Your data visualization is ready to view",
      });

      router.push(`workspace/${uploadResult.result.conversationId}`)
      
    } catch (error) {
      console.error("Error during upload or visualization generation:", error);
      
      // Show error toast for visualization generation
      toast.error("Visualization generation failed", {
        description: error instanceof Error ? error.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Check if a file is already present, if so, clear it
    if (files.length > 0) {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    }

    // Only allow one file - take the first valid file
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]; // Take only the first file
      
      // Validate the file
      const isCorrectFormat = file.type === "text/csv" || 
                              file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                              file.name.endsWith('.csv') ||
                              file.name.endsWith('.xlsx');

      // Check file size (less than 5MB = 5 * 1024 * 1024 bytes)
      const isWithinSizeLimit = file.size <= 5 * 1024 * 1024;

      if (isCorrectFormat && isWithinSizeLimit) {
        setFiles([Object.assign(file, { preview: URL.createObjectURL(file) })]);
        setShowData(true);
      } else {
        // Show error toast for file format/size issues
        toast.error("File format or size not supported", {
          description: "Please upload a CSV or Excel file under 5MB",
        });
        console.warn(`File ${file.name} was rejected due to format or size limitations.`);
      }
    }
  }, [files]);

  const removeFile = (index: number) => {
    setFiles((prevFiles) => {
      // Revoke the object URL for the file being removed
      if (prevFiles[index] && prevFiles[index].preview) {
        URL.revokeObjectURL(prevFiles[index].preview!);
      }
      // Return empty array since we only have one file
      return [];
    });
    setShowData(false); // Hide data preview when file is removed
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
    multiple: false,
  });



  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-6 overflow-auto">
        {files.length < 1?<div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3 p-4">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground text-center">
                {isDragActive
                  ? "Drop the files here"
                  : "Drag & drop file here, or click to select file"}
              </p>
              <p className="text-sm text-muted-foreground mt-1 text-center">
                Supports CSV and Excel files (single file, max 5MB)
              </p>
            </div>
            <Button variant="outline" size="sm" type="button">
              Select File
            </Button>
          </div>
        </div>:null}

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Uploaded File</h3>
            <div className="space-y-2">
              {files.map((file, index) => {
                const fileId = `${file.name}-${file.size}`;
                const status = fileUploadStatus[fileId];
                
                return (
                  <div
                    key={fileId} // Changed key to include index for proper identification
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border rounded-lg",
                      status?.status === 'uploading' && 'bg-blue-50/30 border-blue-200',
                      status?.status === 'success' && 'bg-green-50/30 border-green-200',
                      status?.status === 'error' && 'bg-red-50/30 border-red-200'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        {status?.status === 'uploading' && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-blue-500 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></div>
                          </div>
                        )}
                        {status?.status === 'success' && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="h-2 w-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        {status?.status === 'error' && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-red-500 flex items-center justify-center">
                            <svg className="h-2 w-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="truncate max-w-xs">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {status && status.status === 'uploading' && (
                          <div className="w-full mt-1">
                            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{ width: `${status.progress || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        {status && status.status === 'error' && status.error && (
                          <p className="text-xs text-red-500 mt-1">{status.error}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

          <div className="mt-8">
            <div className="relative rounded-xl border border-border/50 bg-gradient-to-br from-background via-background to-muted/20 p-4 sm:p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                      <BarChart2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <label htmlFor="prompt" className="text-base font-semibold text-foreground">
                        Create Visualization
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Describe what you'd like to see from your data
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      // Create a temporary link and trigger the download
                      const link = document.createElement('a');
                      link.href = 'https://dmbkuxvjcbrqzjvyikpz.supabase.co/storage/v1/object/sign/chartix-new/uploads/obr16xibd1b7exgpgcr05br7/1761302775957-Sales_Report_new_formatted.xlsx?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80MzE0NGYxOS03OWJkLTQ3MDAtYWZmYi01OTdjYjQ4NDBjYzQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjaGFydGl4LW5ldy91cGxvYWRzL29icjE2eGliZDFiN2V4Z3BnY3IwNWJyNy8xNzYxMzAyNzc1OTU3LVNhbGVzX1JlcG9ydF9uZXdfZm9ybWF0dGVkLnhsc3giLCJpYXQiOjE3NjMyMzYxMTQsImV4cCI6NDkxNjgzNjExNH0.KguLSuNaEwYyM2BqWzg7WFIL7aTjkrWetHgsN8UmsQY';
                      link.download = 'sample-data.xlsx';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Sample</span>
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <Textarea
                    id="prompt"
                    placeholder="E.g., Show me a bar chart of age distribution by country, or create a line graph showing trends over time..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerateVisualization();
                      }
                    }}
                    className="min-h-[100px] resize-none border-border/50 bg-background/50 backdrop-blur-sm transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-xs text-muted-foreground self-start sm:self-center">
                      Press <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold">Enter</kbd> to generate • <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold">Shift + Enter</kbd> for new line
                    </p>
                    <Button 
                      onClick={handleGenerateVisualization} 
                      disabled={!prompt.trim() || isLoading || uploadFileMutation.isPending}
                      size="lg"
                      className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 shadow-md transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
                    >
                      {(isLoading || uploadFileMutation.isPending) ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="font-medium">Uploading & Generating...</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <BarChart2 className="h-4 w-4" />
                          <span className="font-medium">Generate Visualization</span>
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
            {/* {showData && (
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-muted/50 border-b">
                <h3 className="font-medium">Uploaded Data Preview</h3>
                <p className="text-sm text-muted-foreground">
                  {files.length} file{files.length !== 1 ? 's' : ''} • {mockData.length} rows
                </p>
              </div>
              <div className="overflow-auto max-h-96">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      {Object.keys(mockData[0]).map((key) => (
                        <TableHead key={key} className="font-medium">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.map((row) => (
                      <TableRow key={row.id}>
                        {Object.values(row).map((value, i) => (
                          <TableCell key={i} className="py-2">
                            {String(value)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            )} */}
      </div>
    </div>
  );
}
