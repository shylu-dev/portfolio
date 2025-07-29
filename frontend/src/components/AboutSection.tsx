import { Heart, Code, Coffee, Sparkles } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 gradient-text">About Me</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Passionate about creating digital experiences that make a difference
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">My Journey</h3>
                  <p className="text-muted-foreground">
                    I started my journey in computer science with a passion for problem-solving and creativity.
                    What began as curiosity about how websites work has evolved into a deep love for full-stack development.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Code className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">What I Love</h3>
                  <p className="text-muted-foreground">
                    I'm passionate about clean code, beautiful user interfaces, and solving complex problems.
                    I believe technology should be both powerful and accessible, with a touch of elegance.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Coffee className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Beyond Code</h3>
                  <p className="text-muted-foreground">
                    When I'm not coding, you'll find me exploring new technologies, diving into photography and modeling, or enjoying a quiet moment with a cup of coffee.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="glass-card p-8 rounded-2xl text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary-glow rounded-full mx-auto mb-6 flex items-center justify-center">
                <Sparkles className="h-16 w-16 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Always Learning</h3>
              <p className="text-muted-foreground mb-6">
                Technology evolves rapidly, and I love staying current with the latest trends and best practices
                in software development.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-primary/5 rounded-lg p-3">
                  <div className="font-semibold text-primary">3+</div>
                  <div className="text-muted-foreground">Languages</div>
                </div>
                <div className="bg-secondary/10 rounded-lg p-3">
                  <div className="font-semibold text-secondary-foreground">5+</div>
                  <div className="text-muted-foreground">Projects</div>
                </div>
                <div className="bg-accent/10 rounded-lg p-3">
                  <div className="font-semibold text-accent-foreground">1+</div>
                  <div className="text-muted-foreground">Years</div>
                </div>
                <div className="bg-primary/5 rounded-lg p-3">
                  <div className="font-semibold text-primary">∞</div>
                  <div className="text-muted-foreground">Curiosity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};