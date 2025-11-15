"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Free Forever
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chatrix is completely free to use. No hidden fees, no subscriptions - just powerful data visualization at no cost.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="flex flex-col border-primary/20 bg-card">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Free Plan</CardTitle>
              <CardDescription>Perfect for individuals and small projects</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/forever</span>
              </div>
              <ul className="space-y-3">
                {[
                  "Unlimited data uploads",
                  "Multiple chart types",
                  "AI-powered insights",
                  "Export capabilities",
                  "Team collaboration",
                  "Full feature access"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href={"/workspace"}>
              <Button className="w-full" variant="outline">
                Get Started - Free Forever
              </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Contact for Work */}
          <Card className="flex flex-col border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-primary" />
                Need Custom Work?
              </CardTitle>
              <CardDescription>
                I'm a MERN stack full-stack developer and AI enthusiast available for hire
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-2">Hire me for:</h3>
                <ul className="space-y-2">
                  {[
                    "Custom web applications",
                    "Data visualization solutions",
                    "AI integration projects",
                    "Full-stack development",
                    "Consulting services"
                  ].map((service, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-primary mr-2" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={"mailto:savaliyatejas108@gmail.com"}>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Contact Me for Work
              </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>This is a hobby project by a MERN stack developer passionate about AI and data visualization.</p>
          <p className="mt-2">All features are completely free as a showcase of my skills and passion for technology.</p>
        </div>
      </div>
    </section>
  );
}