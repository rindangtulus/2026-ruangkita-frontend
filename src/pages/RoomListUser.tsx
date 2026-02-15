import { useEffect, useState } from "react";
import axios from "axios";
import { type Room } from "../types";

export default function RoomListUser() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5276/api/rooms").then((res) => {
      setRooms(res.data);
      setLoading(false);
    });
  }, []);

  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex-1 p-10 bg-slate-50 min-h-screen font-sans">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <span className="w-2 h-10 bg-pink-400 rounded-full"></span> 🏢
            Katalog Ruangan
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Lihat fasilitas dan kapasitas ruangan PENS.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Cari ruangan..."
            className="w-full px-5 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500 bg-white font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-pink-100 transition-all group cursor-pointer"
            onClick={() => setSelectedRoom(room)}
          >
            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:rotate-12 transition-transform">
              🏫
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-1">
              {room.name}
            </h3>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-4">
              <span>👥 Kapasitas: {room.capacity} Orang</span>
            </div>
            <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest group-hover:bg-pink-600 group-hover:text-white transition-all">
              Detail Fasilitas
            </button>
          </div>
        ))}
      </div>

      {/* --- MODAL DETAIL (Menggunakan properti Facility) --- */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] max-w-md w-full p-8 shadow-2xl relative">
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-slate-800 mb-2">
                {selectedRoom.name}
              </h3>

              <div className="space-y-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">
                    Kapasitas
                  </p>
                  <p className="font-bold text-slate-700">
                    {selectedRoom.capacity} Orang
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">
                    Fasilitas Tersedia
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {selectedRoom.facility || "Tidak ada fasilitas tercatat."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRoom(null)}
                className="w-full bg-slate-800 text-white py-4 rounded-2xl font-black hover:bg-slate-900 transition-all"
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
