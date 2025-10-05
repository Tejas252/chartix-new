import { Card } from "@/components/ui/card";
import {
  BarChart3,
  FileSpreadsheet,
  Zap,
  Shield,
  Download,
  Palette,
} from "lucide-react";

const features = [
  {
    title: "Drag & Drop Upload",
    description:
      "Simply drag your CSV or Excel files. No complex setup required.",
    icon: FileSpreadsheet,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Instant Visualization",
    description: "See your data come to life in seconds with automatic chart generation.",
    icon: Zap,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Secure & Private",
    description: "Your data is encrypted and never shared with third parties.",
    icon: Shield,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Multiple Chart Types",
    description:
      "Choose from bar charts, line graphs, pie charts, and more to visualize your data.",
    icon: BarChart3,
    className: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Customizable Themes",
    description: "Personalize your charts with custom colors and styles.",
    icon: Palette,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Export Anywhere",
    description: "Download your charts as PNG, SVG, or PDF for presentations.",
    icon: Download,
    className: "md:col-span-2 md:row-span-1",
  },
];

export function BentoGrid() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything You Need
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Powerful features to transform your data into stunning visualizations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-fr">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={`p-6 md:p-8 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${feature.className}`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground flex-grow">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
