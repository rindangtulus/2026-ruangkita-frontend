// src/components/Sidebar.tsx
export default function Sidebar({
  activePage,
  setActivePage,
}: {
  activePage: string;
  setActivePage: (p: string) => void;
}) {
  return (
    <aside
      id="default-sidebar"
      className="w-64 h-screen transition-transform shrink-0 border-e border-slate-200 bg-white"
      aria-label="Sidebar"
    >
      <div className="h-full px-4 py-6 overflow-y-auto">
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
                    : "text-slate-400 group-hover:text-slate-900"
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
                    : "text-slate-400 group-hover:text-slate-900"
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
        </ul>
      </div>
    </aside>
  );
}
