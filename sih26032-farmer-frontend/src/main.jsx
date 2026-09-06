
import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell, CalendarDays, CheckCircle2, Clock3, CreditCard,
  Home, LogOut, Menu, PackageCheck, Phone, User, X, MapPin,
  ChevronRight, ShieldCheck, Sprout
} from 'lucide-react';
import ProcurementDashboard from "./pages/procurement/ProcurementDashboard";
import './styles.css';

const initialBooking = {
  crop: 'Rice',
  quantity: 500,
  center: 'Mandal Procurement Centre',
  slot: '10:30 AM – 11:00 AM',
  date: '12 Sep 2026',
  token: 27,
  currentToken: 19,
  status: 'In Queue',
  procurement: 'Not Started',
  payment: 'Pending'
};

const initialNotifications = [
  { id: 1, title: 'Slot confirmed', text: 'Your procurement slot is confirmed for 12 Sep at 10:30 AM.', time: '10 min ago', read: false },
  { id: 2, title: 'Queue updated', text: '8 farmers are ahead of you at Mandal Procurement Centre.', time: '18 min ago', read: false },
  { id: 3, title: 'Documents ready', text: 'Keep your farmer ID and bank details available at the centre.', time: '1 hr ago', read: true }
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mode, setMode] = useState('login');
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [booking, setBooking] = useState(initialBooking);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [bookingOpen, setBookingOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const peopleAhead = Math.max(0, booking.token - booking.currentToken);
  const progress = Math.min(100, Math.round((booking.currentToken / booking.token) * 100));

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const login = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    setPage('dashboard');
  };

  if (!isLoggedIn) {
    return <AuthScreen mode={mode} setMode={setMode} onLogin={login} />;
  }

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="overlay" onClick={() => setSidebarOpen(false)} aria-label="Close menu" />}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-row">
          <div className="brand-icon"><Sprout size={22} /></div>
          <div><div className="brand-name">FarmSlot</div><div className="brand-sub">Farmer Portal</div></div>
          <button className="icon-btn mobile-close" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>
        <nav className="nav-list">
          <NavItem icon={<Home size={19} />} label="Dashboard" active={page === 'dashboard'} onClick={() => {setPage('dashboard');setSidebarOpen(false)}} />
          <NavItem icon={<CalendarDays size={19} />} label="Book Slot" active={page === 'booking'} onClick={() => {setPage('booking');setSidebarOpen(false)}} />
          <NavItem icon={<Clock3 size={19} />} label="Queue Status" active={page === 'queue'} onClick={() => {setPage('queue');setSidebarOpen(false)}} />
          <NavItem icon={<PackageCheck size={19} />} label="Procurement" active={page === 'procurement'} onClick={() => {setPage('procurement');setSidebarOpen(false)}} />
          <NavItem icon={<CreditCard size={19} />} label="Payment" active={page === 'payment'} onClick={() => {setPage('payment');setSidebarOpen(false)}} />
          <NavItem icon={<Bell size={19} />} label="Notifications" badge={unreadCount} active={page === 'notifications'} onClick={() => {markNotificationsRead();setPage('notifications');setSidebarOpen(false)}} />
          <NavItem icon={<PackageCheck size={19} />} label="Procurement Centre"
    active={page === 'procurement-dashboard'}onClick={() => {setPage('procurement-dashboard');setSidebarOpen(false);}}
  />
        </nav>
        <div className="sidebar-bottom">
          <div className="profile-mini"><div className="avatar">CS</div><div><strong>Chandini Siri</strong><span>Farmer ID: FM-20481</span></div></div>
          <button className="logout-btn" onClick={() => setIsLoggedIn(false)}><LogOut size={17}/> Logout</button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
          <div><p className="eyebrow">Farmer Portal</p><h1>{pageTitle(page)}</h1></div>
          <button className="notification-btn" onClick={() => {markNotificationsRead(); setPage('notifications')}} aria-label="Notifications">
            <Bell size={21}/>{unreadCount > 0 && <span>{unreadCount}</span>}
          </button>
        </header>

        <section className="content">
          {page === 'dashboard' && <Dashboard booking={booking} peopleAhead={peopleAhead} progress={progress} go={setPage} openBooking={() => setBookingOpen(true)} />}
          {page === 'booking' && <BookingPage booking={booking} setBooking={setBooking} onSaved={() => setPage('dashboard')} />}
          {page === 'queue' && <QueuePage booking={booking} peopleAhead={peopleAhead} progress={progress} />}
          {page === 'procurement' && <ProcurementPage booking={booking} />}
          {page === 'payment' && <PaymentPage booking={booking} />}
          {page === 'notifications' && <NotificationsPage notifications={notifications} />}
          {page === 'procurement-dashboard' && <ProcurementDashboard />}
        </section>
      </main>

      {bookingOpen && <BookingQuickModal onClose={() => setBookingOpen(false)} onBook={() => {setBookingOpen(false);setPage('booking')}} />}
    </div>
  );
}

