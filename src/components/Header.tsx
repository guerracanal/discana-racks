import { useState } from 'react';
import { FaInfoCircle, FaRecordVinyl, FaSearch, FaSpotify, FaStarOfLife } from "react-icons/fa";
import logo from "../assets/logo.svg";
import { RxCross1, RxHamburgerMenu } from "react-icons/rx";
import { useSearchParams, useNavigate } from 'react-router-dom';
import SpotifyButton from './SpotifyButton';
import LastFMButton from './LastFMButton';
import DiscogsButton from './DiscogsButton';

const Header = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleFilterChange = (option: "all" | "disc" | "spotify") => {
    setSearchParams({ filter: option });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/ap/albums?search=${searchQuery}`);
  };

  return (
    <div className="relative z-50 mb-20">
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-lg h-16 flex items-center">
          <div className="max-w-10xl mx-auto flex items-center justify-between w-full px-4">
            {/* Logo y Titulo */}
            <a href="/">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Logo" className="logo w-14 h-14" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Discana</h1>
                  <p className="text-sm italic text-gray-400">Personal Record Collection</p>
                </div>
              </div>
            </a>

            {/* Menú de navegación - Desktop */}
            <nav className="hidden md:flex flex-grow justify-start space-x-4 mx-15">
              <ul className="flex space-x-4">
                <li>
                  <a href="/" className="hover:text-white text-gray-300">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="/types" className="hover:text-white text-gray-300">
                    Colección
                  </a>
                </li>
                <li>
                  <a href="/pendientes" className="hover:text-white text-gray-300">
                    Pendientes
                  </a>
                </li>
                <li>
                  <SpotifyButton />
                </li>
                <li>
                  <LastFMButton />
                </li>
                <li>
                  <DiscogsButton />
                </li>
              </ul>
            </nav>

            {/* Selector de Filtro y Buscador */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Botones de filtro */}
              <button
                className={`cursor-pointer filter-option ${filter === "all" ? "text-white" : "text-gray-400"}`}
                onClick={() => handleFilterChange("all")}
              >
                <FaStarOfLife />
              </button>
              <button
                className={`cursor-pointer filter-option ${filter === "disc" ? "text-white" : "text-gray-400"}`}
                onClick={() => handleFilterChange("disc")}
              >
                <FaRecordVinyl size={20} />
              </button>
              <button
                className={`cursor-pointer filter-option ${filter === "spotify" ? "text-white" : "text-gray-400"}`}
                onClick={() => handleFilterChange("spotify")}
              >
                <FaSpotify size={20} />
              </button>

              {/* Búsqueda */}
              <form onSubmit={handleSearchSubmit} className="flex items-center border border-gray-600 rounded px-2">
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-transparent outline-none text-white text-2xl placeholder-gray-400"
                />
                <button type="submit">
                  <FaSearch size={15} />
                </button>
              </form>

              {/* Ícono de información */}
              <a className="cursor-not-allowed" href=""><FaInfoCircle className="text-white" /></a>
            </div>

            {/* Menú hamburguesa en móvil */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
                className="focus:outline-none"
              >
                {mobileNavOpen ? <RxCross1 /> : <RxHamburgerMenu />}
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
                  <a href="/" className="hover:text-white text-gray-300">
                    Inicio
                  </a>
                </li>
                <li>
                  <a href="/types" className="hover:text-white text-gray-300">
                    Colección
                  </a>
                </li>
                <li>
                  <a href="/pendientes" className="hover:text-white text-gray-300">
                    Pendientes
                  </a>
                </li>
                <li>
                  <SpotifyButton />
                </li>
                <li>
                  <LastFMButton />
                </li>
                <li>
                  <DiscogsButton />
                </li>
              </ul>
            </nav>
            <div className="flex items-center space-x-4 justify-center p-4 border-t border-gray-700">
              {/* Botones de filtro */}
              <button
                className={`filter-option ${filter === "all" ? "text-white" : "text-gray-400"}`}
                onClick={() => handleFilterChange("all")}
              >
                <FaStarOfLife />
              </button>
              <button
                className={`filter-option ${filter === "disc" ? "text-white" : "text-gray-400"}`}
                onClick={() => handleFilterChange("disc")}
              >
                <FaRecordVinyl size={20} />
              </button>
              <button
                className={`filter-option ${filter === "spotify" ? "text-white" : "text-gray-400"}`}
                onClick={() => handleFilterChange("spotify")}
              >
                <FaSpotify size={20} />
              </button>
            </div>
            <div className="flex items-center justify-center p-4 border-t border-gray-700">
              <div className="flex items-center border border-gray-600 rounded px-2">
                <input
                  type="text"
                  placeholder="Buscar"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-transparent outline-none text-white text-2xl placeholder-gray-400"
                />
                <button type="submit">
                  <FaSearch size={15} />
                </button>
              </div>
              <FaInfoCircle className="text-white ml-4" />
            </div>
          </div>
        )}
      </>
    </div>
  );
};

export default Header;
