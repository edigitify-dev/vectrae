import { coreValues } from "@/data/coreValues";
import { BRAND_GRADIENT } from "@/lib/brand";

// Explicit 3 + 2 grouping for the desktop/tablet row layout.
const ROWS = [coreValues.slice(0, 3), coreValues.slice(3)];

function Dot({ delay }: { delay: number }) {
  return (
    <span
      aria-hidden
      className="h-1.5 w-1.5 shrink-0 rounded-full sm:h-2 sm:w-2"
      style={{ backgroundImage: BRAND_GRADIENT }}
      data-aos="fade-up"
      data-aos-delay={delay}
    />
  );
}

function Value({ title, delay }: { title: string; delay: number }) {
  return (
    <span
      className="cursor-default text-xl font-semibold tracking-tight text-neutral-900 transition-colors duration-300 hover:text-[#0f9ac9] sm:text-2xl md:text-4xl"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      {title}
    </span>
  );
}

export default function CoreValues() {
  return (
    <section className="relative border-t border-black/5 bg-white py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <p
          className="text-xl max-sm:text-sm font-semibold uppercase tracking-widest text-[#0f9ac9]"
          data-aos="fade-up"
        >
          Our Core Values
        </p>

        {/* Mobile: simple vertical stack, no separators — dots only make
            sense between items sharing a line, which isn't guaranteed here. */}
        <div className="mt-6 flex flex-col items-center gap-y-4 sm:hidden">
          {coreValues.map((value, i) => (
            <Value key={value.title} title={value.title} delay={i * 80} />
          ))}
        </div>

        {/* sm and up: explicit 3 + 2 row layout with separator dots. */}
        <div className="mt-8 hidden flex-col items-center gap-y-5 sm:flex">
          {ROWS.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex items-center justify-center gap-x-4 sm:gap-x-6"
            >
              {row.map((value, i) => {
                const delay = (rowIndex * 3 + i) * 80;
                return (
                  <div
                    key={value.title}
                    className="flex items-center gap-x-4 sm:gap-x-6"
                  >
                    <Value title={value.title} delay={delay} />
                    {i < row.length - 1 && <Dot delay={delay} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
