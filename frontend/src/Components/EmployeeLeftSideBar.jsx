// src/components/EmployeeLeftSideBar.jsx
import React from "react";
import {
  User,
  Clock,
  Calendar,
  Layers,
  Target,
  DollarSign,
  FileText,
  Briefcase,
  MessageSquare,
  Shield,
  Settings,
  Plus,
  Upload,
  Download,
  ChevronRight,
} from "lucide-react";
import{Link} from 'react-router-dom'
// 🔹 Simple UI primitives defined here
const Card = ({ className, children }) => (
  <div
    className={`rounded-2xl border border-gray-200 bg-white dark:bg-zinc-800 shadow-sm ${className || ""}`}
  >
    {children}
  </div>
);

const Divider = () => (
  <hr className="my-2 border-zinc-200 dark:border-zinc-700" />
);

const Button = ({ className, children, ...props }) => (
  <button
    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition ${className || ""}`}
    {...props}
  >
    {children}
  </button>
);

const Badge = ({ children }) => (
  <span className="rounded-lg bg-zinc-100 dark:bg-zinc-700 px-2 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
    {children}
  </span>
);

// 🔹 Sidebar Link
const SidebarLink = ({ icon: Icon, label, active = false }) => (
  <div
    className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm cursor-pointer select-none 
      ${
        active
          ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
          : "hover:bg-blue-100 dark:hover:bg-blue-900 text-zinc-700 dark:text-zinc-300"
      }`}
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
    {active && <ChevronRight className="w-4 h-4 ml-auto opacity-70" />}
  </div>
);

// 🔹 Sidebar Component
const EmployeeLeftSideBar = () => {
  return (
    <div className="sticky top-[76px] space-y-2">
      {/* Profile Card */}
      <Card className="p-3">
        <div className="flex items-center gap-3 p-2">
          <img
            src="https://i.pravatar.cc/80"
            alt="avatar"
            className="h-12 w-12 rounded-2xl"
          />
          <div>
            <div className="text-sm font-semibold">Ali Raza</div>
            <div className="text-xs text-zinc-500">Employee ID: EMP-1042</div>
          </div>
        </div>
        <Divider />
        <div className="p-2 space-y-1">
          <SidebarLink icon={User} label="Profile" active />
          <SidebarLink icon={Clock} label="Attendance" />
          <Link to="/LeavePage">
          <SidebarLink icon={Calendar} label="Leaves" />
          
          </Link>

          <Link to="/EmployeeProjectsTasks">
          
          <SidebarLink icon={Layers} label="Tasks & Projects" />
          
          </Link>
          <SidebarLink icon={Target} label="Performance" />
          <SidebarLink icon={DollarSign} label="Payroll" />

          <Link to="/EmployeeDocumentsPage">
          
          <SidebarLink icon={FileText} label="Documents" />
          
          </Link>
          <SidebarLink icon={Briefcase} label="Training" />
          <SidebarLink icon={MessageSquare} label="Messages" />
          <SidebarLink icon={Shield} label="Policies" />
          <SidebarLink icon={Settings} label="Settings" />
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-3">
        <div className="flex items-center justify-between px-2">
          <div className="text-sm font-semibold">Quick Actions</div>
          <Badge>Shortcuts</Badge>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button className="w-full justify-center">
            <Plus className="w-4 h-4" /> Apply Leave
          </Button>
          <Button className="w-full justify-center">
            <Upload className="w-4 h-4" /> Upload Doc
          </Button>
          <Button className="w-full justify-center">
            <Download className="w-4 h-4" /> Payslip
          </Button>
          <Button className="w-full justify-center">
            <Target className="w-4 h-4" /> Set Goal
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeLeftSideBar;
