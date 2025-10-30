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
    <section id="features" className="w-full py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 mb-16 sm:mb-20">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
              Everything You Need to
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mt-2">
                Transform Your Data
              </span>
            </h2>
            <p className="mx-auto max-w-[600px] sm:max-w-[700px] text-muted-foreground text-base sm:text-lg md:text-xl lg:text-2xl px-4 sm:px-0">
              Powerful features designed to turn your raw data into stunning, interactive visualizations
            </p>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-fr">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLarge = feature.className.includes('md:col-span-2') || feature.className.includes('md:row-span-2');
            
            return (
              <Card
                key={index}
                className={`
                  group relative overflow-hidden border border-primary/10 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm
                  hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 transition-all duration-500 hover:scale-[1.02]
                  hover:from-background/90 hover:to-background/70
                  ${isLarge ? 'p-6 sm:p-8 lg:p-10' : 'p-6 sm:p-8'}
                  ${feature.className}
                `}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative flex flex-col h-full">
                  {/* Icon */}
                  <div className={`
                    flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 
                    group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300
                    ${isLarge ? 'w-16 h-16 mb-6' : 'w-12 h-12 mb-4'}
                  `}>
                    <Icon className={`text-primary group-hover:scale-110 transition-transform duration-300 ${isLarge ? 'h-8 w-8' : 'h-6 w-6'}`} />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex flex-col h-full">
                    <h3 className={`font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-3 ${isLarge ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 flex-grow ${isLarge ? 'text-base sm:text-lg' : 'text-sm sm:text-base'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col items-center text-center space-y-6 mt-16 sm:mt-20">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base max-w-[500px] mx-auto px-4">
              Join thousands of users who are already transforming their data into beautiful charts
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
