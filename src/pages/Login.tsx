import { useState } from "react";
import axios from "axios";

export default function Login({
  onLoginSuccess,
  onGoToRegister,
}: {
  onLoginSuccess: (user: any) => void;
  onGoToRegister: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5276/api/auth/login", {
        username,
        password,
      });
      // Simpan ke localStorage agar tidak hilang saat refresh
      localStorage.setItem("user", JSON.stringify(res.data));
      onLoginSuccess(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login gagal, cek koneksi!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 font-sans p-4">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-pink-200 w-full max-w-md border border-pink-100 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100 rounded-full opacity-50"></div>

        <div className="relative z-10 text-center mb-10">
          <h1 className="text-4xl font-black text-pink-600 tracking-tighter mb-2">
            RUANGKITA
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Manajemen Ruangan PENS
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold mb-6 border border-red-100 animate-bounce">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Username
            </label>
            <input
              type="text"
              className="w-full p-4 mt-1 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition-all font-bold text-slate-700"
              placeholder="Masukkan username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-4 mt-1 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition-all font-bold text-slate-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-pink-200 hover:bg-pink-700 hover:-translate-y-1 transition-all active:scale-95 mt-4"
          >
            MASUK SEKARANG
          </button>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={onGoToRegister}
                className="text-pink-600 font-black hover:underline"
              >
                Daftar di sini
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
