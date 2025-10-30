import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden h-[calc(100vh-64px)]">
      {/* Four Corner Gradient Background */}
      <div className="absolute inset-0 -z-10">
        {/* Top Left */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-50" />
        {/* Top Right */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl opacity-50" />
        {/* Bottom Left */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl opacity-50" />
        {/* Bottom Right */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Floating Charts Background */}
      <div className="absolute inset-0 -z-10">
        {/* Bar Chart - Top Left */}
        <div className="absolute top-20 left-10 opacity-20 animate-float-slow">
          <div className="flex items-end gap-2">
            <div className="w-3 h-8 bg-primary/60 rounded-sm"></div>
            <div className="w-3 h-12 bg-primary/40 rounded-sm"></div>
            <div className="w-3 h-6 bg-primary/80 rounded-sm"></div>
            <div className="w-3 h-10 bg-primary/50 rounded-sm"></div>
            <div className="w-3 h-4 bg-primary/70 rounded-sm"></div>
          </div>
        </div>

        {/* Line Chart - Top Right */}
        <div className="absolute top-32 right-16 opacity-20 animate-float">
          <svg width="80" height="60" viewBox="0 0 80 60" className="text-primary/60">
            <path d="M5,45 L20,35 L35,25 L50,20 L65,15 L75,10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="20" cy="35" r="2" fill="currentColor" />
            <circle cx="35" cy="25" r="2" fill="currentColor" />
            <circle cx="50" cy="20" r="2" fill="currentColor" />
          </svg>
        </div>

        {/* Pie Chart - Bottom Left */}
        <div className="absolute bottom-24 left-20 opacity-20 animate-float-reverse">
          <svg width="60" height="60" viewBox="0 0 60 60" className="text-purple-500/60">
            <circle cx="30" cy="30" r="20" fill="currentColor" opacity="0.3" />
            <path d="M30,30 L30,10 A20,20 0 0,1 50,30 Z" fill="currentColor" opacity="0.6" />
            <path d="M30,30 L50,30 A20,20 0 0,1 30,50 Z" fill="currentColor" opacity="0.8" />
          </svg>
        </div>

        {/* Area Chart - Bottom Right */}
        <div className="absolute bottom-32 right-24 opacity-20 animate-float-slow">
          <svg width="70" height="50" viewBox="0 0 70 50" className="text-blue-500/60">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path d="M5,40 L20,30 L35,25 L50,20 L65,25 L70,30 L70,45 L5,45 Z" fill="url(#areaGradient)" />
            <path d="M5,40 L20,30 L35,25 L50,20 L65,25 L70,30" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Small Bar Chart - Middle Left */}
        <div className="absolute top-1/2 left-8 opacity-15 animate-float">
          <div className="flex items-end gap-1">
            <div className="w-2 h-4 bg-green-500/60 rounded-sm"></div>
            <div className="w-2 h-6 bg-green-500/40 rounded-sm"></div>
            <div className="w-2 h-3 bg-green-500/80 rounded-sm"></div>
            <div className="w-2 h-5 bg-green-500/50 rounded-sm"></div>
          </div>
        </div>

        {/* Small Line Chart - Middle Right */}
        <div className="absolute top-1/3 right-12 opacity-15 animate-float-reverse">
          <svg width="50" height="40" viewBox="0 0 50 40" className="text-pink-500/60">
            <path d="M5,25 L15,20 L25,15 L35,10 L45,15" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <circle cx="15" cy="20" r="1.5" fill="currentColor" />
            <circle cx="25" cy="15" r="1.5" fill="currentColor" />
            <circle cx="35" cy="10" r="1.5" fill="currentColor" />
          </svg>
        </div>

        {/* Floating Data Table - Bottom Center */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 opacity-20 animate-float-slow">
          <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-lg">
            <div className="text-xs font-medium text-muted-foreground mb-2">Sample Data</div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Jan</span>
                <span className="font-medium text-primary">$12.5K</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Feb</span>
                <span className="font-medium text-green-600">$15.2K</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Mar</span>
                <span className="font-medium text-blue-600">$18.7K</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Apr</span>
                <span className="font-medium text-purple-600">$22.1K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 lg:space-y-10 w-full">
          {/* Main Content */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
              Transform Your Data Into
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mt-2">
                Beautiful Charts
              </span>
            </h1>
            <p className="mx-auto max-w-[600px] sm:max-w-[700px] text-muted-foreground text-base sm:text-lg md:text-xl lg:text-2xl px-4 sm:px-0">
              Simply drag and drop your CSV or Excel files to get started. Our
              platform handles the rest.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-none justify-center">
            <Button size="lg" asChild className="text-sm sm:text-base w-full sm:w-auto">
              <Link href="/auth/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-sm sm:text-base w-full sm:w-auto">
              <Link href="/#features">
                <Upload className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                See How It Works
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center">
              <span className="font-semibold text-foreground mr-2">✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-foreground mr-2">✓</span>
              <span>Free forever plan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
