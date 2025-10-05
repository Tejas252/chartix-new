import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, BarChart3, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const userEmail = data.claims.email as string;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to {process.env.NEXT_PUBLIC_APP_NAME}</h1>
        <p className="text-muted-foreground mt-2">
          Signed in as <span className="font-medium text-foreground">{userEmail}</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Upload Data</CardTitle>
            <CardDescription>
              Drag and drop your CSV or Excel files to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Upload File</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>My Charts</CardTitle>
            <CardDescription>
              View and manage all your created visualizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View Charts</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Templates</CardTitle>
            <CardDescription>
              Browse pre-made chart templates for quick start
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Browse Templates</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>Get started with {process.env.NEXT_PUBLIC_APP_NAME} in 3 easy steps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="font-semibold">Upload Your Data</h3>
              <p className="text-sm text-muted-foreground">
                Simply drag and drop your CSV or Excel file into the upload area
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="font-semibold">Choose Your Chart Type</h3>
              <p className="text-sm text-muted-foreground">
                Select from various chart types like bar, line, pie, and more
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="font-semibold">Customize & Export</h3>
              <p className="text-sm text-muted-foreground">
                Personalize your chart and export it in your preferred format
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
