import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ship, Globe, Gauge, Clock, Package, LogIn, LogOut, Navigation, AlertTriangle, UserCheck } from 'lucide-react';
import { useShipSimulation, PORTS } from './hooks/useShipSimulation';
import './styles/App.css';
import './i18n';

interface TrackedVessel {
  vesselName: string;
  voyageRef: string;
  origin: string;
  destination: string;
  lastPort: string;
  nextPort: string;
  notes: string;
}

function App() {
  const { t, i18n } = useTranslation();
  const { position, progress, status, currentPortIndex } = useShipSimulation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [vesselId, setVesselId] = useState('');
  const [trackingRef, setTrackingRef] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [trackedVessel, setTrackedVessel] = useState<TrackedVessel | null>(null);

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const getVesselDetails = (id: string): TrackedVessel => {
    const key = id.trim().toUpperCase();

    const catalog: Record<string, TrackedVessel> = {
      'OM-158': {
        vesselName: t('vessel_name'),
        voyageRef: 'OM-158',
        origin: t('port_a'),
        destination: t('port_c'),
        lastPort: t('port_a'),
        nextPort: t('port_b'),
        notes: t('notes_domestic'),
      },
      'RT-221': {
        vesselName: t('vessel_rt'),
        voyageRef: 'RT-221',
        origin: t('port_b'),
        destination: t('port_c'),
        lastPort: t('port_b'),
        nextPort: t('port_c'),
        notes: t('notes_rapid'),
      },
      'GL-44': {
        vesselName: t('vessel_gl'),
        voyageRef: 'GL-44',
        origin: t('port_a'),
        destination: t('port_b'),
        lastPort: t('port_a'),
        nextPort: t('port_b'),
        notes: t('notes_global'),
      },
    };

    return catalog[key] || {
      vesselName: t('vessel_custom'),
      voyageRef: key || 'UNKNOWN',
      origin: t('port_a'),
      destination: t('port_c'),
      lastPort: t('port_a'),
      nextPort: t('port_b'),
      notes: t('vessel_not_found'),
    };
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !password.trim() || !vesselId.trim()) {
      return;
    }

    setTrackedVessel(getVesselDetails(vesselId));
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setTrackedVessel(null);
    setUsername('');
    setPassword('');
    setVesselId('');
    setTrackingRef('');
  };

  const routeLabel = `${t('port_a')} → ${t('port_c')}`;
  const nextPortLabel = currentPortIndex === 0 ? t('port_b') : t('port_c');

  if (!loggedIn) {
    return (
      <div className="app-container landing-page">
        <header>
          <div className="logo-section">
            <Globe size={28} />
            <span>{t('title')}</span>
          </div>
          <button className="lang-toggle" onClick={toggleLanguage}>
            {t('switch_lang')}
          </button>
        </header>

        <main className="landing-main">
          <section className="landing-panel">
            <span className="landing-tag">{t('launch_tag')}</span>
            <h1>{t('landing_title')}</h1>
            <p>{t('landing_subtitle')}</p>

            <form className="login-form" onSubmit={handleLogin}>
              <label className="field-group">
                <span>{t('username')}</span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder={t('username')}
                />
              </label>
              <label className="field-group">
                <span>{t('password')}</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={t('password')}
                />
              </label>
              <label className="field-group">
                <span>{t('vessel_id')}</span>
                <input
                  value={vesselId}
                  onChange={(event) => setVesselId(event.target.value)}
                  placeholder={t('vessel_id_placeholder')}
                />
              </label>
              <label className="field-group">
                <span>{t('tracking_ref')}</span>
                <input
                  value={trackingRef}
                  onChange={(event) => setTrackingRef(event.target.value)}
                  placeholder={t('tracking_ref_placeholder')}
                />
              </label>
              <button type="submit" className="submit-button">
                {t('start_tracking')}
              </button>
            </form>
          </section>

          <aside className="landing-support">
            <div className="support-card">
              <div className="card-title">
                <Ship size={18} />
                {t('fast_tracking')}
              </div>
              <p>{t('landing_feature_1')}</p>
            </div>
            <div className="support-card">
              <div className="card-title">
                <Navigation size={18} />
                {t('live_updates')}</div>
              <p>{t('landing_feature_2')}</p>
            </div>
            <div className="support-card">
              <div className="card-title">
                <Clock size={18} />
                {t('secure_access')}</div>
              <p>{t('landing_feature_3')}</p>
            </div>
          </aside>
        </main>

        <footer className="footer landing-footer">
          <div>
            <strong>{t('footer_summary')}</strong>
            <p>{t('footer_description')}</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <div className="logo-section">
          <Globe size={28} />
          <span>{t('title')}</span>
        </div>
        <div className="header-actions">
          {loggedIn && <span className="user-chip"><UserCheck size={16} /> {t('welcome_user', { name: username })}</span>}
          <button className="lang-toggle" onClick={toggleLanguage}>
            {t('switch_lang')}
          </button>
        </div>
      </header>

      <main>
        <aside className="sidebar">
          <div className="card account-card">
            <div className="card-title">
              <LogIn size={18} />
              {t('user_login')}
            </div>
            <div className="account-panel">
              <div className="account-row">
                <strong>{t('track_vessel')}</strong>
                <button type="button" className="secondary-button" onClick={handleLogout}>
                  <LogOut size={14} /> {t('logout')}
                </button>
              </div>
              <div className="stat-group">
                <div className="stat-item">
                  <span className="stat-label">{t('vessel_name')}</span>
                  <span className="stat-value">{trackedVessel?.vesselName}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t('tracking_ref')}</span>
                  <span className="stat-value">{trackedVessel?.voyageRef}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">{t('route_details')}</span>
                  <span className="stat-value">{`${trackedVessel?.origin} → ${trackedVessel?.destination}`}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title">
              <Ship size={18} />
              {t('vessel_info')}
            </div>
            <div className="stat-group">
              <div className="stat-item">
                <span className="stat-label">{t('status')}</span>
                <span className="status-badge">{t(status)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('location')}</span>
                <span className="stat-value">{nextPortLabel}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label"><Gauge size={14} style={{ marginRight: 4 }} /> {t('speed')}</span>
                <span className="stat-value">14.2 kn</span>
              </div>
              <div className="stat-item">
                <span className="stat-label"><Clock size={14} style={{ marginRight: 4 }} /> {t('eta')}</span>
                <span className="stat-value">May 12, 14:00</span>
              </div>
              <div className="stat-item">
                <span className="stat-label"><Package size={14} style={{ marginRight: 4 }} /> {t('cargo')}</span>
                <span className="stat-value">2.1M bbls</span>
              </div>
            </div>
          </div>

          <div className="card tracking-card">
            <div className="card-title">
              <Navigation size={18} />
              {t('live_updates')}
            </div>
            <div className="stat-group">
              <div className="stat-item">
                <span className="stat-label">{t('current_location')}</span>
                <span className="stat-value">{routeLabel}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('last_port')}</span>
                <span className="stat-value">{currentPortIndex === 0 ? t('port_a') : t('port_b')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">{t('next_stop')}</span>
                <span className="stat-value">{nextPortLabel}</span>
              </div>
              <div className="stat-item status-row">
                <AlertTriangle size={14} />
                <span>{t('data_refresh')}</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="map-container">
          <svg className="map-svg" viewBox="0 0 1000 500">
            <rect width="1000" height="500" fill="#f8fafc" />
            <path
              d={`M ${PORTS[0].x} ${PORTS[0].y} L ${PORTS[1].x} ${PORTS[1].y} L ${PORTS[2].x} ${PORTS[2].y}`}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            {PORTS.map((port, idx) => (
              <g key={idx}>
                <circle cx={port.x} cy={port.y} r="6" fill={idx <= currentPortIndex ? '#0055A4' : '#94a3b8'} />
                <text x={port.x} y={port.y + 25} textAnchor="middle" fontSize="12" fontWeight="600" fill="#475569">
                  {t(port.name)}
                </text>
              </g>
            ))}
            <g transform={`translate(${position.x - 15}, ${position.y - 15})`} className="ship-icon">
              <circle cx="15" cy="15" r="15" fill="#0055A4" opacity="0.2" />
              <Ship color="#0055A4" size={30} />
            </g>
          </svg>
          <div className="map-overlay">
            <div>
              <strong>{t('route_status')}</strong>
              <div>{t('current_location')}: {nextPortLabel}</div>
              <div>{t('eta')}: May 12, 14:00</div>
              <div>{t('progress')}: {Math.round(progress)}%</div>
            </div>
            {trackedVessel && (
              <div className="overlay-vessel">
                <strong>{trackedVessel.vesselName}</strong>
                <span>{trackedVessel.notes}</span>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <strong>{t('powered_by')}</strong>
            <p>{t('footer_description')}</p>
          </div>
          <div className="footer-links">
            <span>{t('contact_support')}</span>
            <span>{t('footer_disclaimer')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
