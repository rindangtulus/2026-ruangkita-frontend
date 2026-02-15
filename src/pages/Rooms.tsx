import { useState, useEffect } from "react";
import axios from "axios";
import { type Room } from "../types";

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    capacity: 0,
    facility: "",
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isEditing, setIsEditing] = useState<number | null>(null);

  const API_URL = "http://localhost:5276/api/rooms";

  const fetchRooms = async () => {
    try {
      const res = await axios.get(API_URL);
      setRooms(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${isEditing}`, {
          id: isEditing,
          ...formData,
        });
        alert("✅ Ruangan berhasil diperbarui!");
      } else {
        await axios.post(API_URL, formData);
        alert("✅ Ruangan berhasil ditambahkan!");
      }
      setFormData({ name: "", capacity: 0, facility: "" });
      setIsEditing(null);
      fetchRooms();
    } catch (err) {
      alert("❌ Gagal menyimpan ruangan.");
    }
  };

  const handleEditInit = (room: Room) => {
    setFormData({
      name: room.name,
      capacity: room.capacity,
      facility: room.facility,
    });
    setIsEditing(room.id);
    setSelectedRoom(null); // Tutup modal detail saat pindah ke mode edit
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus ruangan ini? Ini juga mungkin menghapus data peminjaman terkait.",
      )
    ) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("🗑️ Ruangan berhasil dihapus!");
        setSelectedRoom(null);
        fetchRooms();
      } catch (err) {
        alert("❌ Gagal menghapus ruangan.");
      }
    }
  };

  return (
    <div className="flex-1 p-10 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">
          🏢 Manajemen Ruangan
        </h2>
        <p className="text-slate-500 text-sm">Tambah dan kelola ruangan</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Tambah Ruangan */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit space-y-4"
        >
          <h3 className="text-lg font-bold text-slate-700 mb-4">
            {isEditing ? "✏️ Edit Ruangan" : "➕ Tambah Ruangan Baru"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Nama Ruangan
              </label>
              <input
                className="w-full p-2.5 border border-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Kapasitas
              </label>
              <input
                type="number"
                className="w-full p-2.5 border border-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-600">
                Fasilitas
              </label>
              <textarea
                className="w-full p-2.5 border border-slate-400 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.facility}
                onChange={(e) =>
                  setFormData({ ...formData, facility: e.target.value })
                }
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-white transition ${isEditing ? "bg-teal-500 hover:bg-teal-600" : "bg-pink-600 hover:bg-pink-700"}`}
          >
            {isEditing ? "Update Ruangan" : "Simpan Ruangan"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(null);
                setFormData({ name: "", capacity: 0, facility: "" });
              }}
              className="w-full text-slate-500 text-sm font-medium hover:underline"
            >
              Batalkan Edit
            </button>
          )}
        </form>

        {/* Daftar Ruangan yang Tersedia */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-700 mb-4">
            Ruangan Tersedia ({rooms.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">
                      {room.name}
                    </h4>
                    <p className="text-xs text-pink-600 font-bold uppercase tracking-wider">
                      {room.capacity} Orang
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRoom(room)}
                    className="text-xs bg-slate-100 px-3 py-1.5 rounded-lg font-bold text-slate-600 hover:bg-pink-600 hover:text-white transition"
                  >
                    Detail
                  </button>
                </div>
                <p className="text-sm text-slate-500 line-clamp-1 italic">
                  Fasilitas: {room.facility}
                </p>
              </div>
            ))}
          </div>
        </div>

        {selectedRoom && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
              <h3 className="text-2xl font-black text-slate-800 mb-2">
                🏛️ {selectedRoom.name}
              </h3>
              <div className="space-y-5 mb-8">
                <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
                  <p className="text-xs font-bold text-pink-400 uppercase mb-1">
                    Fasilitas Utama
                  </p>
                  <p className="text-slate-700 font-medium">
                    {selectedRoom.facility}
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                    Maksimal Kapasitas
                  </p>
                  <p className="font-bold text-slate-800">
                    {selectedRoom.capacity} Orang
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditInit(selectedRoom)}
                    className="flex-1 bg-teal-500 text-white py-3 rounded-xl font-bold hover:bg-teal-600 transition"
                  >
                    Edit Ruangan
                  </button>
                  <button
                    onClick={() => handleDelete(selectedRoom.id)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
                  >
                    Hapus
                  </button>
                </div>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="w-full bg-slate-100 text-slate-500 py-3 rounded-xl font-bold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
