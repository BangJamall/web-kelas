"use client";

import { useEffect, useState } from "react";

const dayOrder: Record<string, number> = {
  "Senin": 1,
  "Selasa": 2,
  "Rabu": 3,
  "Kamis": 4,
  "Jumat": 5,
  "Sabtu": 6,
  "Minggu": 7
};

export default function ScheduleSection() {
  const [schedule, setSchedule] = useState<{ day: string; items: any[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase
          .from("jadwal_pelajaran")
          .select("*");

        if (error) throw error;

        if (data) {
          // Kelompokkan data berdasarkan hari
          const grouped = data.reduce((acc: any, curr: any) => {
            const day = curr.hari;
            if (!acc[day]) {
              acc[day] = [];
            }
            // Parse time format if needed, assuming the DB just holds strings like '08:00'
            const timeStart = curr.jam_mulai ? curr.jam_mulai.substring(0, 5) : "";
            const timeEnd = curr.jam_selesai ? curr.jam_selesai.substring(0, 5) : "";

            acc[day].push({
              rawStart: curr.jam_mulai, // for sorting
              time: `${timeStart} - ${timeEnd}`,
              subject: curr.mata_kuliah,
              room: `${curr.ruangan} • ${curr.dosen}`
            });
            return acc;
          }, {});

          // Konversi ke array, sort berdasarkan hari, dan sort item didalamnya berdasarkan waktu terawal
          const formattedSchedule = Object.keys(grouped)
            .map((dayName) => ({
              day: dayName,
              items: grouped[dayName].sort((a: any, b: any) => {
                return (a.rawStart || "").localeCompare(b.rawStart || "");
              })
            }))
            .sort((a, b) => (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99));

          setSchedule(formattedSchedule);
        }
      } catch (err) {
        console.error("Error fetching schedule:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <section className="py-24 px-8 bg-surface-container-low" id="jadwal">
      <div className="max-w-[1280px] mx-auto">
        <div className="">
          <span className="block font-display text-[0.7rem] font-bold tracking-[0.14em] uppercase text-secondary mb-3">
            Academic Itinerary
          </span>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.2] text-primary mb-5">
            Jadwal Pelajaran
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-10 font-display text-on-surface-variant">
            Memuat jadwal...
          </div>
        ) : schedule.length === 0 ? (
          <div className="text-center py-10 font-display text-on-surface-variant">
            Belum ada jadwal yang diatur.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.map((day) => (
              <div className="bg-surface-container-lowest rounded-lg overflow-hidden h-fit shadow-sm" key={day.day}>
                <div className="bg-primary text-on-primary py-3.5 px-5 font-display text-md font-bold tracking-[0.08em] uppercase border-b border-primary-container/20">
                  {day.day}
                </div>
                {day.items.map((item, i) => (
                  <div 
                    className={`py-4 px-5 cursor-pointer transition-colors duration-200 hover:bg-surface-container-low/50 ${
                      i !== day.items.length - 1 ? "border-b border-outline-variant/15" : ""
                    }`} 
                    key={i}
                  >
                    <div className="font-display text-[0.8rem] font-bold tracking-[0.08em] uppercase text-secondary mb-1">
                      {item.time}
                    </div>
                    <div className="font-display text-base font-bold text-on-surface">
                      {item.subject}
                    </div>
                    <div className="font-body text-[0.85rem] text-on-surface-variant mt-1.5 flex items-start gap-1.5">
                      <span className="opacity-70 mt-0.5">📍</span> {item.room}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
