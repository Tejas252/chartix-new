import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload, BarChart3, Globe, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden h-[calc(100vh-64px)]">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background dark:from-background dark:via-background/80 dark:to-background" />
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-slow-delayed" />
        <div className="absolute bottom-0 left-1/3 w-[700px] h-[700px] bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse-slower" />
      </div>

      {/* Floating Charts Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Animated Grid Lines */}
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.border/10)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border/10)_1px,transparent_1px)] [background-size:50px_50px]" style={{ transform: 'translateZ(0)' }} />
        </div>

        {/* Enhanced Floating Charts */}
        {/* Bar Chart - Top Left */}
        <div className="absolute top-20 left-10 opacity-70 animate-float-slow">
          <div className="flex items-end gap-2">
            <div className="w-3 h-8 bg-gradient-to-t from-primary to-primary/60 rounded-t-sm animate-rise-1"></div>
            <div className="w-3 h-12 bg-gradient-to-t from-primary to-primary/60 rounded-t-sm animate-rise-2"></div>
            <div className="w-3 h-6 bg-gradient-to-t from-primary to-primary/60 rounded-t-sm animate-rise-3"></div>
            <div className="w-3 h-10 bg-gradient-to-t from-primary to-primary/60 rounded-t-sm animate-rise-4"></div>
            <div className="w-3 h-4 bg-gradient-to-t from-primary to-primary/60 rounded-t-sm animate-rise-5"></div>
          </div>
        </div>

        {/* Line Chart - Top Right */}
        <div className="absolute top-32 right-16 opacity-80 animate-float">
          <svg width="120" height="90" viewBox="0 0 120 90" className="text-primary/80">
            <path 
              d="M5,70 Q30,40 55,50 T105,20" 
              stroke="currentColor" 
              strokeWidth="3" 
              fill="none" 
              strokeDasharray="200"
              strokeDashoffset="200"
              className="animate-draw"
            />
            <circle cx="25" cy="50" r="3" fill="currentColor" className="animate-pulse" />
            <circle cx="55" cy="50" r="3" fill="currentColor" className="animate-pulse delay-150" />
            <circle cx="85" cy="35" r="3" fill="currentColor" className="animate-pulse delay-300" />
            <circle cx="105" cy="20" r="3" fill="currentColor" className="animate-pulse delay-450" />
          </svg>
        </div>

        {/* Pie Chart - Bottom Left */}
        <div className="absolute bottom-24 left-20 opacity-70 animate-float-reverse">
          <svg width="100" height="100" viewBox="0 0 100 100" className="text-purple-500/60">
            <circle cx="50" cy="50" r="35" fill="currentColor" opacity="0.2" />
            <path d="M50,50 L50,15 A35,35 0 0,1 85,50 Z" fill="currentColor" opacity="0.6" className="animate-fill-1" />
            <path d="M50,50 L85,50 A35,35 0 0,1 65,85 Z" fill="currentColor" opacity="0.8" className="animate-fill-2" />
            <path d="M50,50 L65,85 A35,35 0 0,1 15,50 Z" fill="currentColor" opacity="0.4" />
          </svg>
        </div>

        {/* Area Chart - Bottom Right */}
        <div className="absolute bottom-32 right-24 opacity-70 animate-float-slow">
          <svg width="110" height="80" viewBox="0 0 110 80" className="text-blue-500/60">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <path 
              d="M5,70 L25,55 L45,45 L65,40 L85,45 L105,50 L110,60 L110,80 L5,80 Z" 
              fill="url(#areaGradient)" 
              className="animate-rise-area"
            />
            <path 
              d="M5,70 L25,55 L45,45 L65,40 L85,45 L105,50 L110,60" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              strokeDasharray="250"
              strokeDashoffset="250"
              className="animate-draw"
            />
          </svg>
        </div>

        {/* Small Bar Chart - Middle Left */}
        <div className="absolute top-1/2 left-8 opacity-50 animate-float">
          <div className="flex items-end gap-1">
            <div className="w-2 h-6 bg-gradient-to-t from-green-500/70 to-green-500/40 rounded-t-sm animate-rise-1"></div>
            <div className="w-2 h-9 bg-gradient-to-t from-green-500/70 to-green-500/40 rounded-t-sm animate-rise-2"></div>
            <div className="w-2 h-4 bg-gradient-to-t from-green-500/70 to-green-500/40 rounded-t-sm animate-rise-3"></div>
            <div className="w-2 h-7 bg-gradient-to-t from-green-500/70 to-green-500/40 rounded-t-sm animate-rise-4"></div>
          </div>
        </div>

        {/* Small Line Chart - Middle Right */}
        <div className="absolute top-1/3 right-12 opacity-60 animate-float-reverse">
          <svg width="80" height="60" viewBox="0 0 80 60" className="text-pink-500/60">
            <path 
              d="M5,50 L25,35 L45,25 L65,30 L75,20" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none"
              strokeDasharray="180"
              strokeDashoffset="180"
              className="animate-draw"
            />
            <circle cx="25" cy="35" r="2" fill="currentColor" className="animate-pulse" />
            <circle cx="45" cy="25" r="2" fill="currentColor" className="animate-pulse delay-150" />
            <circle cx="65" cy="30" r="2" fill="currentColor" className="animate-pulse delay-300" />
          </svg>
        </div>

        {/* Floating Data Table - Bottom Center */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 opacity-80 animate-float-slow">
          <div className="bg-background/60 backdrop-blur-md border border-border/60 rounded-xl p-4 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Data Preview</span>
            </div>
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
        
        {/* Floating Stats */}
        <div className="absolute top-1/4 left-1/4 opacity-60 animate-float">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-primary">98%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
        </div>
        
        <div className="absolute bottom-1/3 right-1/3 opacity-60 animate-float-reverse">
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold text-primary">2.5s</div>
            <div className="text-xs text-muted-foreground">Avg. Processing</div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 lg:space-y-10 w-full max-w-4xl">

          
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
              platform handles the rest with AI-powered insights.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-none justify-center">
            <Button size="lg" className="text-sm sm:text-base w-full sm:w-auto relative overflow-hidden group">
              <span className="absolute inset-0 bg-primary/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
              <span className="relative flex items-center">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1 duration-300" />
              </span>
            </Button>
            <Button size="lg" variant="outline" className="text-sm sm:text-base w-full sm:w-auto relative overflow-hidden group">
              <span className="absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
              <span className="relative flex items-center">
                <Upload className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                See How It Works
              </span>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-muted-foreground max-w-lg">
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-primary" />
              <span>Free forever plan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
