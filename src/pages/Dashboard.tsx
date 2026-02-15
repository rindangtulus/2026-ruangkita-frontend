import { useEffect, useState } from "react";
import axios from "axios";
import { type Borrowing, type Room } from "../types";

export default function Dashboard({
  setActivePage,
  user,
}: {
  setActivePage: (p: string) => void;
  user: any;
}) {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5276/api/borrowings", {
        params: { userId: user.id, role: user.role },
      })
      .then((res) => setBorrowings(res.data));

    axios
      .get("http://localhost:5276/api/rooms")
      .then((res) => setRooms(res.data));
  }, [user]);

  // const today = new Date().toISOString().split("T")[0];
  // const totalToday = borrowings.filter((b) =>
  //   b.borrowDate.startsWith(today),
  // ).length;

  const pendingCount = borrowings.filter((b) => b.status === "Pending").length;
  const approvedCount = borrowings.filter(
    (b) => b.status === "Approved",
  ).length;
  const rejectedCount = borrowings.filter(
    (b) => b.status === "Rejected",
  ).length;

  const latestBorrowings = [...borrowings]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  return (
    <div className="flex-1 p-10 bg-slate-50 min-h-screen font-sans">
      <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
        <span className="w-2 h-10 bg-pink-400 rounded-full"></span> 📊
        {user.role === "Admin" ? "Ringkasan Sistem" : "Status Peminjamanku"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm transition-transform hover:scale-105">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-amber-600">
            Menunggu
          </p>
          <p className="text-4xl font-black text-amber-500">{pendingCount}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-bold">
            DALAM PROSES
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-green-100 shadow-sm transition-transform hover:scale-105">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-green-600">
            Disetujui
          </p>
          <p className="text-4xl font-black text-green-500">{approvedCount}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-bold">
            SIAP DIGUNAKAN
          </p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-red-100 shadow-sm transition-transform hover:scale-105">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-red-600">
            Ditolak
          </p>
          <p className="text-4xl font-black text-red-500">{rejectedCount}</p>
          <p className="text-[10px] text-slate-400 mt-1 font-bold">
            PERLU REVISI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- SECTION 2: LEFT COLUMN (LATEST ACTIVITY) --- */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              🕒{" "}
              {user.role === "Admin"
                ? "Aktivitas Terbaru"
                : "Riwayat Terakhirku"}
            </h3>
            <button
              onClick={() => setActivePage("borrowing-list")}
              className="text-xs font-bold text-pink-500 bg-pink-50 px-4 py-2 rounded-xl"
            >
              Lihat Semua →
            </button>
          </div>
          <div className="space-y-4">
            {latestBorrowings.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-50"
              >
                <div>
                  <p className="font-bold text-slate-800 leading-tight">
                    {user.role === "Admin"
                      ? b.borrowerName
                      : b.room?.name || "Ruangan"}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {new Date(b.borrowDate).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    b.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : b.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-500"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION 3: RIGHT COLUMN (ACTION/INFO CARD) --- */}
        <div className="bg-pink-600 p-8 rounded-[40px] text-white flex flex-col justify-center relative overflow-hidden shadow-xl shadow-pink-200">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-4 leading-tight">
              Halo, {user.fullName.split(" ")[0]}! 🌸
            </h3>
            <p className="text-pink-100 text-sm leading-relaxed mb-6">
              {user.role === "Admin"
                ? "Ada beberapa permintaan ruangan yang masuk hari ini. Yuk, cek dan berikan keputusanmu!"
                : "Jangan lupa untuk mengembalikan ruangan tepat waktu ya. Cek status permohonanmu secara berkala."}
            </p>

            {/* Tampilan Berbeda Berdasarkan Role */}
            {user.role === "Admin" ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70 text-pink-200">
                    Total Ruangan
                  </p>
                  <p className="text-2xl font-black">{rooms.length} Unit</p>
                </div>
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70 text-pink-200">
                    Total Peminjam
                  </p>
                  <p className="text-2xl font-black">{borrowings.length}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setActivePage("borrowing-list")}
                className="w-full bg-white text-pink-600 py-4 rounded-2xl font-black shadow-lg hover:bg-pink-50 transition-all"
              >
                BUAT PEMINJAMAN BARU
              </button>
            )}
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-pink-400/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
