"use client";

import { useEffect, useState } from "react";
import { FaRegClock, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";

const dayOrder: Record<string, number> = {
  "Senin": 1,
  "Selasa": 2,
  "Rabu": 3,
  "Kamis": 4,
  "Jumat": 5,
  "Sabtu": 6,
  "Minggu": 7
};

const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function ScheduleSection() {
  const [schedule, setSchedule] = useState<{ day: string; items: any[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState("");

  useEffect(() => {
    // Set initial active day based on current date
    const todayIndex = new Date().getDay();
    setActiveDay(days[todayIndex]);

    const fetchSchedule = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data, error } = await supabase
          .from("jadwal_pelajaran")
          .select("*");

        if (error) throw error;

        if (data) {
          const grouped = data.reduce((acc: any, curr: any) => {
            const day = curr.hari;
            if (!acc[day]) acc[day] = [];
            
            const timeStart = curr.jam_mulai ? curr.jam_mulai.substring(0, 5) : "";
            const timeEnd = curr.jam_selesai ? curr.jam_selesai.substring(0, 5) : "";

            acc[day].push({
              rawStart: curr.jam_mulai,
              time: `${timeStart} - ${timeEnd}`,
              subject: curr.mata_kuliah,
              room: curr.ruangan,
              dosen: curr.dosen
            });
            return acc;
          }, {});

          const formattedSchedule = Object.keys(grouped)
            .map((dayName) => ({
              day: dayName,
              items: grouped[dayName].sort((a: any, b: any) => 
                (a.rawStart || "").localeCompare(b.rawStart || "")
              )
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

  const activeItems = schedule.find(s => s.day === activeDay)?.items || [];

  return (
    <section className="py-14 px-6 md:px-8 bg-surface-container-low" id="jadwal">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-12">
          <span className="block font-display text-[0.75rem] font-bold tracking-[0.14em] uppercase text-secondary mb-3">
            Academic Itinerary
          </span>
          <h2 className="font-display text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-tight text-primary">
            Jadwal Pelajaran
          </h2>
        </div>

        {/* Day Selection Tabs */}
        <div className="flex overflow-x-auto pb-4 mb-8 no-scrollbar gap-2 md:justify-center scroll-smooth">
          {Object.keys(dayOrder).map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`
                px-6 py-2.5 rounded-full font-display text-[0.875rem] font-bold whitespace-nowrap transition-all duration-300
                ${activeDay === day 
                  ? "bg-primary text-on-primary shadow-lg scale-105" 
                  : "bg-white text-on-surface-variant hover:bg-surface-dim border border-outline-variant/10"}
              `}
            >
              {day}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="font-display text-[1rem] font-semibold text-primary animate-pulse">Menyiapkan Agenda...</div>
          </div>
        ) : (
          <div className="space-y-4 max-w-[800px] mx-auto">
            {activeItems.length > 0 ? (
              activeItems.map((item, i) => (
                <div 
                  key={i}
                  className="group bg-white rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 shadow-sm border border-outline-variant/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Time Block */}
                  <div className="flex-shrink-0 md:w-32">
                    <div className="flex items-center gap-2 text-secondary font-bold text-[0.9rem] tracking-wide mb-1">
                      <FaRegClock /> Waktu
                    </div>
                    <div className="font-display text-[1.125rem] font-extrabold text-primary">
                      {item.time}
                    </div>
                  </div>

                  {/* Divider for Desktop */}
                  <div className="hidden md:block w-px h-12 bg-outline-variant/20"></div>

                  {/* Main Content */}
                  <div className="flex-grow min-w-0">
                    <h3 className="font-display text-[1.25rem] font-extrabold text-primary group-hover:text-secondary-container transition-colors mb-3">
                      {item.subject}
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/10 min-w-0">
                        <FaMapMarkerAlt className="text-secondary/70 shrink-0" />
                        <span className="font-body text-[0.875rem] font-medium">{item.room || "Ruangan tba"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-on-surface-variant bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/10 min-w-0">
                        <FaUserTie className="text-secondary/70 shrink-0" />
                        <span className="font-body text-[0.875rem] font-medium">{item.dosen || "Dosen tba"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-white/50 rounded-3xl border-2 border-dashed border-outline-variant/20">
                <div className="text-[3.5rem] mb-4">💤</div>
                <h4 className="font-display text-[1.25rem] font-bold text-primary mb-2">Libur Dulu, Bos!</h4>
                <p className="font-body text-on-surface-variant max-w-[280px] mx-auto">
                  Belum ada jadwal yang terdaftar untuk hari {activeDay}. Nikmati waktu istirahatmu.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

