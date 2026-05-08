import React from 'react';
import { useTranslation } from 'react-i18next';
import { Ship, Globe, Anchor, MapPin, Gauge, Clock, Package, Info } from 'lucide-react';
import { useShipSimulation, PORTS } from './hooks/useShipSimulation';
import './styles/App.css';
import './i18n';

function App() {
  const { t, i18n } = useTranslation();
  const { position, progress, status, currentPortIndex } = useShipSimulation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo-section">
          <Globe size={28} />
          <span>{t('title')}</span>
        </div>
        <button className="lang-toggle" onClick={toggleLanguage}>
          {t('switch_lang')}
        </button>
      </header>

      <main>
        <aside className="sidebar">
          <div className="card">
            <div className="card-title">
              <Ship size={18} />
              {t('vessel_info')}
            </div>
            <div className="stat-group">
              <div className="stat-item">
                <span className="stat-label">{t('vessel_name')}</span>
                <span className="stat-value">Ocean Monarch</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('status')}</span>
                <span className="status-badge">{t(status)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <Info size={18} />
              {t('on_schedule')}
            </div>
            <div className="stat-group">
              <div className="stat-item">
                <span className="stat-label"><Gauge size={14} style={{marginRight: 4}} /> {t('speed')}</span>
                <span className="stat-value">14.2 kn</span>
              </div>
              <div className="stat-item">
                <span className="stat-label"><Clock size={14} style={{marginRight: 4}} /> {t('eta')}</span>
                <span className="stat-value">May 12, 14:00</span>
              </div>
              <div className="stat-item">
                <span className="stat-label"><Package size={14} style={{marginRight: 4}} /> {t('cargo')}</span>
                <span className="stat-value">2.1M bbls</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="map-container">
          <svg className="map-svg" viewBox="0 0 1000 500">
            {/* Mock Map Background Elements */}
            <rect width="1000" height="500" fill="#f8fafc" />
            
            {/* Route Line */}
            <path
              d={`M ${PORTS[0].x} ${PORTS[0].y} L ${PORTS[1].x} ${PORTS[1].y} L ${PORTS[2].x} ${PORTS[2].y}`}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="5,5"
            />

            {/* Ports */}
            {PORTS.map((port, idx) => (
              <g key={idx}>
                <circle cx={port.x} cy={port.y} r="6" fill={idx <= currentPortIndex ? '#0055A4' : '#94a3b8'} />
                <text x={port.x} y={port.y + 25} textAnchor="middle" fontSize="12" fontWeight="600" fill="#475569">
                  {t(port.name)}
                </text>
              </g>
            ))}

            {/* Ship Icon */}
            <g transform={`translate(${position.x - 15}, ${position.y - 15})`} className="ship-icon">
              <circle cx="15" cy="15" r="15" fill="#0055A4" opacity="0.2" />
              <Ship color="#0055A4" size={30} />
            </g>
          </svg>
        </section>
      </main>

      <footer className="footer">
        <div className="timeline">
          <div className="timeline-progress" style={{ width: `${progress}%` }}></div>
          {PORTS.map((port, idx) => (
            <div key={idx} className={`timeline-step ${progress >= (idx * 50) ? 'active' : ''}`}>
              <div className="step-dot">
                {idx === 0 ? <Anchor size={16} /> : <MapPin size={16} />}
              </div>
              <span className="step-name">{t(port.name)}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;
