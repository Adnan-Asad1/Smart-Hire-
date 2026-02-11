import React, { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  ClipboardList,
  Bell,
  Moon,
  Sun,
  CalendarCheck,
  CheckCircle,
  Activity,
} from "lucide-react";
import AdminSideBar from "./AdminSideBar";
import {Link} from 'react-router-dom';
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all p-6 flex flex-col justify-between h-36">
    <div className="flex items-center gap-3">
      <div className={`p-3 rounded-xl ${color} text-white shadow-md`}>
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h3>
    </div>
    <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">
      {value}
    </p>
  </div>
);

const Section = ({ title, children, right, className }) => (
  <section
    className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all p-6 ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
        {title}
      </h3>
      {right}
    </div>
    {children}
  </section>
);

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [counts, setCounts] = useState({
    hrCount: 0,
    employeesCount: 0,
    pendingRequests: 0,
    interviewsCount: 0,
    completedInterview: 0,
  });
  const [loading, setLoading] = useState(true);

  // ✅ state for latest pending requests
  const [latestRequests, setLatestRequests] = useState([]);

  // ✅ state for recent activities
  const [recentActivities, setRecentActivities] = useState([]);

  // ✅ Fetch Dashboard Counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard/counts");
        const data = await res.json();
        if (data.success) {
          setCounts({
            hrCount: data.counts.hrCount,
            employeesCount: data.counts.employeesCount,
            pendingRequests: data.counts.pendingRequests,
            interviewsCount: data.counts.interviewsCount,
            completedInterview: data.counts.completedInterview,
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // ✅ Fetch latest pending requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard/LatestPendingRequests");
        const data = await res.json();
        if (data.success) {
          setLatestRequests(data.pendingRequests);
        }
      } catch (error) {
        console.error("Error fetching latest pending requests:", error);
      }
    };

    fetchPendingRequests();
  }, []);

  // ✅ Fetch recent activities (latest 2 interviews with HR name)
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/interview/latestWithUser/fetch");
        const data = await res.json();
        if (data.success) {
          setRecentActivities(data.interviews);
        }
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      }
    };

    fetchRecentActivities();
  }, []);

  // ✅ Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex min-h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:bg-gray-900">
        {/* Sidebar */}
        <div className=" dark:bg-gray-800  w-64 fixed left-0 top-0 h-screen">
          <AdminSideBar />
        </div>

        {/* Main Content */}
        <main className="flex-1 ml-64 px-8 py-6">
          {/* Header */}
          <header className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white">
                Welcome back, <span className="text-blue-600">Admin</span> 👋
              </h2>
              <p className="text-gray-500 dark:text-gray-300 mt-1 text-sm">
                Dashboard overview & system summary
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-md">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 shadow-md"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </header>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Total HRs"
              value={loading ? "..." : counts.hrCount}
              icon={Users}
              color="bg-blue-600"
            />
            <StatCard
              title="Total Employees"
              value={loading ? "..." : counts.employeesCount}
              icon={Users}
              color="bg-green-600"
            />
            <StatCard
              title="Pending Requests"
              value={loading ? "..." : counts.pendingRequests}
              icon={UserCheck}
              color="bg-yellow-500"
            />
            <StatCard
              title="Total Interviews"
              value={loading ? "..." : counts.interviewsCount}
              icon={ClipboardList}
              color="bg-indigo-600"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            {/* Left Column */}
            <div className="xl:col-span-2 flex flex-col justify-between space-y-8">
              <Section
                title="Pending Requests"
                className="flex-1 flex flex-col justify-center mt-[30px]"
                right={
                  <button className="text-sm px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-100 dark:hover:bg-blue-600/30 text-blue-600 dark:text-blue-400">
                   
                   <Link  to="/PendingRequests">
                    View all
                   </Link>
                   
                  </button>
                }
              >
                <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr className="text-gray-600 dark:text-gray-300 text-sm">
                        <th className="p-3">Name</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Requested On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {latestRequests.length > 0 ? (
                        latestRequests.map((req, idx) => (
                          <tr
                            key={idx}
                            className="border-t border-gray-100 dark:border-gray-700"
                          >
                            <td className="p-3 text-gray-800 dark:text-gray-200">
                              {req.name}
                            </td>
                            <td className="p-3 text-gray-800 dark:text-gray-200">
                              {req.role}
                            </td>
                            <td className="p-3 text-yellow-600 font-medium">
                              {req.status}
                            </td>
                            <td className="p-3 text-gray-600 dark:text-gray-400">
                              {formatDate(req.requestedOn)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="border-t border-gray-100 dark:border-gray-700">
                          <td
                            className="p-3 text-gray-500 dark:text-gray-400"
                            colSpan="4"
                          >
                            No pending requests
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Section>

              {/* ✅ Recent Activities from backend */}
              <Section title="Recent Activities" className="mt-6">
                <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-sm">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, idx) => (
                      <li
                        key={idx}
                        className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg shadow-sm"
                      >
                        HR <b>{activity.hrName}</b> created interview for{" "}
                        <i>{activity.jobTitle}</i> on{" "}
                        {formatDate(activity.createdAt)}.
                      </li>
                    ))
                  ) : (
                    <li className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg shadow-sm">
                      No recent activities
                    </li>
                  )}
                </ul>
              </Section>
            </div>

            {/* Right Column */}
            <div className="flex flex-col justify-between space-y-8">
              <Section
                title="Interviews Overview"
                className="flex-1 flex flex-col justify-center"
              >
                <div className="grid gap-4">
                  <div className="flex items-center gap-4 p-5 rounded-xl bg-blue-50 dark:bg-blue-600/20 shadow-md">
                    <CalendarCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Scheduled Interviews
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : counts.interviewsCount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-5 rounded-xl bg-green-50 dark:bg-green-600/20 shadow-md">
                    <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Completed Interviews
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {loading ? "..." : counts.completedInterview}
                      </p>
                    </div>
                  </div>
                </div>
              </Section>

              <Section
                title="System Health"
                className="flex-1 flex flex-col justify-center mt-[32px]"
              >
                <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-700/50 flex items-center gap-4 shadow-md">
                  <Activity className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Server Uptime
                    </p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      99.9%
                    </p>
                  </div>
                </div>
              </Section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
