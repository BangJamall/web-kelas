"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalGaleri, setTanggalGaleri] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [namaPersonil, setNamaPersonil] = useState("");
  const [peranPersonil, setPeranPersonil] = useState("");
  const [asalPersonil, setAsalPersonil] = useState("");
  const [medsosPersonil, setMedsosPersonil] = useState("");
  const [selectedPersonilFile, setSelectedPersonilFile] = useState<File | null>(null);
  const [uploadPersonilStatus, setUploadPersonilStatus] = useState("");
  const [hariJadwal, setHariJadwal] = useState("Senin");
  const [mataKuliah, setMataKuliah] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [dosen, setDosen] = useState("");
  const [ruangan, setRuangan] = useState("");
  const [submitJadwalStatus, setSubmitJadwalStatus] = useState("");
  const [activeTab, setActiveTab] = useState("beranda");

  // CRUD states
  const [galeriList, setGaleriList] = useState<any[]>([]);
  const [personilList, setPersonilList] = useState<any[]>([]);
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [editingGaleriId, setEditingGaleriId] = useState<string | null>(null);
  const [editingPersonilId, setEditingPersonilId] = useState<string | null>(null);
  const [editingJadwalId, setEditingJadwalId] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus("");
    }
  };

  const handleFileUpload = async () => {
    if (!editingGaleriId && !selectedFile) return;
    if (!judul.trim()) {
      alert("Harap ketik judul foto terlebih dahulu!");
      return;
    }

    setUploading(true);
    setUploadStatus(selectedFile ? "Mengunggah foto ke Storage..." : "Memperbarui ke Database...");

    try {
      const { supabase } = await import("@/lib/supabase");
      let imageUrl = "";

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('galeri-kelas')
          .upload(fileName, selectedFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('galeri-kelas').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      setUploadStatus("Menyimpan ke Database...");
      if (editingGaleriId) {
        const updateData: any = { judul, deskripsi, tanggal: tanggalGaleri };
        if (imageUrl) updateData.image_url = imageUrl;
        const { error: dbError } = await supabase.from('galeri').update(updateData).eq('id', editingGaleriId);
        if (dbError) throw dbError;
        setUploadStatus("✅ Foto Berhasil Diperbarui!");
      } else {
        const { error: dbError } = await supabase
          .from('galeri')
          .insert([{ judul, deskripsi, tanggal: tanggalGaleri, image_url: imageUrl }]);
        if (dbError) throw dbError;
        setUploadStatus("✅ Foto Berhasil Diupload!");
      }

      setJudul("");
      setDeskripsi("");
      setTanggalGaleri("");
      setSelectedFile(null);
      setEditingGaleriId(null);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setUploadStatus("❌ Gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePersonilFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedPersonilFile(e.target.files[0]);
      setUploadPersonilStatus("");
    }
  };

  const handlePersonilUpload = async () => {
    if (!editingPersonilId && !selectedPersonilFile) return;
    if (!namaPersonil.trim() || !peranPersonil.trim() || !asalPersonil.trim()) {
      alert("Harap isi semua data personil terlebih dahulu!");
      return;
    }

    setUploading(true);
    setUploadPersonilStatus(selectedPersonilFile ? "Mengunggah foto personil ke Storage..." : "Memperbarui ke Database...");

    try {
      const { supabase } = await import("@/lib/supabase");
      let avatarUrl = "";

      if (selectedPersonilFile) {
        const fileExt = selectedPersonilFile.name.split('.').pop();
        const fileName = `personil-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('galeri-kelas')
          .upload(fileName, selectedPersonilFile);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('galeri-kelas').getPublicUrl(fileName);
        avatarUrl = data.publicUrl;
      }

      setUploadPersonilStatus("Menyimpan ke Database...");
      if (editingPersonilId) {
        const updateData: any = { nama: namaPersonil, role: peranPersonil, asal_daerah: asalPersonil, medsos: medsosPersonil };
        if (avatarUrl) updateData.avatar_url = avatarUrl;
        const { error: dbError } = await supabase.from('personil_kelas').update(updateData).eq('id', editingPersonilId);
        if (dbError) throw dbError;
        setUploadPersonilStatus("✅ Personil Berhasil Diperbarui!");
      } else {
        const { error: dbError } = await supabase
          .from('personil_kelas')
          .insert([{ nama: namaPersonil, role: peranPersonil, asal_daerah: asalPersonil, medsos: medsosPersonil, avatar_url: avatarUrl }]);
        if (dbError) throw dbError;
        setUploadPersonilStatus("✅ Personil Berhasil Ditambahkan!");
      }

      setNamaPersonil("");
      setPeranPersonil("");
      setAsalPersonil("");
      setMedsosPersonil("");
      setSelectedPersonilFile(null);
      setEditingPersonilId(null);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setUploadPersonilStatus("❌ Gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleJadwalSubmit = async () => {
    if (!hariJadwal.trim() || !mataKuliah.trim() || !jamMulai.trim() || !jamSelesai.trim() || !dosen.trim() || !ruangan.trim()) {
      alert("Harap isi semua data jadwal terlebih dahulu!");
      return;
    }

    setUploading(true);
    setSubmitJadwalStatus(editingJadwalId ? "Memperbarui ke Database..." : "Menyimpan ke Database...");

    try {
      const { supabase } = await import("@/lib/supabase");

      const scheduleData = { 
        hari: hariJadwal, 
        mata_kuliah: mataKuliah, 
        jam_mulai: jamMulai, 
        jam_selesai: jamSelesai, 
        dosen: dosen, 
        ruangan: ruangan 
      };

      if (editingJadwalId) {
        const { error: dbError } = await supabase.from('jadwal_pelajaran').update(scheduleData).eq('id', editingJadwalId);
        if (dbError) throw dbError;
        setSubmitJadwalStatus("✅ Jadwal Berhasil Diperbarui!");
      } else {
        const { error: dbError } = await supabase.from('jadwal_pelajaran').insert([scheduleData]);
        if (dbError) throw dbError;
        setSubmitJadwalStatus("✅ Jadwal Berhasil Ditambahkan!");
      }

      setMataKuliah("");
      setJamMulai("");
      setJamSelesai("");
      setDosen("");
      setRuangan("");
      setEditingJadwalId(null);
      fetchData();
    } catch (err: any) {
      console.error(err);
      setSubmitJadwalStatus("❌ Gagal: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    let subscription: any;
    
    const fetchSession = async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.replace("/admin/login");
        } else {
          setUser({ email: session.user.email ?? "Admin" });
        }
        setLoading(false);

        const { data } = supabase.auth.onAuthStateChange((_event, sess) => {
          if (!sess) {
            router.replace("/admin/login");
          } else {
            setUser({ email: sess.user.email ?? "Admin" });
          }
        });
        subscription = data.subscription;
      } catch (err) {
        setLoading(false);
        router.replace("/admin/login");
      }
    };

    fetchSession();

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  const fetchData = async () => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const [gRes, pRes, jRes] = await Promise.all([
        supabase.from('galeri').select('*').order('created_at', { ascending: false }),
        supabase.from('personil_kelas').select('*').order('created_at', { ascending: false }),
        supabase.from('jadwal_pelajaran').select('*').order('created_at', { ascending: false })
      ]);
      if (gRes.data) setGaleriList(gRes.data);
      if (pRes.data) setPersonilList(pRes.data);
      if (jRes.data) setJadwalList(jRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string, table: string) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    }
  };

  const handleLogout = async () => {
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="font-display text-on-surface-variant">Memuat dashboard...</div>
      </div>
    );
  }

  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const currentDayName = days[new Date().getDay()];
  const classesToday = jadwalList.filter(j => j.hari === currentDayName);

  const stats = [
    { icon: "👥", label: "Total Personil", value: personilList.length.toString(), sub: "Semua anggota aktif" },
    { icon: "📅", label: `Kelas Hari Ini`, value: classesToday.length.toString(), sub: `(${currentDayName})` },
    { icon: "📸", label: "Foto Galeri", value: galeriList.length.toString(), sub: "Kelola dari sini" },
    { icon: "📚", label: "Total Jadwal", value: jadwalList.length.toString(), sub: "Dalam sepekan" },
  ];

  const getRecentActivity = () => {
    const activities: any[] = [];
    galeriList.forEach(g => {
      if(g.created_at) activities.push({ text: `Foto galeri "${g.judul}" ditambahkan`, time: new Date(g.created_at) });
    });
    personilList.forEach(p => {
      if(p.created_at) activities.push({ text: `Data personil "${p.nama}" dimasukkan`, time: new Date(p.created_at) });
    });
    jadwalList.forEach(j => {
      if(j.created_at) activities.push({ text: `Jadwal "${j.mata_kuliah}" dijadwalkan`, time: new Date(j.created_at) });
    });

    const sorted = activities.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 4);
    
    if (sorted.length === 0) return [{ text: "Belum ada aktivitas tercatat.", time: "-" }];

    return sorted.map(a => {
      const diffMs = Date.now() - a.time.getTime();
      const diffMins = Math.max(0, Math.floor(diffMs / 60000));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      let timeStr = "Baru saja";
      if (diffMins > 0 && diffMins < 60) timeStr = `${diffMins} menit lalu`;
      else if (diffHours > 0 && diffHours < 24) timeStr = `${diffHours} jam lalu`;
      else if (diffDays > 0) timeStr = `${diffDays} hari lalu`;

      return { text: a.text, time: timeStr };
    });
  };

  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-surface-container-low">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-[250px] bg-primary py-8 px-6 flex flex-col z-10 transition-transform duration-300">
        <div className="mb-10">
          <div className="font-display font-extrabold text-[1.1rem] text-primary-fixed tracking-tight">
            Kelas<span className="text-secondary-container">Binet</span>
          </div>
          <div className="font-display text-[0.7rem] text-[#cae8e8]/50 mt-1 tracking-[0.08em] uppercase">
            Class Management
          </div>
        </div>

        <div className="mb-6 p-4 bg-[#cae8e8]/10 rounded-md">
          <div className="font-display font-semibold text-[0.9rem] text-primary-fixed truncate">
            {user?.email ?? "Admin"}
          </div>
          <div className="font-display text-[0.625rem] font-bold tracking-[0.1em] uppercase text-[#cae8e8]/50 mt-1">
            Administrator
          </div>
        </div>

        {/* Nav items */}
        {[
          { id: "beranda", icon: "🏠", label: "Beranda" },
          { id: "personil", icon: "👥", label: "Kelola Personil" },
          { id: "jadwal", icon: "📅", label: "Kelola Jadwal" },
          { id: "galeri", icon: "📸", label: "Kelola Galeri" },
        ].map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              flex items-center gap-3 py-3 px-4 rounded-md mb-1 cursor-pointer transition-colors duration-200 font-display text-[0.875rem]
              ${activeTab === item.id 
                ? "bg-[#cae8e8]/15 font-semibold text-primary-fixed" 
                : "bg-transparent font-normal text-[#cae8e8]/60 hover:bg-[#cae8e8]/10 hover:text-primary-fixed"
              }
            `}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-3 px-4 rounded-md bg-[#ba1a1a]/15 border-none cursor-pointer font-display text-[0.875rem] text-[#ffb4ab] transition-colors duration-200 hover:bg-[#ba1a1a]/25"
          >
            <span>🚪</span>
            <span>Keluar</span>
          </button>

          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 py-3 px-4 mt-2 rounded-md font-display text-[0.875rem] text-[#cae8e8]/50 transition-colors duration-200 hover:text-primary-fixed hover:bg-[#cae8e8]/10"
          >
            <span>🌐</span>
            <span>Lihat Website</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="mx-30 pl-[250px] p-10 max-w-[1440px]">
        {activeTab === "beranda" && (
          <div className="animate-in fade-in duration-300">
            {/* Welcome */}
            <div className="mb-10">
              <span className="block font-display text-[0.7rem] font-bold tracking-[0.14em] uppercase text-secondary mb-3">
                Dashboard Admin
              </span>
              <h1 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.2] text-primary">
                Selamat Datang Kembali.
              </h1>
              <p className="font-body text-[0.9rem] text-on-surface-variant mt-2 max-w-[600px] italic">
                &ldquo;The beautiful thing about learning is that no one can take it away from you.&rdquo;
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
              {stats.map((s) => (
                <div className="bg-surface-container-lowest rounded-xl p-7 transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(27,28,26,0.06)]" key={s.label}>
                  <div className="text-[2rem] mb-3">{s.icon}</div>
                  <div className="font-display text-[1.5rem] font-semibold text-primary">{s.value}</div>
                  <div className="font-display text-[0.7rem] font-bold tracking-[0.12em] uppercase text-secondary mt-1">{s.label}</div>
                  <div className="font-body text-[0.9rem] text-on-surface-variant mt-1.5">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-surface-container-lowest rounded-xl p-7">
              <h2 className="font-display text-[1.125rem] font-semibold text-primary mb-6">
                🕐 Aktivitas Terbaru
              </h2>
              {recentActivity.map((a, i) => (
                <div
                  key={i}
                  className={`pb-4 mb-4 ${i < recentActivity.length - 1 ? "border-b border-outline-variant/20" : ""}`}
                >
                  <div className="font-body text-[0.9rem] text-on-surface">{a.text}</div>
                  <div className="font-display text-[0.625rem] font-bold tracking-[0.1em] uppercase text-on-surface-variant mt-1.5">
                    {a.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "galeri" && (
          <div className="animate-in fade-in duration-300 max-w-[800px]">
            {/* Upload Photo Card */}
            <div className="bg-surface-container-lowest rounded-xl p-7 flex flex-col shadow-sm">
              <h2 className="font-display text-[1.125rem] font-semibold text-primary mb-4">
                {editingGaleriId ? "✏️ Edit Foto Galeri" : "📸 Tambah Foto Galeri"}
              </h2>
              
              <div className="mb-4">
                <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Judul Foto Momen</label>
                <input 
                  type="text" 
                  placeholder="Misal: Juara 1 Futsal" 
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body"
                />
              </div>

              <div className="mb-4">
                <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Deskripsi (Opsional)</label>
                <textarea 
                  placeholder="Ceritakan sedikit tentang momen ini..." 
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  disabled={uploading}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body resize-y"
                />
              </div>

              <div className="mb-4">
                <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Tanggal (Opsional)</label>
                <input 
                  type="date"
                  value={tanggalGaleri}
                  onChange={(e) => setTanggalGaleri(e.target.value)}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body"
                />
              </div>

              <div className={`relative flex-1 border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 flex flex-col items-center justify-center min-h-[180px] ${judul.trim() ? "border-primary/50 bg-surface-container-low hover:bg-surface-container hover:border-primary" : "border-outline-variant/30 bg-surface-container-lowest opacity-60"}`}>
                {/* 1. State: Upload Sukses */}
                {uploadStatus.includes("✅") ? (
                  <div className="flex flex-col items-center z-20">
                    <div className="text-[3rem] mb-2">🎊</div>
                    <div className="font-display text-[1.125rem] font-semibold text-primary mb-1">{uploadStatus}</div>
                    <button 
                      type="button"
                      onClick={() => { setUploadStatus(""); setSelectedFile(null); setJudul(""); setDeskripsi(""); setTanggalGaleri(""); setEditingGaleriId(null); }}
                      className="mt-4 px-4 py-2 rounded-md font-display text-[0.875rem] font-semibold bg-primary text-on-primary hover:bg-primary-container cursor-pointer transition-colors"
                    >
                      {editingGaleriId ? "Selesai" : "Unggah Foto Lain"}
                    </button>
                  </div>
                ) : (
                  /* 2. State: Idle, Selecting, or Editing */
                  <div className="flex flex-col items-center w-full z-20">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={uploading || (!editingGaleriId && !judul.trim())}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    />

                    {/* Icon & Text based on context */}
                    {uploading ? (
                      <>
                        <div className="text-[3rem] animate-pulse mb-2">⏳</div>
                        <div className="font-display text-[1.125rem] font-semibold text-primary">{uploadStatus}</div>
                      </>
                    ) : selectedFile ? (
                      <>
                        <div className="text-[3rem] mb-2">🖼️</div>
                        <div className="font-display text-[1.125rem] font-semibold text-primary">{selectedFile.name}</div>
                      </>
                    ) : editingGaleriId ? (
                      <>
                        <div className="text-[3rem] mb-2">📸</div>
                        <div className="font-display text-[1.125rem] font-semibold text-primary">Biarkan jika tidak ingin ganti foto</div>
                        <div className="font-body text-[0.8rem] text-on-surface-variant mt-2">Atau klik/seret foto baru ke sini.</div>
                      </>
                    ) : (
                      <>
                        <div className="text-[3rem] mb-2">📤</div>
                        <div className="font-display text-[1.125rem] font-semibold text-primary">
                          {!judul.trim() ? "Isi judul terlebih dahulu" : "Klik atau seret file ke sini"}
                        </div>
                        <div className="font-body text-[0.8rem] text-on-surface-variant mt-2">Format gambar JPG / PNG.</div>
                      </>
                    )}

                    {/* Action Buttons for Selected or Editing */}
                    {(selectedFile || editingGaleriId) && !uploading && (
                      <div className="flex gap-3 mt-6 relative z-30">
                        <button 
                          type="button"
                          onClick={(e) => { 
                            e.stopPropagation();
                            setSelectedFile(null); 
                            setUploadStatus(""); 
                            if(editingGaleriId) { setEditingGaleriId(null); setJudul(""); setDeskripsi(""); setTanggalGaleri(""); } 
                          }}
                          className="px-4 py-2 rounded-md font-display text-[0.875rem] font-semibold bg-surface-dim text-on-surface hover:bg-surface-dim/80 cursor-pointer transition-colors"
                        >
                          Batal
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleFileUpload(); }}
                          className="px-6 py-2 rounded-md font-display text-[0.875rem] font-semibold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container cursor-pointer transition-colors"
                        >
                          {editingGaleriId ? "Perbarui Data" : "Mulai Upload"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* List Data Galeri */}
            <div className="mt-8 bg-surface-container-lowest rounded-xl p-7 shadow-sm">
              <h3 className="font-display text-[1rem] font-semibold text-primary mb-4">Daftar Foto Galeri</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galeriList.length === 0 ? (
                  <div className="col-span-full text-center text-on-surface-variant text-sm py-4">Belum ada foto galeri</div>
                ) : (
                  galeriList.map(g => (
                    <div key={g.id} className="flex gap-3 items-center bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                      <img src={g.image_url} alt={g.judul} className="w-16 h-16 rounded object-cover border border-outline-variant/20" />
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-medium text-[0.9rem] text-primary truncate">{g.judul}</div>
                        <div className="font-body text-[0.75rem] text-on-surface-variant truncate">{g.tanggal || "Tanpa tanggal"}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => { setEditingGaleriId(g.id); setJudul(g.judul); setDeskripsi(g.deskripsi || ""); setTanggalGaleri(g.tanggal || ""); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[0.7rem] uppercase tracking-wide font-bold px-2 py-1 bg-secondary-container text-on-secondary-container rounded hover:bg-secondary hover:text-on-secondary transition-colors">Edit</button>
                        <button onClick={() => handleDelete(g.id, 'galeri')} className="text-[0.7rem] uppercase tracking-wide font-bold px-2 py-1 bg-error-container text-on-error-container rounded hover:bg-error hover:text-on-error transition-colors">Hapus</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "personil" && (
          <div className="animate-in fade-in duration-300 max-w-[800px]">
            {/* Upload Personil Card */}
            <div className="bg-surface-container-lowest rounded-xl p-7 flex flex-col shadow-sm">
              <h2 className="font-display text-[1.125rem] font-semibold text-primary mb-4">
                {editingPersonilId ? "✏️ Edit Data Personil" : "👥 Tambah Data Personil"}
              </h2>
              
              <div className="mb-4">
                <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Nama Personil</label>
                <input 
                  type="text" 
                  placeholder="Misal: Budi Santoso" 
                  value={namaPersonil}
                  onChange={(e) => setNamaPersonil(e.target.value)}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body"
                />
              </div>

              <div className="mb-4">
                <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Peran / Jabatan</label>
                <input 
                  type="text" 
                  placeholder="Misal: Spesialis Komedi" 
                  value={peranPersonil}
                  onChange={(e) => setPeranPersonil(e.target.value)}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body"
                />
              </div>

              <div className="mb-4">
                <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Daerah Asal</label>
                <input 
                  type="text" 
                  placeholder="Misal: Makassar" 
                  value={asalPersonil}
                  onChange={(e) => setAsalPersonil(e.target.value)}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body"
                />
              </div>

              <div className="mb-4">
                <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Sosial Media (IG Opsional)</label>
                <input 
                  type="text" 
                  placeholder="Misal: @budi_santoso" 
                  value={medsosPersonil}
                  onChange={(e) => setMedsosPersonil(e.target.value)}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body"
                />
              </div>

              <div className={`relative flex-1 border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 flex flex-col items-center justify-center min-h-[180px] ${namaPersonil.trim() && peranPersonil.trim() && asalPersonil.trim() ? "border-primary/50 bg-surface-container-low hover:bg-surface-container hover:border-primary" : "border-outline-variant/30 bg-surface-container-lowest opacity-60"}`}>
                {/* 1. State: Upload Sukses */}
                {uploadPersonilStatus.includes("✅") ? (
                  <div className="flex flex-col items-center z-20">
                    <div className="text-[3rem] mb-2">🎊</div>
                    <div className="font-display text-[1.125rem] font-semibold text-primary mb-1">{uploadPersonilStatus}</div>
                    <button 
                      type="button"
                      onClick={() => { setUploadPersonilStatus(""); setSelectedPersonilFile(null); setNamaPersonil(""); setPeranPersonil(""); setAsalPersonil(""); setMedsosPersonil(""); setEditingPersonilId(null); }}
                      className="mt-4 px-4 py-2 rounded-md font-display text-[0.875rem] font-semibold bg-primary text-on-primary hover:bg-primary-container cursor-pointer transition-colors"
                    >
                      {editingPersonilId ? "Selesai" : "Tambah Personil Lain"}
                    </button>
                  </div>
                ) : (
                  /* 2. State: Idle, Selecting, or Editing */
                  <div className="flex flex-col items-center w-full z-20">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handlePersonilFileSelect}
                      disabled={uploading || (!editingPersonilId && (!namaPersonil.trim() || !peranPersonil.trim() || !asalPersonil.trim()))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                    />

                    {/* Icon & Text based on context */}
                    {uploading ? (
                      <>
                        <div className="text-[3rem] animate-pulse mb-2">⏳</div>
                        <div className="font-display text-[1.125rem] font-semibold text-primary">{uploadPersonilStatus}</div>
                      </>
                    ) : selectedPersonilFile ? (
                      <>
                        <div className="text-[3rem] mb-2">🖼️</div>
                        <div className="font-display text-[1.125rem] font-semibold text-primary">{selectedPersonilFile.name}</div>
                      </>
                    ) : editingPersonilId ? (
                      <>
                        <div className="text-[3rem] mb-2">📸</div>
                        <div className="font-display text-[1.125rem] font-semibold text-primary">Biarkan jika tidak ingin ganti foto</div>
                        <div className="font-body text-[0.8rem] text-on-surface-variant mt-2">Atau klik/seret foto baru ke sini.</div>
                      </>
                    ) : (
                      <>
                        <div className="text-[3rem] mb-2">📤</div>
                        <div className="font-display text-[1.125rem] font-semibold text-primary">
                          {!namaPersonil.trim() || !peranPersonil.trim() || !asalPersonil.trim() ? "Isi semua data personil di atas terlebih dahulu" : "Klik atau seret foto personil ke sini"}
                        </div>
                        <div className="font-body text-[0.8rem] text-on-surface-variant mt-2">Format gambar JPG / PNG.</div>
                      </>
                    )}

                    {/* Action Buttons for Selected or Editing */}
                    {(selectedPersonilFile || editingPersonilId) && !uploading && (
                      <div className="flex gap-3 mt-6 relative z-30">
                        <button 
                          type="button"
                          onClick={(e) => { 
                            e.stopPropagation();
                            setSelectedPersonilFile(null); 
                            setUploadPersonilStatus(""); 
                            if(editingPersonilId) { setEditingPersonilId(null); setNamaPersonil(""); setPeranPersonil(""); setAsalPersonil(""); setMedsosPersonil(""); } 
                          }}
                          className="px-4 py-2 rounded-md font-display text-[0.875rem] font-semibold bg-surface-dim text-on-surface hover:bg-surface-dim/80 cursor-pointer transition-colors"
                        >
                          Batal
                        </button>
                        <button 
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handlePersonilUpload(); }}
                          className="px-6 py-2 rounded-md font-display text-[0.875rem] font-semibold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container cursor-pointer transition-colors"
                        >
                          {editingPersonilId ? "Perbarui Data" : "Mulai Upload"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* List Data Personil */}
            <div className="mt-8 bg-surface-container-lowest rounded-xl p-7 shadow-sm">
              <h3 className="font-display text-[1rem] font-semibold text-primary mb-4">Daftar Personil Kelas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {personilList.length === 0 ? (
                  <div className="col-span-full text-center text-on-surface-variant text-sm py-4">Belum ada data personil</div>
                ) : (
                  personilList.map(p => (
                    <div key={p.id} className="flex gap-3 items-center bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                      {p.avatar_url ? (
                        <img src={p.avatar_url} alt={p.nama} className="w-16 h-16 rounded-full object-cover border-2 border-outline-variant/20" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-2xl border-2 border-outline-variant/20">👨‍💻</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-medium text-[0.9rem] text-primary truncate">{p.nama}</div>
                        <div className="font-body text-[0.75rem] text-on-surface-variant truncate">{p.role}</div>
                        <div className="font-body text-[0.75rem] text-on-surface-variant truncate">{p.asal_daerah}</div>
                        <div className="font-body text-[0.75rem] text-on-surface-variant truncate">{p.medsos}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => { setEditingPersonilId(p.id); setNamaPersonil(p.nama); setPeranPersonil(p.role || ""); setAsalPersonil(p.asal_daerah || ""); setMedsosPersonil(p.medsos || ""); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[0.7rem] uppercase tracking-wide font-bold px-2 py-1 bg-secondary-container text-on-secondary-container rounded hover:bg-secondary hover:text-on-secondary transition-colors">Edit</button>
                        <button onClick={() => handleDelete(p.id, 'personil_kelas')} className="text-[0.7rem] uppercase tracking-wide font-bold px-2 py-1 bg-error-container text-on-error-container rounded hover:bg-error hover:text-on-error transition-colors">Hapus</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "jadwal" && (
          <div className="animate-in fade-in duration-300 max-w-[800px]">
            {/* Form Jadwal Card */}
            <div className="bg-surface-container-lowest rounded-xl p-7 flex flex-col shadow-sm">
              <h2 className="font-display text-[1.125rem] font-semibold text-primary mb-6">
                {editingJadwalId ? "✏️ Edit Jadwal Pelajaran" : "📅 Tambah Jadwal Pelajaran"}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Hari</label>
                  <select 
                    value={hariJadwal}
                    onChange={(e) => setHariJadwal(e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body appearance-none cursor-pointer"
                  >
                    <option value="Senin">Senin</option>
                    <option value="Selasa">Selasa</option>
                    <option value="Rabu">Rabu</option>
                    <option value="Kamis">Kamis</option>
                    <option value="Jumat">Jumat</option>
                    <option value="Sabtu">Sabtu</option>
                    <option value="Minggu">Minggu</option>
                  </select>
                </div>
                <div>
                  <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Mata Kuliah</label>
                  <input 
                    type="text" 
                    placeholder="Misal: Pemrograman Web" 
                    value={mataKuliah}
                    onChange={(e) => setMataKuliah(e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Jam Mulai</label>
                  <input 
                    type="time" 
                    value={jamMulai}
                    onChange={(e) => setJamMulai(e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body"
                  />
                </div>
                <div>
                  <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Jam Selesai</label>
                  <input 
                    type="time" 
                    value={jamSelesai}
                    onChange={(e) => setJamSelesai(e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Dosen / Pengajar</label>
                  <input 
                    type="text" 
                    placeholder="Misal: Dr. Budi Santoso" 
                    value={dosen}
                    onChange={(e) => setDosen(e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body"
                  />
                </div>
                <div>
                  <label className="block font-display text-[0.75rem] font-bold tracking-widest uppercase text-on-surface-variant mb-2">Ruangan</label>
                  <input 
                    type="text" 
                    placeholder="Misal: Lab Komputer 1" 
                    value={ruangan}
                    onChange={(e) => setRuangan(e.target.value)}
                    disabled={uploading}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-lg outline-none focus:border-primary transition-colors text-on-surface font-body"
                  />
                </div>
              </div>

              {submitJadwalStatus && !submitJadwalStatus.includes("✅") && (
                <div className="mb-4 font-body text-[0.9rem] font-semibold text-error text-center">
                  {submitJadwalStatus}
                </div>
              )}

              {submitJadwalStatus.includes("✅") ? (
                <div className="flex flex-col items-center p-6 bg-[#cae8e8]/10 rounded-lg border border-[#cae8e8]/20">
                  <div className="text-[3rem] mb-2">🎊</div>
                  <div className="font-display text-[1.125rem] font-semibold text-primary mb-4 text-center">
                    {submitJadwalStatus}
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSubmitJadwalStatus("")}
                    className="px-6 py-2 rounded-md font-display text-[0.875rem] font-semibold bg-primary text-on-primary hover:bg-primary-container cursor-pointer transition-colors"
                  >
                    Tambah Jadwal Lain
                  </button>
                </div>
              ) : (
                <div className="flex justify-end mt-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => { setSubmitJadwalStatus(""); if(editingJadwalId) { setEditingJadwalId(null); setMataKuliah(""); setJamMulai(""); setJamSelesai(""); setDosen(""); setRuangan(""); } }}
                    className="px-6 py-3 rounded-md font-display text-[0.875rem] font-semibold bg-surface-dim text-on-surface hover:bg-surface-dim/80 cursor-pointer transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="button"
                    onClick={handleJadwalSubmit}
                    disabled={uploading || !hariJadwal.trim() || !mataKuliah.trim() || !jamMulai.trim() || !jamSelesai.trim() || !dosen.trim() || !ruangan.trim()}
                    className="px-8 py-3 rounded-md font-display text-[0.875rem] font-semibold bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Menyimpan..." : (editingJadwalId ? "Perbarui Jadwal" : "Simpan Jadwal")}
                  </button>
                </div>
              )}
            </div>

            {/* List Data Jadwal */}
            <div className="mt-8 bg-surface-container-lowest rounded-xl p-7 shadow-sm">
              <h3 className="font-display text-[1rem] font-semibold text-primary mb-4">Daftar Jadwal Kelas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {jadwalList.length === 0 ? (
                  <div className="col-span-full text-center text-on-surface-variant text-sm py-4">Belum ada data jadwal</div>
                ) : (
                  jadwalList.map(j => (
                    <div key={j.id} className="flex flex-col gap-2 bg-surface-container-low p-4 rounded-lg border border-outline-variant/30">
                      <div className="flex justify-between items-start">
                        <div className="font-display font-medium text-[0.95rem] text-primary">{j.mata_kuliah}</div>
                        <div className="font-display text-[0.7rem] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded">{j.hari}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 align-top text-[0.8rem] text-on-surface-variant font-body">
                        <div>⏰ {j.jam_mulai} - {j.jam_selesai}</div>
                        <div>🚪 {j.ruangan}</div>
                        <div className="col-span-2">👨‍🏫 {j.dosen}</div>
                      </div>
                      <div className="flex gap-2 justify-end mt-2">
                        <button onClick={() => { setEditingJadwalId(j.id); setHariJadwal(j.hari); setMataKuliah(j.mata_kuliah); setJamMulai(j.jam_mulai); setJamSelesai(j.jam_selesai); setDosen(j.dosen); setRuangan(j.ruangan); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[0.7rem] uppercase tracking-wide font-bold px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded hover:bg-secondary hover:text-on-secondary transition-colors">Edit</button>
                        <button onClick={() => handleDelete(j.id, 'jadwal_pelajaran')} className="text-[0.7rem] uppercase tracking-wide font-bold px-3 py-1.5 bg-error-container text-on-error-container rounded hover:bg-error hover:text-on-error transition-colors">Hapus</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
