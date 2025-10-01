import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  Building2,
  Briefcase,
  ShoppingCart,
  UserCog,
  LayoutDashboard,
  Plus,
  MoreVertical,
  Menu,
  X,
} from "lucide-react";

// Sidebar config
const sidebarItems = [
  { id: "Dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "Users", label: "Users", icon: <Users size={18} /> },
  { id: "Associates", label: "Associates", icon: <UserCog size={18} /> },
  { id: "Firms", label: "Firms", icon: <Building2 size={18} /> },
  { id: "Clients", label: "Clients", icon: <Briefcase size={18} /> },
  { id: "Sales", label: "Sales", icon: <ShoppingCart size={18} /> },
];

export default function SuperAdminDashboard({ onLogout }) {
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const normalizedSearch = search.trim().toLowerCase();

  const handleSearchKey = (e) => {
    if (e.key === "Enter" && normalizedSearch) {
      const match = sidebarItems.find(it =>
        it.id.toLowerCase().startsWith(normalizedSearch) ||
        it.label.toLowerCase().startsWith(normalizedSearch)
      );
      if (match) {
        setActiveView(match.id);
        // optional: keep search text so lists remain filtered
      }
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      navigate("/login", { replace: true });
    } else {
      // Fallback (should not happen if prop passed)
      localStorage.removeItem("auth_token");
      localStorage.removeItem("role");
      window.location.replace("/login");
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case "Users": return <UsersView search={normalizedSearch} />;
      case "Associates": return <AssociatesView search={normalizedSearch} />;
      case "Firms": return <FirmsView search={normalizedSearch} />;
      case "Clients": return <ClientsView search={normalizedSearch} />;
      case "Sales": return <SalesView search={normalizedSearch} />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Sidebar (mobile overlay) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 w-64 bg-white border-r border-gray-200 p-4 flex-col transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">Super Admin</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <SidebarButton
              key={item.id}
              icon={item.icon}
              label={item.label}
              isActive={activeView === item.id}
              onClick={() => {
                setActiveView(item.id);
                setSidebarOpen(false);
              }}
            />
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col max-w-full">
        {/* Topbar */}
        <header className="flex items-center justify-between p-4 md:p-6 border-b bg-white">
          <div className="flex items-center gap-3 w-2/3 md:w-1/3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search users, associates, firms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKey}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {normalizedSearch && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-2 text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-xs md:text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
            <span className="text-sm text-gray-600 hidden sm:block">Super Admin</span>
            <img
              src="https://via.placeholder.com/40"
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-200"
            />
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">{renderContent()}</div>
      </main>
    </div>
  );
}

//
// --- Views ---
//
function DashboardView() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <DashboardCard icon={<Users />} title="Users" description="1,245 total users" />
      <DashboardCard icon={<UserCog />} title="Associates" description="320 active associates" />
      <DashboardCard icon={<Building2 />} title="Firms" description="56 partner firms" />
      <DashboardCard icon={<Briefcase />} title="Clients" description="480 clients" />
      <DashboardCard icon={<ShoppingCart />} title="Sales" description="$1.2M total sales" />
    </div>
  );
}

function UsersView({ search }) {
  const users = [
    { name: "John Doe", email: "john@example.com", role: "Client", status: "Active" },
    { name: "Alex Ray", email: "alex@example.com", role: "Associate", status: "Active" },
    { name: "BuildCorp", email: "contact@buildcorp.com", role: "Firm", status: "Inactive" },
  ];
  const filtered = !search
    ? users
    : users.filter(u =>
        [u.name, u.email, u.role, u.status].some(v =>
          v.toLowerCase().includes(search)
        )
      );
  return (
    <Section title="User Management" actionLabel="Add User">
      <Table
        headers={["Name", "Role", "Status", ""]} 
        rows={filtered.map((u) => [
          <span>
            {u.name}
            <br />
            <span className="text-gray-400">{u.email}</span>
          </span>,
            u.role,
            <StatusBadge status={u.status} />,
            <button><MoreVertical size={16} /></button>,
        ])}
      />
      {filtered.length === 0 && <EmptySearchNotice term={search} />}
    </Section>
  );
}

