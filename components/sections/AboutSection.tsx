"use client";

import { useEffect, useState, useRef } from "react";
import { FaInstagram, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

export default function AboutSection() {
  const [personil, setPersonil] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPersonil = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase
          .from("personil_kelas")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        
        if (data && data.length > 0) {
          setPersonil(data);
        } else {
          setPersonil([{ nama: "Belum Ada Data", role: "Menunggu Input Admin", asal_daerah: "-" }]);
        }
      } catch (err) {
        console.error("Error fetching personil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonil();
  }, []);

  // Auto-scroll loop
  useEffect(() => {
    if (loading || isPaused || personil.length < 3) return;

    let animationFrameId: number;
    const scrollContainer = scrollRef.current;

    const scroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollLeft += 0.6; // Kecepatan jalan otomatis

        // Cek jika sudah sampai di tengah (karena array diduplikasi)
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 1;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [loading, isPaused, personil]);

  const scrollManual = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Satu box + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section 
      className="py-16 bg-surface-container-low overflow-hidden relative group" 
      id="tentang"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* Bagian Teks Header */}
      <div className="max-w-[1280px] mx-auto px-8 mb-12 text-center flex flex-col items-center">
        <span className="block font-display text-[0.7rem] font-bold tracking-[0.14em] uppercase text-secondary mb-3">
          About Us
        </span>
        <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.2] text-primary mb-6 max-w-[600px]">
          Lebih dari Sekedar<br />Ruang Belajar
        </h2>
        <p className="font-body text-base lg:text-lg font-normal leading-[1.75] text-on-surface-variant max-w-[700px]">
          Ladies and gentlemen, welcome to our class
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 font-display text-on-surface-variant">Memuat profil personil...</div>
      ) : (
        <div className="relative w-full">
          {/* Navigation Buttons - Muncul saat hover */}
          <button 
            onClick={() => scrollManual("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-primary shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-primary hover:text-white"
            aria-label="Previous"
          >
            <FaChevronLeft size={20} />
          </button>
          
          <button 
            onClick={() => scrollManual("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-primary shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-primary hover:text-white"
            aria-label="Next"
          >
            <FaChevronRight size={20} />
          </button>

          {/* Slider Container */}
          <div 
            ref={scrollRef}
            className="flex w-full overflow-x-auto no-scrollbar gap-6 px-10 py-12 scroll-smooth"
          >
            {/* Kita menduplikasi array untuk efek infinite scroll */}
            {[...personil, ...personil].map((member, i) => (
              <div
                key={i}
                className="bg-surface-container-lowest rounded-xl p-6 min-w-[240px] md:min-w-[280px] flex-shrink-0 transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg border border-outline-variant/30"
              >
                {member.avatar_url ? (
                  <div className="w-20 h-20 mb-4 rounded-full overflow-hidden border-2 border-primary/20 bg-surface-container">
                    <img src={member.avatar_url} alt={member.nama} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="text-[2.5rem] mb-4 bg-surface-container p-3 rounded-full w-20 h-20 flex items-center justify-center border-2 border-primary/20">
                    👨‍💻
                  </div>
                )}
                
                <div className="font-display text-[1.125rem] font-bold text-primary mb-1">
                  {member.nama}
                </div>
                <div className="font-display text-[0.75rem] font-bold tracking-[0.05em] uppercase text-secondary mb-3">
                  {member.role}
                </div>
                <div className="text-sm font-body text-on-surface-variant flex flex-col gap-1.5 opacity-80 mt-auto pt-2 border-t border-outline-variant/20">
                  <div className="flex items-center gap-1.5">
                    <FaLocationDot size={12} className="text-secondary/70 shrink-0" />
                    <span>{member.asal_daerah}</span>
                  </div>
                  {member.medsos && (
                    <a 
                      href={`https://instagram.com/${member.medsos.replace('@', '')}`}
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-1.5 hover:text-primary transition-colors text-xs"
                    >
                      <FaInstagram size={14} /> 
                      {member.medsos.startsWith('@') ? member.medsos : `@${member.medsos}`}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Fade overlays */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-container-low to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface-container-low to-transparent pointer-events-none z-10" />
        </div>
      )}
      
    </section>
  );
}
