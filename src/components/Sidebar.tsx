export default function Sidebar({
  activePage,
  setActivePage,
  user,
  onLogout,
}: {
  activePage: string;
  setActivePage: (p: string) => void;
  user: any;
  onLogout: () => void;
}) {
  return (
    <aside
      id="default-sidebar"
      className="w-64 h-screen transition-transform shrink-0 border-e border-slate-200 bg-white flex felx-colw-64 h-screen transition-transform shrink-0 border-e border-slate-200 bg-white flex flex-col"
      aria-label="Sidebar"
    >
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="flex items-center ps-2.5 mb-10">
          <span className="self-center text-2xl font-black whitespace-nowrap text-pink-600 tracking-tighter">
            RUANGKITA
          </span>
        </div>
        <ul className="space-y-2 font-medium">
          <li>
            <button
              onClick={() => setActivePage("dashboard")}
              className={`flex items-center w-full p-3 rounded-xl transition-all group ${
                activePage === "dashboard"
                  ? "bg-pink-50 text-pink-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <svg
                className={`w-5 h-5 transition duration-75 ${
                  activePage === "dashboard"
                    ? "text-pink-600"
                    : "text-slate-400 group-hover:text-pink-500"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 21"
              >
                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-.106Z" />
                <path d="M12.5 9h9a1 1 0 0 0 1-1a9 9 0 0 0-9-9a1 1 0 0 0-1 1v9Z" />
              </svg>
              <span className="ms-3 font-bold">Dashboard</span>
            </button>
          </li>

          <li>
            <button
              onClick={() => setActivePage("borrowing-list")}
              className={`flex items-center w-full p-3 rounded-xl transition-all group ${
                activePage === "borrowing-list"
                  ? "bg-pink-50 text-pink-600 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <svg
                className={`w-5 h-5 transition duration-75 ${
                  activePage === "borrowing-list"
                    ? "text-pink-600"
                    : "text-slate-400 group-hover:text-pink-500"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7 3a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H7Z" />
                <path d="M4 17a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1.172a2 2 0 0 0-1.414-.586H8.586A2 2 0 0 0 7.172 3H6a2 2 0 0 0-2 2v12Zm2-2h8v2H6v-2Zm0-4h8v2H6v-2Zm0-4h8v2H6V7Z" />
              </svg>
              <span className="ms-3 font-bold">
                {user.role === "Admin" ? "Daftar Peminjaman" : "Peminjamanku"}
              </span>
            </button>
          </li>

          {user.role === "Admin" && (
            <li>
              <button
                onClick={() => setActivePage("rooms")}
                className={`flex items-center w-full p-3 rounded-xl transition-all group ${
                  activePage === "rooms"
                    ? "bg-pink-50 text-pink-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition duration-75 ${
                    activePage === "rooms"
                      ? "text-pink-600"
                      : "text-slate-400 group-hover:text-pink-500"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Z" />
                </svg>
                <span className="ms-3 font-bold">Tambah Ruangan</span>
              </button>
            </li>
          )}
        </ul>
      </div>
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <button
            onClick={() => setActivePage("profile")}
            className={`flex w-full p-3 rounded-xl transition-all ${activePage === "profile" ? "bg-pink-50 text-pink-600" : "text-slate-600 hover:bg-slate-100"}`}
          >
            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-black shrink-0">
              {user.username ? user.username[0].toUpperCase() : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm px-4 font-bold text-slate-800 truncate">
                {user.fullName}
              </p>
              <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">
                {user.role}
              </p>
            </div>
          </button>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all border border-red-100"
        >
          🚪 Keluar
        </button>
      </div>
    </aside>
  );
}