function AssociatesView({ search }) {
  const associates = [
    { name: "Alex Ray", spec: "Plumber", rating: "4.8/5", jobs: 12 },
    { name: "Jane Poe", spec: "Architect", rating: "4.9/5", jobs: 8 },
    { name: "Sam Wilson", spec: "Electrician", rating: "4.7/5", jobs: 21 },
  ];
  const filtered = !search
    ? associates
    : associates.filter(a =>
        [a.name, a.spec, a.rating].some(v => v.toLowerCase().includes(search))
      );
  return (
    <Section title="Associates">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((a) => (
          <div key={a.name} className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold">{a.name}</h3>
            <p className="text-sm text-gray-500">{a.spec}</p>
            <div className="flex justify-between items-center mt-4 text-sm">
              <span>⭐ {a.rating}</span>
              <span>{a.jobs} jobs</span>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <EmptySearchNotice term={search} />}
    </Section>
  );
}

function FirmsView({ search }) {
  const firms = [
    { name: "BuildCorp Ltd", location: "New York, USA", status: "Verified" },
    { name: "DesignPro", location: "London, UK", status: "Verified" },
    { name: "UrbanBuild Co.", location: "Tokyo, Japan", status: "Pending" },
  ];
  const filtered = !search
    ? firms
    : firms.filter(f =>
        [f.name, f.location, f.status].some(v => v.toLowerCase().includes(search))
      );
  return (
    <Section title="Firms">
      <div className="space-y-3">
        {filtered.map((f) => (
          <div key={f.name} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
            <div>
              <h3 className="font-semibold">{f.name}</h3>
              <p className="text-sm text-gray-500">{f.location}</p>
            </div>
            <StatusBadge status={f.status} />
          </div>
        ))}
      </div>
      {filtered.length === 0 && <EmptySearchNotice term={search} />}
    </Section>
  );
}

function ClientsView({ search }) {
  const clients = [
    { name: "Sarah Connor", spent: "$8,750", orders: 15 },
    { name: "Mike Vance", spent: "$12,300", orders: 21 },
    { name: "Lisa Ray", spent: "$5,100", orders: 8 },
  ];
  const filtered = !search
    ? clients
    : clients.filter(c => c.name.toLowerCase().includes(search));
  return (
    <Section title="Clients">
      <Table
        headers={["Name", "Total Spent", "Orders"]}
        rows={filtered.map((c) => [c.name, c.spent, c.orders])}
      />
      {filtered.length === 0 && <EmptySearchNotice term={search} />}
    </Section>
  );
}

function SalesView({ search }) {
  const sales = [
    { id: "#TXN101", amount: "$1,200", status: "Completed" },
    { id: "#TXN102", amount: "$2,500", status: "Pending" },
    { id: "#TXN103", amount: "$800", status: "Completed" },
  ];
  const filtered = !search
    ? sales
    : sales.filter(s =>
        [s.id, s.amount, s.status].some(v => v.toLowerCase().includes(search))
      );
  return (
    <Section title="Sales & Transactions">
      <ul className="space-y-3">
        {filtered.map((s) => (
          <li key={s.id} className="flex justify-between items-center text-sm bg-white p-3 rounded-lg border">
            <p className="font-medium">{s.id}</p>
            <p>{s.amount}</p>
            <StatusBadge status={s.status} />
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <EmptySearchNotice term={search} />}
    </Section>
  );
}

//
// --- Reusable Components ---
//
function SidebarButton({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition ${
        isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
}

function DashboardCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg border p-4 flex items-center space-x-3 shadow-sm">
      <div className="p-2 bg-gray-50 rounded-full border">{icon}</div>
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function Section({ title, children, actionLabel }) {
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {actionLabel && (
          <button className="flex items-center gap-2 bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-700">
            <Plus size={14} /> {actionLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="bg-white border rounded-lg overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-gray-500 bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-green-100 text-green-700",
    Completed: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Verified: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${styles[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

// Helper component for empty search results
function EmptySearchNotice({ term }) {
  return (
    <div className="mt-6 text-center text-sm text-gray-500">
      No results found for "<span className="font-medium">{term}</span>"
    </div>
  );
}

