"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState([
    { num: "0", label: "Mahasiswa Aktif" },
    { num: "0", label: "Mata Kuliah" },
    { num: "0", label: "Kegiatan" },
  ]);

  // Typewriter states
  // Typewriter states
  const words = ["Selamat Datang\ndi Kelas Kami", "Selamat Datang\ndi Kelas Binet"];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Typewriter effect
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !reverse) {
      setReverse(true);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === words[index].length ? 2000 : 150, parseInt((Math.random() * 20).toString())));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  // Blinking cursor
  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        
        const [pRes, jRes, gRes] = await Promise.all([
          supabase.from('personil_kelas').select('id', { count: 'exact', head: true }),
          supabase.from('jadwal_pelajaran').select('hari'),
          supabase.from('galeri').select('id', { count: 'exact', head: true })
        ]);

        // Hitung hari unik belajarnya
        const uniqueDays = new Set(jRes.data?.map(item => item.hari) || []);

        setStats([
          { num: (pRes.count || 0).toString(), label: "Mahasiswa Aktif" },
          { num: (uniqueDays.size || 0).toString(), label: "Mata Kuliah" },
          { num: (gRes.count || 0).toString(), label: "Kegiatan" },
        ]);
      } catch (err) {
        console.error("Gagal mengambil statistik hero:", err);
      }
    };

    fetchStats();

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    const targets = heroRef.current?.querySelectorAll(".hero-animate");
    targets?.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  return (
    <section 
      id="home" 
      ref={heroRef}
      className={`
        relative min-h-[100svh] flex items-center justify-center text-center
        bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')]
        bg-cover bg-center bg-fixed
      `}
    >
      {/* Overlay: Memainkan opacity dan warna supaya teks tetap kontras */}
      <div 
        className="absolute inset-0 z-[1] bg-gradient-to-b from-[#032121]/75 to-[#1A3636]/90"
      />

      <div className="relative z-[2] flex flex-col items-center max-w-[800px] w-full px-8 pt-20">
        
        {/* Badge */}
        <div
          className="hero-animate opacity-0 translate-y-5 transition-all duration-[600ms] delay-100 mb-8 inline-flex items-center gap-2 font-display text-[0.7rem] font-bold tracking-[0.12em] uppercase bg-white/10 border border-white/20 text-surface px-4 py-1.5 rounded-full"
        >
          <span>✦</span>
          <span>Est. 2023 — Binary Network</span>
        </div>

        {/* Headline */}
        <h1
          className="hero-animate opacity-0 translate-y-6 transition-all duration-[700ms] delay-200 font-display text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-[1.1] tracking-tight text-on-primary drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)] min-h-[2.2em] flex flex-col justify-center items-center"
        >
          <div className="relative text-center w-full">
            {/* Line 1: Selamat Datang */}
            <div className="min-h-[1.2em]">
              {words[index].substring(0, subIndex).split('\n')[0]}
              {!words[index].substring(0, subIndex).includes('\n') && (
                <span className={`inline-block w-[3px] md:w-[5px] h-[0.8em] bg-white ml-1 align-middle transition-opacity duration-100 ${blink ? "opacity-100" : "opacity-0"}`} />
              )}
            </div>
            {/* Line 2: di Kelas Binet / Kami */}
            <div className="min-h-[1.2em] text-secondary-container">
              {words[index].substring(0, subIndex).includes('\n') && (
                <>
                  {words[index].substring(0, subIndex).split('\n')[1]}
                  <span className={`inline-block w-[3px] md:w-[5px] h-[0.8em] bg-secondary-container ml-1 align-middle transition-opacity duration-100 ${blink ? "opacity-100" : "opacity-0"}`} />
                </>
              )}
            </div>
          </div>
        </h1>

        {/* Description */}
        <p
          className="hero-animate opacity-0 translate-y-5 transition-all duration-[700ms] delay-[350ms] font-body text-base/7 md:text-lg/8 text-white/85 max-w-[600px] mt-6"
        >
          Sebuah ruang untuk rasa ingin tahu intelektual dan penemuan bersama.
          Dirancang untuk pelajar modern yang penuh semangat.
        </p>

        {/* Actions */}
        <div
          className="hero-animate opacity-0 translate-y-5 transition-all duration-[700ms] delay-500 mt-10 flex flex-col md:flex-row gap-4 justify-center"
        >
          <a
            href="#jadwal"
            className="font-display text-[0.875rem] font-bold tracking-wider bg-gradient-to-br from-primary to-primary-container text-on-primary border-none rounded-sm px-8 py-3.5 cursor-pointer transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:from-primary-container hover:to-primary hover:tracking-[0.07em] hover:-translate-y-px"
          >
            Lihat Jadwal →
          </a>
          <a
            href="#galeri"
            className="font-display text-[0.875rem] font-semibold text-white bg-transparent border-[1.5px] border-white/40 rounded-sm px-8 py-3.5 cursor-pointer transition-all duration-300 inline-flex items-center justify-center gap-2 hover:border-white hover:bg-white/10"
          >
            Galeri Kelas
          </a>
        </div>

        {/* Stats */}
        <div
          className="hero-animate opacity-0 translate-y-5 transition-all duration-[700ms] delay-[650ms] mt-5 pt-5 border-t border-white/15 w-full flex justify-center gap-8 md:gap-14"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-[1.75rem] md:text-[2rem] font-extrabold text-white leading-none">
                {stat.num}
              </div>
              <div className="font-body text-[0.75rem] md:text-[0.8rem] text-white/70 mt-1 md:mt-1.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
