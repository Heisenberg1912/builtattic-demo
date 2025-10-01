import { useState } from "react";
import {
  Building2,
  Users,
  Briefcase,
  DollarSign,
  Bell,
  UserCheck,
  UserX,
  Plus,
  Menu,
  X,
} from "lucide-react";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: <Building2 size={18} /> },
  { id: "employees", label: "Employees", icon: <Users size={18} /> },
  { id: "projects", label: "Projects", icon: <Briefcase size={18} /> },
  { id: "earnings", label: "Earnings", icon: <DollarSign size={18} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
];

export default function FirmDashboard() {
  const [activeView, setActiveView] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "overview": return <OverviewView />;
      case "employees": return <EmployeesView />;
      case "projects": return <ProjectsView />;
      case "earnings": return <EarningsView />;
      case "notifications": return <NotificationsView />;
      default: return <OverviewView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Overlay for mobile */}
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
          <h1 className="text-xl font-semibold">Firm</h1>
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

      {/* Main */}
      <main className="flex-1 flex flex-col max-w-full">
        {/* Topbar */}
        <header className="flex items-center justify-between p-4 md:p-6 border-b bg-white">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-semibold capitalize">{activeView}</h2>
          </div>
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-10 h-10 rounded-full border border-gray-200"
          />
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">{renderContent()}</div>
      </main>
    </div>
  );
}

//
// --- Views ---
//
function OverviewView() {
  const employees = { total: 120, available: 45, assigned: 75 };
  const projects = [
    { id: 1, name: "Highway Construction", status: "Ongoing", client: "Govt. Infrastructure" },
    { id: 2, name: "Corporate Office Setup", status: "Pending", client: "TechWave Ltd" },
    { id: 3, name: "Mall Renovation", status: "Completed", client: "CityMalls Group" },
  ];

  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Welcome, BuildCorp Ltd 👋</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Users />} label="Total Employees" value={employees.total} />
          <StatCard icon={<UserCheck />} label="Available" value={employees.available} />
          <StatCard icon={<UserX />} label="Assigned" value={employees.assigned} />
          <StatCard icon={<DollarSign />} label="Total Earnings" value="$56,200" />
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
          {projects.map((p) => (
            <div key={p.id} className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-gray-500">Client: {p.client}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                  p.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : p.status === "Ongoing"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-3 text-sm text-gray-700">
          <p>📌 New project request from <b>UrbanBuild Co.</b></p>
          <p>📌 10 employees assigned to "Highway Construction".</p>
          <p>📌 Payment of <b>$15,000</b> received for "Mall Renovation".</p>
        </div>
      </section>
    </>
  );
}

function EmployeesView() {
  const employees = [
    { id: 1, name: "John Doe", role: "Project Manager", status: "Assigned" },
    { id: 2, name: "Jane Smith", role: "Architect", status: "Available" },
    { id: 3, name: "Peter Jones", role: "Engineer", status: "Assigned" },
    { id: 4, name: "Mary Jane", role: "Surveyor", status: "Available" },
  ];
  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employees</h2>
        <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
          <Plus size={16} /> Add Employee
        </button>
      </div>
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <ul className="space-y-4">
          {employees.map((emp) => (
            <li key={emp.id} className="flex justify-between items-center text-sm p-4 rounded-lg bg-gray-50 border">
              <div>
                <p className="font-medium text-base">{emp.name}</p>
                <p className="text-gray-500">{emp.role}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                  emp.status === "Available"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {emp.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectsView() {
  const projects = [
    { id: 1, name: "Highway Construction", status: "Ongoing", client: "Govt. Infrastructure", budget: "$5M" },
    { id: 2, name: "Corporate Office Setup", status: "Pending", client: "TechWave Ltd", budget: "$1.2M" },
    { id: 3, name: "Mall Renovation", status: "Completed", client: "CityMalls Group", budget: "$2.5M" },
  ];
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="space-y-4">
        {projects.map((p) => (
          <div key={p.id} className="bg-gray-50 border rounded-xl p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-gray-500 text-sm">Client: {p.client} | Budget: {p.budget}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                  p.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : p.status === "Ongoing"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EarningsView() {
  const transactions = [
    { id: 1, from: "CityMalls Group", amount: "+$15,000", date: "2024-08-22" },
    { id: 2, from: "TechWave Ltd (Advance)", amount: "+$5,000", date: "2024-08-20" },
    { id: 3, from: "Govt. Infrastructure", amount: "+$25,000", date: "2024-08-18" },
  ];
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Earnings</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 text-white p-6 rounded-xl">
          <p className="text-gray-300 text-sm">Total Revenue</p>
          <p className="text-3xl font-bold mt-2">$56,200.00</p>
        </div>
        <div className="lg:col-span-2 bg-gray-50 border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Recent Transactions</h3>
          <ul className="space-y-3 text-sm">
            {transactions.map((t) => (
              <li key={t.id} className="flex justify-between">
                <div>
                  <p className="text-gray-800">From {t.from}</p>
                  <p className="text-gray-400 text-xs">{t.date}</p>
                </div>
                <p className="font-medium text-green-600">{t.amount}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function NotificationsView() {
  const notifications = [
    { id: 1, text: "New project request from UrbanBuild Co.", time: "2 hours ago", icon: <Briefcase /> },
    { id: 2, text: "10 employees assigned to 'Highway Construction'.", time: "1 day ago", icon: <Users /> },
    { id: 3, text: "Payment of $15,000 received for 'Mall Renovation'.", time: "3 days ago", icon: <DollarSign /> },
  ];
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <div className="bg-gray-50 border rounded-xl p-6 space-y-4">
        {notifications.map((n) => (
          <div key={n.id} className="flex items-start gap-4 p-4 bg-white rounded-lg border">
            <div className="text-gray-500 mt-1">{n.icon}</div>
            <div>
              <p className="text-gray-800">{n.text}</p>
              <p className="text-gray-400 text-xs mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

//
// --- Reusable ---
//
function SidebarButton({ icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center px-3 py-2.5 rounded-lg text-gray-700 transition-colors ${
        isActive ? "bg-gray-200 font-semibold" : "hover:bg-gray-100"
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl border p-4 flex items-center space-x-3 shadow-sm">
      <div className="bg-gray-50 p-2 rounded-full border">{icon}</div>
      <div>
        <h3 className="text-xs text-gray-500">{label}</h3>
        <p className="text-lg font-bold">{value}</p>
      </div>
    </div>
  );
}
