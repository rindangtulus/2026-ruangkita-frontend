import { useState } from "react";
import axios from "axios";

export default function Profile({
  user,
  onUpdateUser,
}: {
  user: any;
  onUpdateUser: (data: any) => void;
}) {
  const [fullName, setFullName] = useState(user.fullName);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5276/api/auth/update-profile/${user.id}`,
        {
          FullName: fullName,
          Password: password,
        },
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      onUpdateUser(res.data);

      alert("✅ Profil berhasil diperbarui!");
      setPassword("");
    } catch (err) {
      alert("❌ Gagal memperbarui profil. Cek koneksi atau format data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 p-10 bg-slate-50 min-h-screen font-sans">
      <h2 className="text-3xl font-black text-slate-800 mb-8 flex items-center gap-3">
        <span className="w-2 h-10 bg-pink-400 rounded-full"></span> 👤
        Pengaturan Profil
      </h2>

      <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 max-w-lg">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Username (Tidak bisa diubah)
            </label>
            <input
              type="text"
              className="w-full p-4 mt-1 bg-slate-100 border border-slate-200 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed"
              value={user.username}
              disabled
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              className="w-full p-4 mt-1 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-slate-700"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Password Baru (Kosongkan jika tidak diganti)
            </label>
            <input
              type="password"
              className="w-full p-4 mt-1 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold text-slate-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-pink-200 hover:bg-pink-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "SIMPAN PERUBAHAN"}
          </button>
        </form>
      </div>
    </div>
  );
}
