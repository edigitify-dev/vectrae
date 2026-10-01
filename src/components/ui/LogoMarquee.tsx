import { Fragment } from "react";

type LogoMarqueeProps = {
  items: React.ReactNode[];
  reverse?: boolean;
  durationSeconds?: number;
};

export default function LogoMarquee({
  items,
  reverse = false,
  durationSeconds = 32,
}: LogoMarqueeProps) {
  return (
    <div className="group relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-white to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-white to-transparent sm:w-24" />

      <div
        className={`flex w-max items-center mb-8 gap-16 sm:gap-20 md:gap-24 ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        } group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {[items, items].map((pass, passIndex) => (
          <Fragment key={passIndex}>
            {pass.map((item, i) => (
              <div
                key={i}
                className="flex shrink-0 items-center justify-center"
              >
                {item}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