function AuthScreen({ mode, setMode, onLogin }) {
  return <div className="auth-shell">
    <div className="auth-art">
      <div className="auth-brand"><div className="brand-icon"><Sprout size={23}/></div><span>FarmSlot</span></div>
      <div className="auth-copy">
        <div className="pill">SMART PROCUREMENT ACCESS</div>
        <h1>Less waiting.<br/><span>More certainty.</span></h1>
        <p>Book a procurement slot, track your live queue, and follow procurement and payment updates from one place.</p>
        <div className="feature-row"><CheckCircle2 size={18}/> Real-time queue visibility</div>
        <div className="feature-row"><CheckCircle2 size={18}/> Slot and status notifications</div>
      </div>
    </div>
    <div className="auth-card-wrap">
      <form className="auth-card" onSubmit={onLogin}>
        <div className="mobile-auth-logo"><div className="brand-icon"><Sprout size={21}/></div> FarmSlot</div>
        <p className="eyebrow">Welcome back</p>
        <h2>{mode === 'login' ? 'Farmer Login' : 'Create Farmer Account'}</h2>
        <p className="muted">{mode === 'login' ? 'Enter your mobile number and PIN to continue.' : 'Register once to book and track procurement slots.'}</p>
        {mode === 'register' && <label>Full name<input required placeholder="e.g. Ravi Kumar" /></label>}
        <label>Mobile number<div className="phone-input"><span>+91</span><input required inputMode="numeric" placeholder="10-digit mobile number" /></div></label>
        <label>{mode === 'login' ? '4-digit PIN' : 'Create 4-digit PIN'}<input required inputMode="numeric" maxLength="4" placeholder="••••" /></label>
        <button className="primary-btn" type="submit">{mode === 'login' ? 'Login to portal' : 'Create account'} <ChevronRight size={18}/></button>
        <div className="auth-switch">{mode === 'login' ? "Don't have an account?" : 'Already registered?'} <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Register' : 'Login'}</button></div>
        <div className="security-note"><ShieldCheck size={17}/> Your account uses secure mobile-based access.</div>
      </form>
    </div>
  </div>;
}

