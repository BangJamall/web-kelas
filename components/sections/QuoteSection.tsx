export default function QuoteSection() {
  return (
    <section className="bg-primary text-on-primary text-center py-12 px-5">
      <div className="max-w-[800px] mx-auto">
        <div className="font-display text-[0.7rem] font-bold tracking-[0.14em] uppercase text-secondary-container mb-5 flex justify-center">
          Filosofi Kelas
        </div>
        <blockquote className="font-body text-[clamp(1.5rem,3vw,2.25rem)] font-normal italic leading-[1.5] opacity-95">
          &ldquo;Education is not the filling of a pail, but the lighting of a fire.&rdquo;
        </blockquote>
        <p className="font-display text-[0.75rem] font-semibold tracking-[0.1em] uppercase mt-6">
          — W.B. Yeats
        </p>
      </div>
    </section>
  );
}
