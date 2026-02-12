import { useEffect, useState } from "react";
import axios from "axios";
import { type Borrowing, type Room } from "../types";

export default function Dashboard() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBorrowing, setSelectedBorrowing] = useState<Borrowing | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomId: 0,
    borrowerName: "",
    borrowDate: "",
    returnDate: "",
    purpose: "",
  });

  const API_URL = "http://localhost:5276/api/borrowings";

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL, {
        params: { search: searchTerm, status: statusFilter },
      });
      setBorrowings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchData(), 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    axios
      .get("http://localhost:5276/api/rooms")
      .then((res) => setRooms(res.data));
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await axios.patch(`${API_URL}/${id}/status`, { status: newStatus });
      alert(`Status berhasil diubah menjadi ${newStatus}`);
      setSelectedBorrowing(null);
      fetchData();
    } catch (err) {
      alert("Gagal mengubah status");
    }
  };

  const handleEditClick = (b: Borrowing) => {
    setFormData({
      roomId: b.roomId,
      borrowerName: b.borrowerName,
      borrowDate: b.borrowDate.substring(0, 16),
      returnDate: b.returnDate.substring(0, 16),
      purpose: b.purpose,
    });
    setIsEditing(b.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Hapus data secara permanen?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert("Data berhasil dihapus!");
        setSelectedBorrowing(null);
        fetchData();
      } catch (err) {
        alert("Gagal menghapus data.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Ambil data asli jika sedang mengedit untuk mempertahankan status
      const existingData = borrowings.find((b) => b.id === isEditing);

      // 2. Susun Payload dengan sangat hati-hati
      const payload = {
        id: isEditing || 0, // Beberapa Backend butuh ID di dalam body saat PUT
        roomId: Number(formData.roomId),
        borrowerName: formData.borrowerName,
        borrowDate: new Date(formData.borrowDate).toISOString(),
        returnDate: new Date(formData.returnDate).toISOString(),
        purpose: formData.purpose,
        status: existingData ? existingData.status : "Pending",
      };

      console.log("Payload dikirim:", payload);

      if (isEditing) {
        // Gunakan PUT untuk Update
        await axios.put(`${API_URL}/${isEditing}`, payload);
        alert("✅ Data berhasil diperbarui!");
      } else {
        // Gunakan POST untuk Tambah Baru
        await axios.post(API_URL, payload);
        alert("✅ Peminjaman Berhasil Dicatat!");
      }

      // Reset & Refresh
      setFormData({
        roomId: 0,
        borrowerName: "",
        borrowDate: "",
        returnDate: "",
        purpose: "",
      });
      setIsEditing(null);
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      // 3. Cara melihat detail error 400 yang sebenarnya:
      const backendErrors = err.response?.data?.errors;
      console.error("Detail Validasi Backend:", backendErrors);

      if (backendErrors) {
        // Menampilkan pesan error spesifik (misal: "Field RoomId is required")
        alert("❌ Gagal simpan! Alasan: " + JSON.stringify(backendErrors));
      } else {
        alert("❌ Gagal simpan! Periksa koneksi atau format data.");
      }
    }
  };

  return (
    <div className="flex-1 p-10 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
            Manajemen Peminjaman
          </h2>
          <p className="text-slate-500">
            Pantau dan kelola reservasi ruangan PENS.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setIsEditing(null);
          }}
          className="bg-pink-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-pink-600 transition shadow-lg shadow-pink-200"
        >
          {showForm ? "✖ Tutup Form" : "➕ Tambah Peminjaman"}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Cari nama peminjam..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-pink-500 transition bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white text-slate-400 font-medium cursor-pointer"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-white mx-64 p-6 rounded-2xl shadow-sm border border-pink-100 mb-8 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold mb-4 text-slate-500">
            {isEditing ? "✏️ Edit Data Peminjaman" : "📝 Buat Peminjaman Baru"}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-400 ml-1">
                Pilih Ruangan
              </label>
              <select
                className="p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 transition"
                value={formData.roomId}
                onChange={(e) =>
                  setFormData({ ...formData, roomId: Number(e.target.value) })
                }
                required
              >
                <option value={0}>-- Pilih Ruangan --</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-400 ml-1">
                Nama Lengkap
              </label>
              <input
                className="p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.borrowerName}
                onChange={(e) =>
                  setFormData({ ...formData, borrowerName: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-400 ml-1">
                Mulai
              </label>
              <input
                type="datetime-local"
                className="p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.borrowDate}
                onChange={(e) =>
                  setFormData({ ...formData, borrowDate: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-400 ml-1">
                Selesai
              </label>
              <input
                type="datetime-local"
                className="p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500"
                value={formData.returnDate}
                onChange={(e) =>
                  setFormData({ ...formData, returnDate: e.target.value })
                }
                required
              />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-400 ml-1">
                Tujuan / Keperluan
              </label>
              <textarea
                className="p-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 min-h-[100px]"
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                required
              />
            </div>
            <button
              type="submit"
              className={`md:col-span-2 py-3.5 rounded-xl font-bold text-white transition shadow-md ${isEditing ? "bg-teal-400 hover:bg-teal-300" : "bg-pink-400 hover:bg-pink-500"}`}
            >
              {isEditing ? "Update Perubahan" : "Konfirmasi Peminjaman"}
            </button>
          </form>
        </div>
      )}

      {/* Tabel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 font-bold">Peminjam</th>
              <th className="p-4 font-bold">Ruangan</th>
              <th className="p-4 font-bold text-center">Status</th>
              <th className="p-4 font-bold text-center">Opsi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {borrowings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50 transition">
                <td className="p-4 italic">
                  <div className="font-bold text-slate-800 not-italic">
                    {b.borrowerName}
                  </div>
                  <div className="text-xs text-slate-500">{b.purpose}</div>
                </td>
                <td className="p-4 text-slate-400 font-medium">
                  {b.room?.name || "Umum"}
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${b.status === "Approved" ? "bg-green-100 text-green-500" : b.status === "Rejected" ? "bg-red-200 text-red-500" : "bg-amber-100 text-amber-500"}`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="p-4 text-center space-x-4">
                  <button
                    onClick={() => setSelectedBorrowing(b)}
                    className="text-pink-400 hover:text-pink-800 text-sm font-bold"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => handleEditClick(b)}
                    className="text-amber-400 hover:text-amber-800 text-sm font-bold"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {borrowings.length === 0 && !loading && (
          <p className="p-10 text-center text-slate-400 italic">
            Data tidak ditemukan...
          </p>
        )}
      </div>

      {/* Modal Detail */}
      {selectedBorrowing && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-pink-400 rounded-full"></span> Detail
            </h3>
            <div className="space-y-5 mb-8">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                  Peminjam
                </p>
                <p className="font-bold text-slate-800 text-lg">
                  {selectedBorrowing.borrowerName}
                </p>
                <p className="text-sm text-slate-400 mt-2 italic">
                  "{selectedBorrowing.purpose}"
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 font-semibold text-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Mulai
                  </p>
                  {new Date(selectedBorrowing.borrowDate).toLocaleString(
                    "id-ID",
                  )}
                </div>
                <div className="flex-1 font-semibold text-sm border-l pl-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Selesai
                  </p>
                  {new Date(selectedBorrowing.returnDate).toLocaleString(
                    "id-ID",
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedBorrowing.id, "Approved")
                  }
                  className="flex-1 bg-green-400 text-white py-3 rounded-xl font-bold hover:bg-green-500 transition"
                >
                  Setujui
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedBorrowing.id, "Rejected")
                  }
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition"
                >
                  Tolak
                </button>
              </div>
              <button
                onClick={() => handleDelete(selectedBorrowing.id)}
                className="w-full text-red-500 py-3 rounded-xl font-bold hover:bg-red-50 transition"
              >
                🗑️ Hapus Permanen
              </button>
              <button
                onClick={() => setSelectedBorrowing(null)}
                className="w-full bg-slate-100 text-slate-500 py-3 rounded-xl font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