function Dashboard({ booking, peopleAhead, progress, go, openBooking }) {
  return <>
    <div className="welcome-banner">
      <div><div className="pill light">TODAY'S OVERVIEW</div><h2>Hello, Chandini 👋</h2><p>Your next procurement visit is <strong>{booking.date}</strong> at <strong>{booking.slot}</strong>.</p></div>
      <button className="secondary-btn light-btn" onClick={() => go('queue')}>View live queue <ChevronRight size={17}/></button>
    </div>

    <div className="stat-grid">
      <StatCard icon={<CalendarDays/>} label="Booked slot" value={booking.date} sub={booking.slot}/>
      <StatCard icon={<Clock3/>} label="Queue position" value={`#${booking.currentToken}`} sub={`${peopleAhead} people ahead`}/>
      <StatCard icon={<PackageCheck/>} label="Procurement" value={booking.procurement} sub="Rice • 500 kg"/>
      <StatCard icon={<CreditCard/>} label="Payment" value={booking.payment} sub="Will update here"/>
    </div>

    <div className="section-head"><div><h3>Your active procurement</h3><p className="muted">Track the complete journey in one view.</p></div><button className="text-btn" onClick={() => go('procurement')}>View details <ChevronRight size={16}/></button></div>
    <div className="journey-card">
      <JourneyStep label="Slot booked" meta={`${booking.date} • ${booking.slot}`} active done />
      <JourneyLine active />
      <JourneyStep label="In queue" meta={`Current token ${booking.currentToken} • Your token ${booking.token}`} active />
      <JourneyLine />
      <JourneyStep label="Procurement" meta="Pending at centre" />
      <JourneyLine />
      <JourneyStep label="Payment" meta="Pending" />
      <div className="queue-strip"><div><span>LIVE QUEUE</span><strong>{peopleAhead} farmers ahead of you</strong></div><div className="mini-progress"><div style={{width:`${progress}%`}}/></div><button className="primary-btn compact" onClick={() => go('queue')}>Open queue</button></div>
    </div>

    <div className="section-head"><div><h3>Need a slot?</h3><p className="muted">Choose a centre and available time before visiting.</p></div><button className="primary-btn" onClick={openBooking}><CalendarDays size={17}/> Book a new slot</button></div>
  </>;
}

function BookingPage({ booking, setBooking, onSaved }) {
  const [form, setForm] = useState({
    crop: booking.crop,
    quantity: booking.quantity,
    center: booking.center,
    date: "2026-09-12",
    slot: "10:30 AM – 11:00 AM",
  });

  const [saved, setSaved] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const submit = (e) => {
    e.preventDefault();

    // Temporary demo token.
    // Later, the backend will generate this.
    const newToken = Math.floor(Math.random() * 50) + 1;

    const formattedDate = new Date(form.date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newBooking = {
      ...booking,
      ...form,
      date: formattedDate,
      token: newToken,
      currentToken: 22,
      status: "Confirmed",
      procurement: "Not Started",
      payment: "Pending",
    };

    setBooking(newBooking);
    setConfirmedBooking(newBooking);
    setSaved(true);
  };

  return (
    <div className="page-card">
      <div className="page-intro">
        <div>
          <h2>Book a procurement slot</h2>
          <p className="muted">
            Select your centre, date and available time. Your virtual queue
            token will be generated after confirmation.
          </p>
        </div>

        <div className="process-badge">
          <CheckCircle2 size={17} />
          No physical queue required to book
        </div>
      </div>

      {!saved ? (
        <form className="form-grid" onSubmit={submit}>

          <label>
            Crop type
            <select
              value={form.crop}
              onChange={(e) =>
                setForm({ ...form, crop: e.target.value })
              }
            >
              <option>Rice</option>
              <option>Wheat</option>
              <option>Maize</option>
              <option>Groundnut</option>
              <option>Cotton</option>
            </select>
          </label>

          <label>
            Quantity (kg)
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) =>
                setForm({
                  ...form,
                  quantity: Number(e.target.value),
                })
              }
              required
            />
          </label>

          <label>
            Procurement centre
            <select
              value={form.center}
              onChange={(e) =>
                setForm({ ...form, center: e.target.value })
              }
            >
              <option>Mandal Procurement Centre</option>
              <option>Village Collection Centre</option>
              <option>District Procurement Centre</option>
            </select>
          </label>

          <label>
            Preferred date
            <input
              type="date"
              value={form.date}
              min="2026-09-05"
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              required
            />
          </label>

          <label className="span-2">
            Available slot
            <select
              value={form.slot}
              onChange={(e) =>
                setForm({ ...form, slot: e.target.value })
              }
            >
              <option>10:30 AM – 11:00 AM</option>
              <option>11:00 AM – 11:30 AM</option>
              <option>2:00 PM – 2:30 PM</option>
              <option>2:30 PM – 3:00 PM</option>
            </select>
          </label>

          <div className="span-2 form-actions">
            <button className="primary-btn" type="submit">
              Confirm slot
              <ChevronRight size={17} />
            </button>
          </div>
        </form>
      ) : (
        <div className="success-box">
          <CheckCircle2 size={22} />

          <div>
            <strong>Slot confirmed successfully.</strong>

            <span>
              Token: #{confirmedBooking.token}
            </span>

            <span>
              Date: {confirmedBooking.date}
            </span>

            <span>
              Time: {confirmedBooking.slot}
            </span>

            <span>
              Centre: {confirmedBooking.center}
            </span>

            <span>
              You can track the live queue from Queue Status.
            </span>
          </div>

          <button className="text-btn" onClick={onSaved}>
            Go to dashboard
          </button>
        </div>
      )}
    </div>
  );
}

