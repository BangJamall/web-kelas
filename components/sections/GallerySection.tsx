"use client";

import { useEffect, useState } from "react";

const placeholderColors = [
  "from-[#1A3636] to-[#476363]",
  "from-[#2b3506] to-[#606C38]",
  "from-[#735c00] to-[#D4AF37]",
  "from-[#032121] to-[#1A3636]",
  "from-[#304b4b] to-[#aecccc]",
];

const spanClasses = [
  "col-span-1 md:col-span-2 aspect-[16/9]",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[4/3]",
  "col-span-1 md:col-span-2 aspect-[16/7]"
];

export default function GallerySection() {
  const [gallery, setGallery] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase
          .from('galeri')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          setGallery(data);
        }
      } catch (err) {
        console.error("Error fetching gallery:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <section className="py-12 px-8" id="galeri">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-6 flex flex-col items-center">
          <span className="block font-display text-[0.7rem] font-bold tracking-[0.14em] uppercase text-secondary mb-3">
            Class Galery
          </span>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.2] text-primary">
            Galeri Kelas
          </h2>
          <p className="font-body text-center lg:text-lg font-normal leading-[1.25] text-on-surface-variant max-w-[520px] mt-3">
            Jurnal visual dari pertumbuhan bersama, debat seru, dan momen-momen penemuan kelas kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
          {loading ? (
             <div className="col-span-1 md:col-span-3 text-center py-10 font-display text-on-surface-variant">Memuat galeri...</div>
          ) : gallery.length === 0 ? (
             <div className="col-span-1 md:col-span-3 text-center py-10 font-display text-on-surface-variant">Belum ada foto galeri.</div>
          ) : (
            gallery.map((item, i) => (
              <div 
                className={`relative rounded-xl overflow-hidden cursor-pointer group ${spanClasses[i % spanClasses.length]}`} 
                key={item.id || i}
                onClick={() => setSelectedImage(item)}
              >
                {/* Real Foto */}
                <div
                  className={`w-full h-full min-h-[180px] flex flex-col items-center justify-center gap-3 bg-gradient-to-br ${placeholderColors[i % placeholderColors.length]}`}
                >
                  <img 
                    src={item.image_url} 
                    alt={item.judul} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a]/80 to-transparent opacity-0 transition-opacity duration-300 flex flex-col justify-end p-5 group-hover:opacity-100">
                  <div className="font-display text-[1rem] font-semibold text-[#faf9f5]/90 mb-1">
                    {item.judul}
                  </div>
                  {item.deskripsi && (
                    <div className="font-body text-[0.8rem] text-[#cae8e8]/70">
                      {item.deskripsi}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal View */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#032121]/90 backdrop-blur-sm transition-all duration-300 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-low/80 text-on-surface hover:bg-surface-container transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            {/* Image Section */}
            <div className="w-full md:w-2/3 bg-[#132A2A] flex items-center justify-center h-[50vh] md:h-auto md:min-h-[60vh]">
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.judul} 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col bg-surface-container-lowest overflow-y-auto">
              <span className="font-display text-[0.7rem] font-bold tracking-[0.14em] uppercase text-secondary mb-2">
                Momen Kelas
              </span>
              <h3 className="font-display text-[1.5rem] font-bold text-primary mb-4 leading-tight">
                {selectedImage.judul}
              </h3>
              
              {selectedImage.tanggal && (
                <div className="flex items-center gap-2 mb-4 text-[0.85rem] font-body text-on-surface-variant bg-surface-container-low w-fit px-3 py-1.5 rounded-md border border-outline-variant/30">
                  <span>📅</span>
                  {new Date(selectedImage.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </div>
              )}

              <p className="font-body text-[0.95rem] text-on-surface-variant leading-[1.6]">
                {selectedImage.deskripsi || "Tidak ada deskripsi tambahan untuk foto ini."}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
