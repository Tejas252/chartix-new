import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Upload } from "lucide-react";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              Transform Your Data Into
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Beautiful Charts
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl mt-4">
              Simply drag and drop your CSV or Excel files to get started. Our
              platform handles the rest.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size="lg" asChild className="text-base">
              <Link href="/auth/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base">
              <Link href="/#features">
                <Upload className="mr-2 h-5 w-5" />
                See How It Works
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-8">
            <div className="flex items-center">
              <span className="font-semibold text-foreground">✓</span>
              <span className="ml-2">No credit card required</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-foreground">✓</span>
              <span className="ml-2">Free forever plan</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