function QueuePage({ booking, peopleAhead, progress }) {
  const currentToken = Number(booking.currentToken) || 0;
  const yourToken = Number(booking.token) || 0;

  const calculatedPeopleAhead = Math.max(yourToken - currentToken - 1, 0);

  const waitMinutes = calculatedPeopleAhead * 5;

  return (
    <>
      <div className="queue-hero">
        <div>
          <div className="pill light">LIVE QUEUE</div>

          <h2>
            {calculatedPeopleAhead === 0
              ? "Your turn is now"
              : "Your turn is getting closer"}
          </h2>

          <p>
            Keep notifications enabled. The centre can update the queue in
            real time.
          </p>
        </div>

        <div className="queue-number">
          <span>Your token</span>
          <strong>#{yourToken}</strong>
          <small>Current: #{currentToken}</small>
        </div>
      </div>

      <div className="queue-grid">

        {/* Queue Progress */}
        <div className="page-card">
          <h3>Queue progress</h3>

          <div className="big-progress">
            <div className="progress-track">
              <div style={{ width: `${progress}%` }} />
            </div>

            <div className="progress-labels">
              <span>Token #{currentToken}</span>

              <strong>
                {calculatedPeopleAhead}{" "}
                {calculatedPeopleAhead === 1 ? "ahead" : "ahead"}
              </strong>

              <span>Your token #{yourToken}</span>
            </div>
          </div>

          <div className="queue-estimate">
            <Clock3 size={22} />

            <div>
              <span>Estimated wait</span>
              <strong>
                {waitMinutes === 0 ? "You're next" : `${waitMinutes} minutes`}
              </strong>
            </div>

            <small>
              Estimate changes with centre processing speed.
            </small>
          </div>
        </div>

        {/* Today's Slot */}
        <div className="page-card">
          <h3>Today's slot</h3>

          <InfoRow
            label="Date"
            value={booking.date}
            icon={<CalendarDays size={17} />}
          />

          <InfoRow
            label="Time"
            value={booking.slot}
            icon={<Clock3 size={17} />}
          />

          <InfoRow
            label="Centre"
            value={booking.center}
            icon={<MapPin size={17} />}
          />

          <div className="status-pill">
            <span className="dot" />
            {booking.status}
          </div>
        </div>
      </div>

      {/* Live Queue Activity */}
      <div className="page-card timeline-card">
        <h3>Live queue activity</h3>

        {currentToken > 1 && (
          <QueueActivity
            token={`#${currentToken - 1}`}
            text="Procurement completed"
            time="Recently"
            done
          />
        )}

        <QueueActivity
          token={`#${currentToken}`}
          text="Now serving"
          time="Currently"
          current
        />

        {calculatedPeopleAhead > 0 && (
          <QueueActivity
            token={
              calculatedPeopleAhead === 1
                ? `#${currentToken + 1}`
                : `#${currentToken + 1}–#${yourToken - 1}`
            }
            text="Upcoming farmers"
            time="Next"
          />
        )}

        <QueueActivity
          token={`#${yourToken}`}
          text={calculatedPeopleAhead === 0 ? "Your turn" : "Your turn"}
          time={
            calculatedPeopleAhead === 0
              ? "Now"
              : "Estimated soon"
          }
          current={false}
        />
      </div>
    </>
  );
}

