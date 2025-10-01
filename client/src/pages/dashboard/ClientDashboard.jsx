import { useState } from "react";
import {
  User,
  ShoppingCart,
  Heart,
  DollarSign,
  Bell,
  CheckCircle,
  Clock,
  Trash2,
  Menu,
  X,
} from "lucide-react";

const sidebarItems = [
  { id: "profile", label: "Profile", icon: <User size={18} /> },
  { id: "orders", label: "Orders", icon: <ShoppingCart size={18} /> },
  { id: "wishlist", label: "Wishlist", icon: <Heart size={18} /> },
  { id: "payments", label: "Payments", icon: <DollarSign size={18} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
];

export default function ClientDashboard() {
  const [activeView, setActiveView] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case "profile": return <ProfileView />;
      case "orders": return <OrdersView />;
      case "wishlist": return <WishlistView />;
      case "payments": return <PaymentsView />;
      case "notifications": return <NotificationsView />;
      default: return <ProfileView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-900">
      {/* Mobile Overlay */}
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
          <h1 className="text-xl font-semibold">Client</h1>
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
function ProfileView() {
  const orders = [
    { id: 1, name: "Cement Supply", status: "Ongoing", provider: "BuildCorp Ltd" },
    { id: 2, name: "Interior Design Service", status: "Completed", provider: "DesignPro Associates" },
  ];
  return (
    <>
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Welcome back, Sarah 👋</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<CheckCircle />} label="Completed Orders" value="12" />
          <StatCard icon={<Clock />} label="Ongoing Orders" value="3" />
          <StatCard icon={<ShoppingCart />} label="Pending Orders" value="2" />
          <StatCard icon={<DollarSign />} label="Total Spent" value="$8,750" />
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="flex justify-between items-center text-sm">
              <div>
                <p className="font-medium">{o.name}</p>
                <p className="text-gray-500">Provider: {o.provider}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                  o.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {o.status}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-3 text-sm text-gray-700">
          <p>📌 Order #101 "Cement Supply" is now in progress.</p>
          <p>📌 Your payment of <b>$1,200</b> has been received.</p>
        </div>
      </section>
    </>
  );
}

function OrdersView() {
  const orders = [
    { id: 1, name: "Cement Supply", status: "Ongoing", provider: "BuildCorp Ltd", date: "2024-08-20" },
    { id: 2, name: "Interior Design Service", status: "Completed", provider: "DesignPro Associates", date: "2024-08-18" },
    { id: 3, name: "Steel Rods Purchase", status: "Pending", provider: "SteelMax Wholesalers", date: "2024-08-21" },
    { id: 4, name: "Electrical Wiring", status: "Completed", provider: "Spark Electricals", date: "2024-08-15" },
  ];
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-4">
        {orders.map((o) => (
          <div
            key={o.id}
            className="flex justify-between items-center text-sm p-4 rounded-lg bg-gray-50 border"
          >
            <div>
              <p className="font-medium text-base">{o.name}</p>
              <p className="text-gray-500">Provider: {o.provider} | Date: {o.date}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                o.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : o.status === "Ongoing"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {o.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function WishlistView() {
  const [wishlist, setWishlist] = useState([
    { id: 1, name: "Smart Lighting System", img: "https://via.placeholder.com/100/D3D3D3/FFFFFF?text=Light" },
    { id: 2, name: "Modular Kitchen Setup", img: "https://via.placeholder.com/100/D3D3D3/FFFFFF?text=Kitchen" },
    { id: 3, name: "High-Quality Paints", img: "https://via.placeholder.com/100/D3D3D3/FFFFFF?text=Paint" },
  ]);
  const removeFromWishlist = (id) => setWishlist(wishlist.filter(item => item.id !== id));
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map(item => (
          <div
            key={item.id}
            className="bg-white border rounded-xl shadow-sm p-4 flex flex-col justify-between"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-24 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold text-sm mb-4">{item.name}</h3>
            <button
              onClick={() => removeFromWishlist(item.id)}
              className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1"
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function PaymentsView() {
  const payments = [
    { id: 1, to: "BuildCorp Ltd", amount: "$1,200.00", date: "2024-08-22", status: "Paid" },
    { id: 2, to: "DesignPro Associates", amount: "$850.00", date: "2024-08-20", status: "Paid" },
    { id: 3, to: "SteelMax Wholesalers", amount: "$2,500.00", date: "2024-08-21", status: "Due" },
  ];
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Payments</h2>
      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Payment History</h3>
        <ul className="space-y-3">
          {payments.map(p => (
            <li
              key={p.id}
              className="flex justify-between items-center text-sm"
            >
              <div>
                <p className="text-gray-800">To: {p.to}</p>
                <p className="text-gray-400 text-xs">{p.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">{p.amount}</p>
                <p
                  className={`text-xs font-semibold ${
                    p.status === "Paid" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {p.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function NotificationsView() {
  const notifications = [
    { id: 1, text: "Order #101 'Cement Supply' is now in progress.", time: "1 day ago", icon: <ShoppingCart /> },
    { id: 2, text: "Your payment of $1,200 has been received by BuildCorp Ltd.", time: "2 days ago", icon: <DollarSign /> },
    { id: 3, text: "Special offer: 10% discount on all interior design services this month.", time: "4 days ago", icon: <Heart /> },
  ];
  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <div className="bg-gray-50 border rounded-xl p-6 space-y-4">
        {notifications.map(n => (
          <div
            key={n.id}
            className="flex items-start gap-4 p-4 bg-white rounded-lg border"
          >
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
// --- Reusable Components ---
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
