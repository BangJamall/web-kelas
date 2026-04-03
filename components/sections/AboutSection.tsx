"use client";

import { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";

export default function AboutSection() {
  const [personil, setPersonil] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
          // Fallback ke dummy 1 item agar tidak kosong melompong jika blm diisi
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

  return (
    <section className="py-16 bg-surface-container-low overflow-hidden relative" id="tentang">
      
      {/* Bagian Teks Header */}
      <div className="max-w-[1280px] mx-auto px-8 mb-12 text-center md:text-left">
        <span className="block font-display text-[0.7rem] font-bold tracking-[0.14em] uppercase text-secondary mb-3">
          Tentang Kami
        </span>
        <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.2] text-primary mb-6 max-w-[600px]">
          Lebih dari Sekedar<br />Ruang Belajar
        </h2>
        <p className="font-body text-base lg:text-lg font-normal leading-[1.75] text-on-surface-variant max-w-[700px]">
          Kelas kami adalah komunitas pelajar yang saling bekerja sama, berbagi kemampuan,
          dan tumbuh sebagai spesialis di bidang teknologi.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-10 font-display text-on-surface-variant">Memuat profil personil...</div>
      ) : (
        /* Bagian Slider (Marquee) */
        <div className="relative w-full flex">
          {/* Kontainer Marquee yang berjalan tanpa henti */}
          <div className="animate-marquee flex w-max gap-6 px-3 hover:[animation-play-state:paused]">
            {/* Kita menggunakan dua array gabungan [personil, personil] jika isinya banyak, agar saat scroll habis tidak terlihat patah (looping mulus) */}
            {/* Pakai 4 set duplicate jika datanya super sedikit supaya marquee tidak putus */}
            {[...personil, ...personil, ...personil, ...personil].slice(0, Math.max(8, personil.length * 2)).map((member, i) => (
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
                    <span>📍</span> Asal: {member.asal_daerah}
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
        </div>
      )}

      {/* Fade overlay (efek bayangan memudar di kiri dan kanan layar) */}
      <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-surface-container-low to-transparent pointer-events-none z-10 bottom-0 top-[300px]" />
      <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-surface-container-low to-transparent pointer-events-none z-10 bottom-0 top-[300px]" />
      
    </section>
  );
}
