import { useState } from "react";
import axios from "axios";

export default function Register({
  onBackToLogin,
}: {
  onBackToLogin: () => void;
}) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5276/api/auth/register", formData);
      setMessage({
        type: "success",
        text: "Akun berhasil dibuat! Mengalihkan ke login...",
      });
      setTimeout(() => onBackToLogin(), 2000);
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Registrasi gagal!",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4 font-sans">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-pink-200 w-full max-w-md border border-pink-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-pink-600 tracking-tighter">
            DAFTAR AKUN
          </h1>
          <p className="text-slate-400 text-sm">
            Bergabung dengan RuangKita PENS
          </p>
        </div>

        {message.text && (
          <div
            className={`p-4 rounded-2xl text-xs font-bold mb-6 border ${message.type === "success" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"}`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold"
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 font-bold"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-pink-700 transition-all"
          >
            DAFTAR SEKARANG
          </button>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-pink-600 font-black hover:underline"
              >
                Masuk di sini
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
