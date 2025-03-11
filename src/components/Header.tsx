import { useState } from "react";

const Header = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-lg h-16 flex items-center">
        <div className="max-w-10xl mx-auto flex items-center justify-between w-full px-4">
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="w-14 h-14 text-white"
            >
              <g transform="rotate(-10 32 32)">
                <rect
                  x="12"
                  y="10"
                  width="40"
                  height="44"
                  rx="6"
                  ry="6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </g>
              <g>
                <circle
                  cx="32"
                  cy="32"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M32 22 a10 10 0 0 1 0 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <path
                  d="M32 24 a8 8 0 0 1 0 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="3"
                  fill="currentColor"
                  stroke="none"
                />
              </g>
            </svg>
            <div>
              <h1 className="text-3xl font-bold">Discana</h1>
              <p className="text-sm italic">Personal Record Collection</p>
            </div>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="hover:text-gray-300">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/pendientes" className="hover:text-gray-300">
                  Pendientes
                </a>
              </li>
              <li>
                <a href="/explorar" className="hover:text-gray-300">
                  Explorar
                </a>
              </li>
            </ul>
          </nav>

          {/* Búsqueda e ícono de info */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center border border-gray-600 rounded px-2">
              <input
                type="text"
                placeholder="Buscar"
                className="bg-transparent outline-none text-white text-2xl placeholder-gray-400"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-1 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="8" />
            </svg>
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="focus:outline-none"
            >
              {mobileNavOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil desplegable */}
      {mobileNavOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-gray-800 shadow-lg md:hidden">
          <nav>
            <ul className="flex flex-col space-y-2 p-4">
              <li>
                <a href="/" className="hover:text-gray-300">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/todo" className="hover:text-gray-300">
                  Todo
                </a>
              </li>
              <li>
                <a href="/pendientes" className="hover:text-gray-300">
                  Pendientes
                </a>
              </li>
              <li>
                <a href="/explorar" className="hover:text-gray-300">
                  Explorar
                </a>
              </li>
            </ul>
          </nav>
          <div className="flex items-center justify-center p-4 border-t border-gray-700">
            <div className="flex items-center border border-gray-600 rounded px-2">
              <input
                type="text"
                placeholder="Buscar"
                className="bg-transparent outline-none text-white text-2xl placeholder-gray-400"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 ml-1 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 ml-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="8" />
            </svg>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
