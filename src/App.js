import React, { useState, useEffect, useRef } from 'react';

// Definiciones fuera del componente
const translations = {
  en: { /* tus traducciones en inglés */ },
  es: { /* tus traducciones en español */ }
};

const entriesPerPage = 6;
const totalEntries = Object.keys(translations.es).filter(key => key.startsWith('entry')).length / 2;
const totalPages = Math.ceil(totalEntries / entriesPerPage);

const Sidebar = ({ isOpen, setIsOpen }) => (
  <div className={`sidebar fixed top-0 left-0 h-full bg-[#6B46C1] z-50 ${isOpen ? 'open flex' : 'flex'}`}>
    <div className="h-full flex">
      <div className="flex-1 p-4">
        <div className={`sidebar-content ${!isOpen ? 'hidden' : ''}`}>
          <h2 className="text-lg font-bold mb-4 font-['Inter'] text-white">Menú</h2>
          <ul>
            <li><a href="?page=1" className="text-white hover:underline" data-translate="home">{translations[document.documentElement.lang || 'es'].home}</a></li>
            <li><a href="#portfolio" className="text-white hover:underline">Portafolio</a></li>
            <li><a href="#about" className="text-white hover:underline whitespace-nowrap">Acerca de</a></li>
            <li><a href="#contact" className="text-white hover:underline">Contacto</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const BlogEntry = ({ index, lang }) => {
  const titleKey = `entry${index}_title`;
  const descKey = `entry${index}_desc`;
  const links = { /* tus enlaces */ };
  const images = {
    1: 'environment1.webp',
    2: 'ganzos1.png',
    3: 'claire1.png',
    4: 'bot1.png',
    5: 'landscape 2.png',
    6: 'render8.png',
    7: 'github1.webp',
  };

  const link = links[index] || '#.html';
  const image = images[index] || 'render8.png';

  return (
    <a href={link} className="blog-entry flex items-center gap-6 p-3 rounded-md hover:bg-white/5 hover:-translate-y-1 transition-all">
      <img
        src={image}
        alt={`Entrada del blog ${index}`}
        className="blog-image w-[150px] h-[150px] object-cover rounded-md hover:scale-103 transition-transform"
        onError={(e) => e.target.src = `https://via.placeholder.com/150?text=Entrada+${index}`}
      />
      <div className="blog-text flex-1">
        <h2 className="text-[#5A4C70] font-['Inter'] font-light text-[0.525em] tracking-[0.375em] mb-3 hover:underline" data-translate={titleKey}>
          {translations[lang][titleKey]}
        </h2>
        <p className="text-[#A0A0A0] font-['Inter'] text-[0.75em] leading-[1.40625] font-light" data-translate={descKey}>
          {translations[lang][descKey]}
        </p>
      </div>
    </a>
  );
};

const App = () => {
  const [currentLang, setCurrentLang] = useState('es');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isParticlesEnabled, setIsParticlesEnabled] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 736);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 736);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get('page')) || 1;
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    setIsLoading(false);

    const handlePopState = (e) => {
      const page = e.state ? e.state.page : parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
      setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLang;
    const root = document.getElementById('root');
    if (isSidebarOpen) {
      setTimeout(() => {
        root.className = 'with-sidebar';
      }, 0);
    } else {
      root.className = '';
    }
  }, [currentLang, isSidebarOpen]);

  const toggleLanguage = () => {
    setCurrentLang(currentLang === 'en' ? 'es' : 'en');
  };

  const handlePageChange = (newPage) => {
    if (newPage === 0 || newPage > totalPages) return;
    setIsLoading(true);
    setCurrentPage(newPage);
    const newURL = `${window.location.pathname}?page=${newPage}`;
    window.history.pushState({ page: newPage }, '', newURL);
    setTimeout(() => setIsLoading(false), 500);
  };

  const start = (currentPage - 1) * entriesPerPage + 1;
  const end = Math.min(start + entriesPerPage - 1, totalEntries);

  useEffect(() => {
    if (!isParticlesEnabled) return;

    const handleMouseMove = (e) => {
      const types = ['x', 'triangle', 'square', 'circle'];
      const type = types[Math.floor(Math.random() * types.length)];
      const particle = document.createElement('div');
      particle.className = `particle ${type}`;
      particle.innerHTML = type === 'x' ? 'x' : type === 'triangle' ? '△' : type === 'square' ? '□' : 'o';
      const offsetX = (Math.random() - 0.5) * 30;
      const offsetY = (Math.random() - 0.5) * 30;
      particle.style.left = `${e.pageX - 20 + offsetX}px`;
      particle.style.top = `${e.pageY - 20 + offsetY}px`;
      particle.style.position = 'absolute';
      particle.style.zIndex = '10001';
      document.body.appendChild(particle);

      particle.style.animation = 'fadeIn 0.7s forwards';

      let gravity = -0.1;
      const fallSpeed = 0.01;
      const fall = () => {
        if (particle && particle.style.opacity !== '0') {
          gravity += fallSpeed;
          const currentTop = parseFloat(particle.style.top) || e.pageY;
          particle.style.top = `${currentTop + gravity}px`;
          requestAnimationFrame(fall);
        }
      };
      requestAnimationFrame(fall);

      setTimeout(() => {
        particle.style.animation = 'fadeOut 1s forwards';
        setTimeout(() => particle.remove(), 300);
      }, 700);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isParticlesEnabled]);

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div id="main" className="relative">
        <img
          src="LogoLow.png"
          alt="Logo"
          className={`logo ${isSidebarOpen ? 'with-sidebar' : ''}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <img
          src="LogoLowSimbolos.png"
          alt="Particle Control"
          className={`logo2 ${isSidebarOpen ? 'with-sidebar' : ''}`}
          onClick={() => setIsParticlesEnabled(!isParticlesEnabled)}
        />
        <div className="language-toggle fixed top-8 right-4 z-[1000]">
          <button
            className="lang-btn bg-gradient-to-br from-[#2A233A] to-[#1C1726] border border-[#5A4C70] rounded-3xl px-4 py-2 flex items-center justify-center shadow-[0_4px_8px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)] hover:bg-gradient-to-br hover:from-[#3A2F4A] hover:to-[#2A233A] hover:shadow-[0_6px_12px_rgba(0,0,0,0.4),inset_0_1px_3px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all"
            onClick={toggleLanguage}
          >
            <span className="lang-text text-[#8E8E8E] font-['Inter'] text-sm uppercase hover:text-white transition-colors">
              {currentLang.toUpperCase()}
            </span>
          </button>
        </div>

        <div className={`profile-container flex items-start gap-12 max-w-full ${isMobile ? 'mobile-center' : ''}`}>
          <img src="A4.png" alt="Perfil" className="profile-image w-[225px] h-[225px] rounded-full border border-black/10 p-5 object-cover hover:scale-105 transition-transform" />
          <div className="profile-text">
            <a href="?page=1">
              <h3 className="uppercase text-[#5E5E5E] font-['Inter'] tracking-[0.3rem] text-[0.5625em] leading-[2.25] font-light mb-5" data-translate="devlog">
                {translations[currentLang].devlog}
              </h3>
            </a>
            <h1 className="text-[#5A4C70] font-['Manrope'] tracking-[-0.01875rem] text-[1.96875em] leading-[1.5] font-normal mb-5 inline-block">
              <span data-translate="greeting">{translations[currentLang].greeting}</span>
              <span className="nickname text-[#5A4C70] font-['Manrope'] text-[0.3375em] font-normal ml-1.5 align-baseline" data-translate="nickname">
                {translations[currentLang].nickname}
              </span>
            </h1>
            <p className="text-[#A0A0A0] font-['Inter'] text-[0.75em] leading-[1.40625] font-light" data-translate="bio" dangerouslySetInnerHTML={{ __html: translations[currentLang].bio }} />
          </div>
          <div>
            {['mechito011.png', 'pollito.png', 'bcattpose.png', 'catitomodel.webp', 'razevert.png', 'render8.png'].map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Vista previa ${index + 1}`}
                className={`preview-image absolute w-[16.66%] h-[200px] object-cover hover:scale-105 transition-transform`}
                style={{
                  left: `${55 + index * 4}%`,
                  zIndex: 6 - index,
                  clipPath: 'polygon(0 0, 30% 0, 100% 100%, 70% 100%)',
                  objectPosition: index === 0 ? '75% 0%' : 'center'
                }}
              />
            ))}
          </div>
          </div>

          <a href="http://kuni3d.carrd.co" className="artstation-button flex items-center justify-center my-8 mx-auto px-7 h-[3.75rem] bg-[#262626] text-white uppercase font-['Inter'] tracking-[0.4rem] text-[0.75em] font-light rounded-[2.5rem] hover:bg-[#262626]/90 hover:-translate-y-0.5 transition-all">
            <span data-translate="portfolio">{translations[currentLang].portfolio}</span>
          </a>

          <div className={`blog-entries mt-6 border border-white/10 rounded-xl p-8 shadow-[0_4px_12px_rgba(0,0,0,0.2)] bg-[#121212] grid grid-cols-2 gap-6 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} min-h-[200px] overflow-y-auto`}>
            {isLoading ? (
              <div className="loading-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="loading-spinner w-10 h-10 border-4 border-white/20 border-t-[#5A4C70] rounded-full animate-spin"></div>
                <span className="loading-text text-[#5A4C70] font-['Inter'] text-base mt-4">Cargando...</span>
              </div>
            ) : (
              <>
                {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(index => (
                  <BlogEntry key={index} index={index} lang={currentLang} />
                ))}
              </>
            )}
          </div>

          <div className="pagination flex justify-center gap-4 mt-8">
            <a
              className={`prev-arrow flex items-center gap-2 text-[#5A4C70] font-['Inter'] font-light text-base border border-white/10 rounded px-4 py-2 hover:bg-white/5 hover:text-[#8E8E8E] hover:-translate-y-0.5 transition-all ${currentPage <= 1 ? 'hidden' : 'flex'}`}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 fill-[#5A4C70] hover:fill-[#8E8E8E] transition-colors">
                <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
              </svg>
              <span>Anterior</span>
            </a>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <a
                key={page}
                className={`text-[#5A4C70] font-['Inter'] font-light text-base border border-white/10 rounded px-4 py-2 hover:bg-white/5 hover:text-[#8E8E8E] hover:-translate-y-0.5 transition-all ${page === currentPage ? 'bg-[#5A4C70] text-white border-[#5A4C70]' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </a>
            ))}
            <a
              className={`next-arrow flex items-center gap-2 text-[#5A4C70] font-['Inter'] font-light text-base border border-white/10 rounded px-4 py-2 hover:bg-white/5 hover:text-[#8E8E8E] hover:-translate-y-0.5 transition-all ${currentPage >= totalPages ? 'hidden' : 'flex'}`}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <span>Siguiente</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3 h-3 fill-[#5A4C70] hover:fill-[#8E8E8E] transition-colors">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
};

export default App;
