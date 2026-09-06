import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Users,
  ChevronRight,
  MapPin,
  Sprout,
  Phone,
} from "lucide-react";

const todayBookings = [
  {
    token: 19,
    farmer: "Ravi Kumar",
    crop: "Rice",
    quantity: 450,
    time: "10:00 AM – 10:30 AM",
    status: "Completed",
  },
  {
    token: 20,
    farmer: "Suresh Reddy",
    crop: "Rice",
    quantity: 500,
    time: "10:30 AM – 11:00 AM",
    status: "Processing",
  },
  {
    token: 21,
    farmer: "Anitha",
    crop: "Wheat",
    quantity: 350,
    time: "11:00 AM – 11:30 AM",
    status: "Waiting",
  },
  {
    token: 22,
    farmer: "Mahesh",
    crop: "Rice",
    quantity: 600,
    time: "11:30 AM – 12:00 PM",
    status: "Waiting",
  },
];

function ProcurementDashboard() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/procurement-centers"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch procurement centres");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch procurement centres");
        }

        setCenters(data.centers || []);
      } catch (err) {
        console.error("Procurement centres API error:", err);
        setError(err.message || "Unable to load procurement centres");
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  const completed = todayBookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const processing = todayBookings.filter(
    (booking) => booking.status === "Processing"
  ).length;

  const waiting = todayBookings.filter(
    (booking) => booking.status === "Waiting"
  ).length;

  const activeCenters = centers.filter(
    (center) => center.status === "active"
  );

  const currentCenter = activeCenters[0];

  return (
    <div>
      {/* Centre Header */}
      <div className="welcome-banner">
        <div>
          <div className="pill light">PROCUREMENT CENTRE</div>

          <h2>Good morning 👋</h2>

          <p>
            Manage today's farmer bookings, queue and procurement activities
            from one place.
          </p>
        </div>

        <div>
          {loading ? (
            <div className="process-badge">
              <MapPin size={17} />
              Loading centre...
            </div>
          ) : error ? (
            <div className="process-badge">
              <MapPin size={17} />
              Centre unavailable
            </div>
          ) : currentCenter ? (
            <div className="process-badge">
              <MapPin size={17} />
              {currentCenter.name}
            </div>
          ) : (
            <div className="process-badge">
              <MapPin size={17} />
              No active centre
            </div>
          )}
        </div>
      </div>

      {/* Centre Information */}
      <div className="page-card">
        <div className="page-intro">
          <div>
            <h3>Centre information</h3>

            {loading && (
              <p className="muted">
                Loading procurement centre information...
              </p>
            )}

            {error && (
              <p className="muted">
                Unable to load centre information: {error}
              </p>
            )}

            {!loading && !error && !currentCenter && (
              <p className="muted">
                No active procurement centre is available.
              </p>
            )}

            {!loading && !error && currentCenter && (
              <p className="muted">
                Current active procurement centre details.
              </p>
            )}
          </div>

          {!loading && !error && currentCenter && (
            <span className="status-chip completed">
              {currentCenter.status}
            </span>
          )}
        </div>

        {!loading && !error && currentCenter && (
          <div className="procurement-grid">
            <InfoRow
              label="Centre"
              value={currentCenter.name}
              icon={<MapPin size={17} />}
            />

            <InfoRow
              label="Location"
              value={currentCenter.location}
              icon={<MapPin size={17} />}
            />

            <InfoRow
              label="District"
              value={`${currentCenter.district}, ${currentCenter.state}`}
              icon={<MapPin size={17} />}
            />

            <InfoRow
              label="Contact"
              value={currentCenter.contact_number || "Not available"}
              icon={<Phone size={17} />}
            />
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="stat-grid">
        <StatCard
          icon={<CalendarDays />}
          label="Today's bookings"
          value={todayBookings.length}
          sub="Scheduled today"
        />

        <StatCard
          icon={<Users />}
          label="Waiting"
          value={waiting}
          sub="Farmers in queue"
        />

        <StatCard
          icon={<PackageCheck />}
          label="Processing"
          value={processing}
          sub="Currently at centre"
        />

        <StatCard
          icon={<CheckCircle2 />}
          label="Completed"
          value={completed}
          sub="Procurements today"
        />
      </div>

      {/* Current Queue */}
      <div className="section-head">
        <div>
          <h3>Current queue</h3>
          <p className="muted">
            Farmers scheduled for procurement today.
          </p>
        </div>

        <button className="text-btn">
          Manage queue <ChevronRight size={16} />
        </button>
      </div>

      <div className="page-card">
        <div className="procurement-table">
          <div className="procurement-table-header">
            <span>Token</span>
            <span>Farmer</span>
            <span>Crop</span>
            <span>Quantity</span>
            <span>Time</span>
            <span>Status</span>
          </div>

          {todayBookings.map((booking) => (
            <div className="procurement-table-row" key={booking.token}>
              <strong>#{booking.token}</strong>

              <span>{booking.farmer}</span>

              <span className="crop-cell">
                <Sprout size={15} />
                {booking.crop}
              </span>

              <span>{booking.quantity} kg</span>

              <span>{booking.time}</span>

              <StatusBadge status={booking.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="section-head">
        <div>
          <h3>Today's schedule</h3>
          <p className="muted">
            Upcoming appointments at this procurement centre.
          </p>
        </div>

        <div className="process-badge">
          <Clock3 size={17} />
          Centre open
        </div>
      </div>

      <div className="page-card">
        {todayBookings
          .filter((booking) => booking.status !== "Completed")
          .map((booking) => (
            <div className="schedule-row" key={booking.token}>
              <div className="schedule-token">#{booking.token}</div>

              <div className="schedule-info">
                <strong>{booking.farmer}</strong>
                <span>
                  {booking.crop} • {booking.quantity} kg
                </span>
              </div>

              <div className="schedule-time">
                <CalendarDays size={16} />
                {booking.time}
              </div>

              <button className="secondary-btn">
                View <ChevronRight size={15} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{sub}</small>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusClass = status.toLowerCase();

  return (
    <span className={`status-chip ${statusClass}`}>
      {status}
    </span>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="info-row">
      <div className="info-left">
        {icon}
        <span>{label}</span>
      </div>

      <strong>{value}</strong>
    </div>
  );
}

export default ProcurementDashboard;

