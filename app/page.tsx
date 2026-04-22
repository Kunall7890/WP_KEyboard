import KeyboardScroll from "@/components/KeyboardScroll";

export default function HomePage() {
  return (
    <main className="bg-fog text-black/90">
      <header className="pointer-events-none fixed left-0 top-0 z-40 w-full px-5 py-5 md:px-10 md:py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <p className="pointer-events-auto font-display text-sm font-semibold tracking-[-0.03em] text-black/85 md:text-base">WpDev Atelier</p>
          <button
            className="pointer-events-auto rounded-full border border-black/15 bg-white/80 px-4 py-2 text-xs font-semibold tracking-tight text-black/80 backdrop-blur transition hover:bg-white md:text-sm"
            type="button"
          >
            Reserve Founder Edition
          </button>
        </div>
      </header>

      <KeyboardScroll />

      <section className="relative -mt-px bg-[#0B0C0F] pb-24 pt-20 text-white md:pb-28 md:pt-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_84%_12%,rgba(147,197,253,0.14),transparent_32%)]" />
        <div className="relative mx-auto w-full max-w-7xl px-6 md:px-10">
          <div className="mb-10 md:mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Why teams upgrade to WpDev</p>
            <h2 className="font-display mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
              Premium feel. Competitive speed. A keyboard built to turn deep work into daily output.
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-white/65 md:text-base">
              WpDev blends elite hardware engineering with creator-first workflow design so your setup performs as hard as you do.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <article className="rounded-3xl border border-white/15 bg-white/[0.06] p-7 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/[0.1]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Speed You Can Feel</p>
              <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight text-white">Sub-1ms response engine</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-base">From first keystroke to final push, your actions register instantly and stay consistent under load.</p>
            </article>

            <article className="rounded-3xl border border-white/15 bg-white/[0.06] p-7 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/[0.1]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Luxury Build Quality</p>
              <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight text-white">CNC shell, tuned acoustics</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-base">Precision-machined layers cut resonance and flex for a stable, premium sound and feel.</p>
            </article>

            <article className="rounded-3xl border border-white/15 bg-white/[0.06] p-7 backdrop-blur-md transition hover:-translate-y-1 hover:bg-white/[0.1]">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Creator Workflow</p>
              <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight text-white">Mac + Windows in one tap</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-base">Save profiles, macros, and layers so your keyboard adapts instantly to each project and device.</p>
            </article>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/15 bg-white/[0.06] p-8 backdrop-blur-md md:mt-14 md:flex-row md:items-center md:p-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/50">Founder Drop 01 - Almost Sold Out</p>
              <h2 className="font-display mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-white md:text-5xl">
                Own the keyboard serious builders are switching to this season.
              </h2>
              <p className="mt-3 max-w-2xl text-sm text-white/70 md:text-base">
                Reserve now to lock launch pricing, early shipping priority, and your serialized founder edition package.
              </p>
            </div>
            <button type="button" className="rounded-full bg-white px-8 py-3 text-sm font-semibold tracking-tight text-black shadow-[0_10px_30px_rgba(255,255,255,0.22)] transition hover:-translate-y-0.5 hover:bg-white/90 md:text-base">
              Secure My WpDev
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-[#07080A] py-10 text-white/70">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-6 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <p className="font-display text-xl font-semibold tracking-[-0.03em] text-white">WpDev Atelier</p>
            <p className="mt-2 max-w-md text-sm text-white/55">
              Precision keyboards for founders, creators, and engineers who demand speed, control, and lasting build quality.
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-white/60">
            <a href="#" className="transition hover:text-white">
              Product
            </a>
            <a href="#" className="transition hover:text-white">
              Specifications
            </a>
            <a href="#" className="transition hover:text-white">
              Founder Access
            </a>
            <a href="#" className="transition hover:text-white">
              Support
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
