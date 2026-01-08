import { NavLink, Route, Routes } from "react-router-dom";
import DashboardHome from "./pages/DashboardHome";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import PasswordReset from "./pages/auth/PasswordReset";
import SettingsOrg from "./pages/settings/SettingsOrg";
import SettingsMembers from "./pages/settings/SettingsMembers";
import SettingsApiKeys from "./pages/settings/SettingsApiKeys";
import AgentsList from "./pages/agents/AgentsList";
import RunsList from "./pages/runs/RunsList";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/agents", label: "Agents" },
  { to: "/runs", label: "Runs" },
  { to: "/settings/org", label: "Org Settings" },
  { to: "/settings/members", label: "Members" },
  { to: "/settings/api-keys", label: "API Keys" },
];

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-lg font-semibold">AgentOps Hub</p>
            <p className="text-sm text-slate-400">Control plane for AI agents</p>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 transition ${
                    isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:text-white"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/agents" element={<AgentsList />} />
          <Route path="/runs" element={<RunsList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/settings/org" element={<SettingsOrg />} />
          <Route path="/settings/members" element={<SettingsMembers />} />
          <Route path="/settings/api-keys" element={<SettingsApiKeys />} />
        </Routes>
      </main>
    </div>
  );
}
