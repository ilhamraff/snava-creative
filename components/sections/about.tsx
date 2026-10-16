import { Container } from "@/components/ui/container";
import { getAboutData } from "@/lib/data/get-about";

export async function AboutSection() {
  const aboutData = await getAboutData();

  return (
    <section
      id="tentang"
      className="bg-foreground py-24 text-background lg:py-32"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <h2 className="max-w-xl font-display text-4xl font-medium leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            {aboutData.title}
          </h2>

          <div className="lg:pt-2">
            <p className="max-w-[56ch] font-sans text-lg font-light leading-relaxed text-background/85 md:text-xl">
              {aboutData.description}
            </p>

            {aboutData.vision && (
              <div className="mt-10 border-l-2 border-background/30 pl-5 md:mt-12 md:pl-6">
                <p className="max-w-[36ch] font-display text-xl font-medium leading-snug md:text-2xl">
                  {aboutData.vision}
                </p>
              </div>
            )}
          </div>
        </div>

        {aboutData.values.length > 0 && (
          <div className="mt-24 md:mt-28">
            <div className="mx-auto mt-12 grid max-w-6xl gap-x-8 gap-y-12 md:mt-16 md:grid-cols-2 md:gap-y-16 lg:grid-cols-4 lg:gap-x-10">
              {aboutData.values.map((value, index) => (
                <div key={value.title} className="text-left">
                  <span className="font-display text-4xl font-medium leading-none tracking-tight md:text-5xl">
                    {index + 1}.
                  </span>
                  <h3 className="mt-4 font-display text-xl font-medium">
                    {value.title}
                  </h3>
                  <p className="mt-3 font-sans text-base leading-relaxed text-background/70">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
