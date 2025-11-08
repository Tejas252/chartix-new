"use client";

import { useEffect, useRef } from "react";
import { FileUploader } from "@/components/workspace/file-uploader";
import ConversationList from "@/components/workspace/conversation-list";

export default function WorkspacePage() {
  const conversationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#conversations" && conversationsRef.current) {
      // Wait for the component to render, then scroll to the conversations section
      setTimeout(() => {
        conversationsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100); // Small delay to ensure DOM is ready
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Upload Your Data
        </h1>
        <p className="mt-2 text-muted-foreground">
          Upload CSV or Excel files to start analyzing your data
        </p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border">
        <FileUploader />
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Supported formats: .csv, .xlsx (Excel)</p>
        <p className="mt-1">Maximum file size: 10MB per file</p>
      </div>

      <div id="conversations" ref={conversationsRef}>
        <ConversationList />
      </div>
    </div>
  );
}