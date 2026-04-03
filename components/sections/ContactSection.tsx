"use client";

const contactItems = [
  {
    icon: "🏫",
    label: "Sekolah",
    value: "SMAN / SMKN ...",
    sub: "Alamat sekolah lengkap",
  },
  {
    icon: "📧",
    label: "Email Kelas",
    value: "kelas@example.com",
    sub: "Respon dalam 1×24 jam",
  },
  {
    icon: "📱",
    label: "WhatsApp Grup",
    value: "Kelas XII MIPA",
    sub: "Hubungi ketua kelas",
  },
  {
    icon: "📅",
    label: "Tahun Ajaran",
    value: "2024/2025",
    sub: "Semester Genap",
  },
];

export default function ContactSection() {
  return (
    <section className="py-12 px-8" id="kontak">
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-6">
          <span className="block font-display text-[0.7rem] font-bold tracking-[0.14em] uppercase text-secondary mb-3">
            Hubungi Kami
          </span>
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.2] text-primary">
            Informasi Kontak
          </h2>
          <p className="font-body text-base lg:text-lg font-normal leading-[1.75] text-on-surface-variant max-w-[480px] mt-3">
            Punya pertanyaan atau ingin berkolaborasi? Jangan ragu untuk menghubungi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div>
            {contactItems.map((item) => (
              <div className="flex items-start gap-4 mb-8" key={item.label}>
                <div className="w-11 h-11 rounded-md bg-surface-container flex items-center justify-center shrink-0 text-primary-container text-[1.2rem]">
                  {item.icon}
                </div>
                <div>
                  <div className="font-display text-[0.7rem] font-bold tracking-[0.12em] uppercase text-on-surface-variant mb-1">
                    {item.label}
                  </div>
                  <div className="font-display text-[1.125rem] font-semibold text-primary">
                    {item.value}
                  </div>
                  <div className="font-body text-[0.9rem] leading-[1.7] text-on-surface-variant mt-1">
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Card */}
          <div className="bg-surface-container-lowest rounded-xl p-10 shadow-[0_20px_40px_rgba(27,28,26,0.05)]">
            <h3 className="font-display text-[1.5rem] font-semibold leading-[1.3] text-primary mb-6">
              Kirim Pesan
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Fitur pengiriman pesan akan segera hadir!");
              }}
            >
              <div className="mb-5">
                <label className="block font-display text-[0.7rem] font-bold tracking-[0.12em] uppercase text-on-surface-variant mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama kamu..."
                  className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-sm font-body text-[0.9rem] text-on-surface outline-none transition-colors duration-200 focus:bg-primary-fixed"
                />
              </div>

              <div className="mb-5">
                <label className="block font-display text-[0.7rem] font-bold tracking-[0.12em] uppercase text-on-surface-variant mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="email@contoh.com"
                  className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-sm font-body text-[0.9rem] text-on-surface outline-none transition-colors duration-200 focus:bg-primary-fixed"
                />
              </div>

              <div className="mb-7">
                <label className="block font-display text-[0.7rem] font-bold tracking-[0.12em] uppercase text-on-surface-variant mb-2">
                  Pesan
                </label>
                <textarea
                  placeholder="Tulis pesan kamu..."
                  rows={4}
                  className="w-full px-4 py-3.5 bg-surface-container-high border-none rounded-sm font-body text-[0.9rem] text-on-surface outline-none resize-y transition-colors duration-200 focus:bg-primary-fixed"
                />
              </div>

              <button
                type="submit"
                className="w-full justify-center font-display text-[0.875rem] font-bold tracking-wider bg-gradient-to-br from-primary to-primary-container text-on-primary border-none rounded-sm px-8 py-3.5 cursor-pointer transition-all duration-250 inline-flex items-center gap-2 hover:from-primary-container hover:to-primary hover:tracking-[0.07em] hover:-translate-y-px hover:shadow-[0_12px_32px_rgba(3,33,33,0.25)]"
              >
                Kirim Pesan →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
