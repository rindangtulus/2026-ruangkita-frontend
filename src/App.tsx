import { useEffect, useState } from 'react';
import axios from 'axios';
import { type Borrowing, type Room } from './types';

function App() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Form Input
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
  roomId: 0,
  borrowerName: '',
  borrowDate: '',
  returnDate: '',
  purpose: ''
});

  const API_URL = 'http://localhost:5276/api/borrowings';

  useEffect(() => {
    fetchData();
    fetchRooms();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(API_URL);
      setBorrowings(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get('http://localhost:5276/api/rooms');
      setRooms(res.data);
    } catch (err) { console.error(err); }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (formData.roomId === 0) {
    alert("Silakan pilih ruangan terlebih dahulu!");
    return;
  }

  try {
    const payload = {
      roomId: Number(formData.roomId),
      borrowerName: formData.borrowerName,
      borrowDate: new Date(formData.borrowDate).toISOString(),
      returnDate: new Date(formData.returnDate).toISOString(),
      purpose: formData.purpose,
      status: "Pending"
    };

    console.log("Mengirim data ke backend:", payload);

    const response = await axios.post(API_URL, payload);
    
    if (response.status === 200 || response.status === 201) {
      alert("Peminjaman Berhasil Dicatat!");
      setFormData({ roomId: 0, borrowerName: '', borrowDate: '', returnDate: '', purpose: '' });
      setShowForm(false);
      fetchData();
    }
  } catch (err: any) {
    console.error("Detail Error:", err.response?.data);
    
    const errorMsg = JSON.stringify(err.response?.data?.errors) || "Format data tidak sesuai";
    alert("Gagal simpan! Alasan: " + errorMsg);
  }
};

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-64 bg-slate-900 text-white p-6 shrink-0">
        <h1 className="text-2xl font-black text-blue-400">RUANGKITA</h1>
        <nav className="mt-10 space-y-2">
          <button className="w-full text-left p-3 bg-blue-600 rounded-lg">📊 Dashboard</button>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Manajemen Peminjaman</h2>
            <p className="text-slate-500">Kelola reservasi ruangan dengan mudah.</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            {showForm ? '✖ Tutup Form' : '➕ Tambah Peminjaman'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow-md border border-blue-200 mb-8 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-lg font-bold mb-4 text-slate-700">Form Peminjaman Baru</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-600">Pilih Ruangan</label>
                <select 
                className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.roomId}
                onChange={e => setFormData({...formData, roomId: Number(e.target.value)})}
                required
              >
                <option value={0}>-- Pilih Ruangan --</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-600">Nama Peminjam</label>
                <input 
                  className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Rindang"
                  value={formData.borrowerName}
                  onChange={e => setFormData({...formData, borrowerName: e.target.value})}
                  required 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-600">Waktu Mulai</label>
                <input 
                  type="datetime-local" 
                  className="p-2 border rounded-lg"
                  value={formData.borrowDate}
                  onChange={e => setFormData({...formData, borrowDate: e.target.value})}
                  required 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-600">Waktu Selesai</label>
                <input 
                  type="datetime-local" 
                  className="p-2 border rounded-lg"
                  value={formData.returnDate}
                  onChange={e => setFormData({...formData, returnDate: e.target.value})}
                  required 
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-600">Tujuan Penggunaan</label>
                <textarea
                  className="p-2 border rounded-lg"
                  placeholder="Contoh: Rapat Himpunan"
                  value={formData.purpose}
                  onChange={e => setFormData({...formData, purpose: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="md:col-span-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition">
                Konfirmasi Simpan
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold text-slate-700">Peminjam</th>
                <th className="p-4 font-bold text-slate-700">Ruangan</th>
                <th className="p-4 font-bold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map((b) => (
                <tr key={b.id} className="border-b hover:bg-slate-50 transition">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{b.borrowerName}</div>
                    <div className="text-xs text-slate-400">{b.purpose}</div>
                  </td>
                  <td className="p-4 text-slate-600">{b.room?.name || 'Umum'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      b.status === 'Approved' ? 'bg-green-100 text-green-700' :
                      b.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="p-10 text-center text-slate-400">Mensinkronkan data...</p>}
        </div>
      </main>
    </div>
  );
}

export default App;