function ProcurementPage({ booking }) {
  return <div className="page-card"><div className="page-intro"><div><h2>Procurement tracking</h2><p className="muted">Follow what happens after you reach the centre.</p></div><span className="status-chip neutral">{booking.procurement}</span></div><div className="procurement-grid"><InfoRow label="Crop" value={`${booking.crop} • ${booking.quantity} kg`} icon={<Sprout size={17}/>} /><InfoRow label="Centre" value={booking.center} icon={<MapPin size={17}/>} /><InfoRow label="Slot" value={`${booking.date} • ${booking.slot}`} icon={<CalendarDays size={17}/>} /></div><div className="status-timeline"><ProcStep title="Slot confirmed" text="Your appointment is confirmed." done/><ProcStep title="Queue" text={`Token #${booking.token} • Current #${booking.currentToken}`} done/><ProcStep title="Procurement at centre" text="Awaiting your turn at the centre."/><ProcStep title="Payment" text="Will be updated after procurement."/></div></div>;
}

function PaymentPage({ booking }) {
  return <div className="page-card"><div className="page-intro"><div><h2>Payment status</h2><p className="muted">Track payment after your produce is accepted and weighed.</p></div><span className="status-chip warning">{booking.payment}</span></div><div className="payment-empty"><div className="payment-icon"><CreditCard size={30}/></div><h3>Payment is not generated yet</h3><p>The payment section will be updated by the procurement centre once your procurement is completed.</p><div className="payment-steps"><div><strong>01</strong><span>Procurement completed</span></div><div><strong>02</strong><span>Final quantity & value confirmed</span></div><div><strong>03</strong><span>Payment initiated</span></div></div></div></div>;
}

function NotificationsPage({ notifications }) {
  return <div className="page-card"><div className="page-intro"><div><h2>Notifications</h2><p className="muted">Updates about your slots, queue and procurement.</p></div><span className="status-chip neutral">{notifications.length} updates</span></div><div className="notifications-list">{notifications.map(n => <div className={`notification-item ${n.read ? '' : 'unread'}`} key={n.id}><div className="notification-icon"><Bell size={18}/></div><div><strong>{n.title}</strong><p>{n.text}</p><small>{n.time}</small></div>{!n.read && <span className="new-dot"/>}</div>)}</div></div>;
}

function BookingQuickModal({ onClose, onBook }) {
  return <div className="modal-backdrop"><div className="modal-card"><button className="icon-btn modal-close" onClick={onClose}><X size={20}/></button><div className="modal-icon"><CalendarDays size={24}/></div><h2>Start a new booking?</h2><p>We'll take you to the slot booking form where you can choose the procurement centre, date and time.</p><button className="primary-btn full" onClick={onBook}>Continue to booking</button><button className="secondary-btn full" onClick={onClose}>Cancel</button></div></div>;
}

function NavItem({ icon, label, active, onClick, badge }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span>{badge > 0 && <em>{badge}</em>}</button>; }
function StatCard({ icon, label, value, sub }) { return <div className="stat-card"><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{sub}</small></div></div>; }
function JourneyStep({ label, meta, active, done }) { return <div className={`journey-step ${active ? 'active' : ''}`}><div className="journey-dot">{done ? <CheckCircle2 size={17}/> : <span/>}</div><div><strong>{label}</strong><small>{meta}</small></div></div>; }
function JourneyLine({ active }) { return <div className={`journey-line ${active ? 'active' : ''}`} />; }
function InfoRow({ label, value, icon }) { return <div className="info-row"><div className="info-left">{icon}<span>{label}</span></div><strong>{value}</strong></div>; }
function QueueActivity({ token, text, time, done, current }) { return <div className="activity-row"><div className={`activity-dot ${done ? 'done' : current ? 'current' : ''}`}/><div><strong>Token #{token}</strong><span>{text}</span></div><small>{time}</small></div>; }
function ProcStep({ title, text, done }) { return <div className="proc-step"><div className={`proc-dot ${done ? 'done' : ''}`}>{done && <CheckCircle2 size={15}/>}</div><div><strong>{title}</strong><span>{text}</span></div></div>; }
function pageTitle(page) { return ({dashboard:'Dashboard',booking:'Book Slot',queue:'Queue Status',procurement:'Procurement',payment:'Payment Status',notifications:'Notifications'})[page] || 'Dashboard'; }

createRoot(document.getElementById('root')).render(<App />);
