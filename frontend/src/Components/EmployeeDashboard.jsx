import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";
import { Search, Bell, Sun, Moon, LogOut,  Clock, Calendar, Briefcase,Shield, Target, FileText, DollarSign, Layers,  ChevronRight, CheckCircle2, Upload, Download, MessageSquare,  PlayCircle, PauseCircle, ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import EmployeeLeftSideBar from "./EmployeeLeftSideBar";


// Minimal shadcn-like primitives (fallbacks if shadcn not installed)
// If you already have shadcn/ui, replace these with imports from "@/components/ui/*".

const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur shadow-sm border border-zinc-100 dark:border-zinc-800 ${className}`}>{children}</div>
);
const CardHeader = ({ className = "", children }) => (
  <div className={`px-5 pt-5 ${className}`}>{children}</div>
);
const CardContent = ({ className = "", children }) => (
  <div className={`px-5 pb-5 ${className}`}>{children}</div>
);
const Button = ({ className = "", children, ...props }) => (
  <button
    className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-sm border border-transparent 
      bg-blue-600 text-white hover:bg-blue-700 
      dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Badge = ({ className = "", children }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 ${className}`}>{children}</span>
);
const Input = ({ className = "", ...props }) => (
  <input className={`w-full rounded-2xl border bg-white/60 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-700 ${className}`} {...props} />
);
const Divider = () => <div className="h-px bg-zinc-100 dark:bg-zinc-800" />;

// Demo data
const attendanceTrend = [
  { month: "Jan", present: 20, late: 1 },
  { month: "Feb", present: 21, late: 0 },
  { month: "Mar", present: 22, late: 2 },
  { month: "Apr", present: 21, late: 1 },
  { month: "May", present: 22, late: 0 },
  { month: "Jun", present: 21, late: 1 },
  { month: "Jul", present: 22, late: 0 },
  { month: "Aug", present: 23, late: 0 },
];

const tasks = [
  { id: 1, title: "Build Interview Flow", project: "AI Recruiter", priority: "High", due: "Sep 10", status: "In Progress" },
  { id: 2, title: "Fix Socket.IO Events", project: "Video Service", priority: "Medium", due: "Sep 06", status: "To-do" },
  { id: 3, title: "Prepare Q3 Report", project: "Admin Portal", priority: "Low", due: "Sep 20", status: "To-do" },
];

const leaves = [
  { id: 1, type: "Annual", from: "Sep 16", to: "Sep 18", days: 3, status: "Pending" },
  { id: 2, type: "Sick", from: "Aug 02", to: "Aug 03", days: 2, status: "Approved" },
];

const performance = [
  { month: "Apr", score: 72 },
  { month: "May", score: 78 },
  { month: "Jun", score: 81 },
  { month: "Jul", score: 84 },
  { month: "Aug", score: 86 },
];

const payroll = [
  { month: "May", net: 180000 },
  { month: "Jun", net: 180000 },
  { month: "Jul", net: 190000 },
  { month: "Aug", net: 190000 },
];

const documents = [
  { id: 1, name: "Offer Letter.pdf", size: "256 KB", uploaded: "Jun 02" },
  { id: 2, name: "ID - CNIC.pdf", size: "412 KB", uploaded: "Jun 15" },
  { id: 3, name: "July Payslip.pdf", size: "198 KB", uploaded: "Aug 01" },
];

const training = [
  { id: 1, title: "Advanced React Patterns", date: "Sep 12", status: "Upcoming" },
  { id: 2, title: "Security Best Practices", date: "Aug 05", status: "Completed" },
];

const announcements = [
  { id: 1, title: "Company Townhall", date: "Sep 08", description: "Quarterly updates & Q&A." },
  { id: 2, title: "Holiday Notice", date: "Sep 14", description: "Public holiday observed." },
];

const kpis = [
  { label: "Attendance", value: "96%", icon: <Clock className="w-4 h-4" />, delta: "+2%", hint: "Last 30 days" },
  { label: "Tasks Done", value: "38", icon: <Layers className="w-4 h-4" />, delta: "+6", hint: "This month" },
  { label: "Leaves Left", value: "07", icon: <Calendar className="w-4 h-4" />, delta: "-1", hint: "Annual quota" },
  { label: "Performance", value: "86", icon: <Target className="w-4 h-4" />, delta: "+4", hint: "Score" },
];

const SummaryCard = ({ kpi }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
          {kpi.label === "Attendance" && (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white dark:bg-blue-500 dark:text-white">
              {kpi.icon}
            </span>
          )}
          {kpi.label === "Tasks Done" && (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white">
              {kpi.icon}
            </span>
          )}
          {kpi.label === "Leaves Left" && (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white dark:bg-amber-400 dark:text-white">
              {kpi.icon}
            </span>
          )}
          {kpi.label === "Performance" && (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white dark:bg-purple-500 dark:text-white">
              {kpi.icon}
            </span>
          )}
          <span className="text-xs">{kpi.label}</span>
        </div>
        <Badge>{kpi.hint}</Badge>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <div className="text-3xl font-semibold tracking-tight">{kpi.value}</div>
        <div className={`text-xs ${kpi.delta?.startsWith("-") ? "text-rose-500" : "text-emerald-600"}`}>
          {kpi.delta}
        </div>
      </div>
    </CardHeader>
  </Card>
);


const SectionHeader = ({ icon: Icon, title, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
<span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600 text-white dark:bg-blue-500 dark:text-white">
  <Icon className="w-4 h-4" />
</span>
      <h3 className="text-sm font-semibold tracking-wide">{title}</h3>
    </div>
    <div>{action}</div>
  </div>
);

const Table = ({ columns, data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left text-zinc-500">
          {columns.map((c) => (
            <th key={c.key} className="px-2 py-2 font-medium">{c.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border-t border-zinc-100 dark:border-zinc-800">
            {columns.map((c) => (
              <td key={c.key} className="px-2 py-3 whitespace-nowrap">{row[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle('dark', dark);
    }
  }, [dark]);
  return [dark, setDark];
}




const TopBar = ({ dark, setDark }) => (
  <div className="sticky top-0 z-30 backdrop-blur bg-white/60 dark:bg-zinc-950/60 border-b border-zinc-100 dark:border-zinc-800">
    <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
      <div className="flex items-center gap-3 py-3">
        <div className="hidden md:flex items-center gap-2 text-zinc-900 dark:text-white">
          <div className="font-semibold">Acme HR</div>
          <Badge>Employee Portal</Badge>
        </div>

        <div className="flex-1" />

        <div className="w-full max-w-xl hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
            <Input placeholder="Search tasks, documents, policies..." className="pl-9" />
          </div>
        </div>

        <button className="relative p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] px-1">3</span>
        </button>
        <button onClick={() => setDark(!dark)} className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800">
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer">
          <img src="https://i.pravatar.cc/40" alt="avatar" className="h-7 w-7 rounded-full" />
          <div className="hidden sm:block">
            <div className="text-xs font-medium">Ali Raza</div>
            <div className="text-[11px] text-zinc-500">Frontend Engineer</div>
          </div>
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
    </div>
  </div>
);

const CalendarMini = () => {
  const days = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);
  const present = new Set([1,2,3,4,5,8,9,10,11,12,15,16,17,18,19,22,23,24,25,26,29,30]);
  const late = new Set([6,20]);
  const absent = new Set([7,21,28]);
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => {
        let cls = "bg-zinc-100 text-zinc-700";
        if (present.has(d)) cls = "bg-emerald-100 text-emerald-700";
        if (late.has(d)) cls = "bg-amber-100 text-amber-700";
        if (absent.has(d)) cls = "bg-rose-100 text-rose-700";
        return (
          <div key={d} className={`rounded-xl text-xs py-2 text-center ${cls} dark:opacity-90`}>{d}</div>
        );
      })}
    </div>
  );
};

export default function EmployeeDashboard() {
  const [dark, setDark] = useDarkMode();
  const [timerRunning, setTimerRunning] = useState(false);

  return (
<div className="min-h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50 text-zinc-900 dark:text-zinc-50">
      <TopBar dark={dark} setDark={setDark} />

      <div className="mx-auto max-w-[1400px] px-4 lg:px-6 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
         <aside className="hidden lg:block col-span-3 xl:col-span-2">
          <EmployeeLeftSideBar />
        </aside>

        {/* Main */}
        <main className="col-span-12 lg:col-span-9 xl:col-span-10 space-y-6">
          {/* Greeting and quick KPI */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((k, i) => (
              <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <SummaryCard kpi={k} />
              </motion.div>
            ))}
          </div>

          {/* Attendance & Leaves Row */}
          <div className="grid lg:grid-cols-7 gap-6">
            <Card className="lg:col-span-4">
              <CardHeader>
                <SectionHeader icon={Clock} title="Attendance — Last 8 Months" action={<Badge>Trend</Badge>} />
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={attendanceTrend} margin={{ left: -20 }}>
                      <defs>
                        <linearGradient id="present" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <Tooltip />
                      <Area type="monotone" dataKey="present" stroke="#3b82f6" fill="url(#present)" />
                      <Line type="monotone" dataKey="late" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Present days</div>
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-rose-500" /> Late marks</div>
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" /> Overtime</div>
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Remote</div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <SectionHeader icon={Calendar} title="September Calendar" action={<Badge>Quick View</Badge>} />
              </CardHeader>
              <CardContent>
                <CalendarMini />
                <div className="mt-4 flex items-center gap-3 text-xs">
                  <Badge className="bg-emerald-100 text-emerald-700">Present</Badge>
                  <Badge className="bg-amber-100 text-amber-700">Late</Badge>
                  <Badge className="bg-rose-100 text-rose-700">Absent</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks & Performance */}
          <div className="grid xl:grid-cols-7 gap-6">
            <Card className="xl:col-span-4">
              <CardHeader>
                <SectionHeader icon={Layers} title="My Tasks" action={<Button>View All</Button>} />
              </CardHeader>
              <CardContent>
                <Table
                  columns={[
                    { key: "title", label: "Task" },
                    { key: "project", label: "Project" },
                    { key: "priority", label: "Priority" },
                    { key: "due", label: "Due" },
                    { key: "status", label: "Status" },
                  ]}
                  data={tasks.map(t => ({
                    title: (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`w-4 h-4 ${t.status === 'Completed' ? 'text-emerald-500' : 'text-zinc-300'}`} />
                        <span className="font-medium">{t.title}</span>
                      </div>
                    ),
                    project: <Badge>{t.project}</Badge>,
                    priority: <Badge className={`${t.priority === 'High' ? 'bg-rose-100 text-rose-700' : t.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-zinc-100 text-zinc-700'}`}>{t.priority}</Badge>,
                    due: t.due,
                    status: <Badge className={`${t.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : t.status === 'To-do' ? 'bg-zinc-100 text-zinc-700' : 'bg-emerald-100 text-emerald-700'}`}>{t.status}</Badge>,
                  }))}
                />
              </CardContent>
            </Card>

            <Card className="xl:col-span-3">
              <CardHeader>
                <SectionHeader icon={Target} title="Performance Score" action={<Badge>Last 5 months</Badge>} />
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performance} margin={{ left: -20 }}>
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} domain={[60, 100]} />
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">Current score <span className="font-semibold">86</span> — great progress! 🎯</div>
              </CardContent>
            </Card>
          </div>

          {/* Payroll & Documents */}
          <div className="grid xl:grid-cols-7 gap-6">
            <Card className="xl:col-span-3">
              <CardHeader>
                <SectionHeader icon={DollarSign} title="Payroll (Net Salary)" action={<Button><Download className="w-4 h-4" /> Latest Payslip</Button>} />
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={payroll} margin={{ left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="net" radius={[10, 10, 6, 6]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 text-xs text-zinc-500">Figures in PKR</div>
              </CardContent>
            </Card>

            <Card className="xl:col-span-4">
              <CardHeader>
                <SectionHeader icon={FileText} title="Documents" action={<Button><Upload className="w-4 h-4" /> Upload</Button>} />
              </CardHeader>
              <CardContent>
                <Table
                  columns={[
                    { key: "name", label: "Name" },
                    { key: "size", label: "Size" },
                    { key: "uploaded", label: "Uploaded" },
                    { key: "action", label: "" },
                  ]}
                  data={documents.map(d => ({
                    name: (
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-zinc-400" />
                        <span className="font-medium">{d.name}</span>
                      </div>
                    ),
                    size: d.size,
                    uploaded: d.uploaded,
                    action: <Button className="!px-3"><Download className="w-4 h-4" /> Download</Button>,
                  }))}
                />
              </CardContent>
            </Card>
          </div>

          {/* Training & Announcements */}
          <div className="grid xl:grid-cols-7 gap-6">
            <Card className="xl:col-span-4">
              <CardHeader>
                <SectionHeader icon={Briefcase} title="Training & Development" action={<Badge>Learning</Badge>} />
              </CardHeader>
              <CardContent>
                <Table
                  columns={[
                    { key: "title", label: "Title" },
                    { key: "date", label: "Date" },
                    { key: "status", label: "Status" },
                    { key: "action", label: "" },
                  ]}
                  data={training.map(t => ({
                    title: t.title,
                    date: t.date,
                    status: <Badge className={`${t.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{t.status}</Badge>,
                    action: t.status === 'Upcoming' ? <Button className="!px-3">Register</Button> : <Button className="!px-3" >View</Button>,
                  }))}
                />
              </CardContent>
            </Card>

            <Card className="xl:col-span-3">
              <CardHeader>
                <SectionHeader icon={Bell} title="Announcements" action={<Badge>Company</Badge>} />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.map(a => (
                    <div key={a.id} className="rounded-2xl border border-zinc-100 dark:border-zinc-800 p-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition">
                      <div className="text-sm font-medium">{a.title}</div>
                      <div className="text-xs text-zinc-500">{a.date}</div>
                      <div className="text-sm mt-1">{a.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Row */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <SectionHeader icon={Shield} title="Policies" action={<Badge>Handbook</Badge>} />
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-zinc-400" />Leave Policy (2025)</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-zinc-400" />Expense Reimbursement</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-zinc-400" />Code of Conduct</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <SectionHeader icon={MessageSquare} title="Support" action={<Badge>Helpdesk</Badge>} />
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span>Open Tickets</span><Badge>2</Badge></div>
                  <div className="flex items-center justify-between"><span>Avg. Response</span><span className="text-zinc-500">4h 12m</span></div>
                  <Button className="w-full justify-center">Raise Ticket</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <SectionHeader icon={Clock} title="Work Timer" action={<Badge>Today</Badge>} />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="text-4xl font-semibold tabular-nums tracking-tight">07:42:16</div>
                  <div className="ml-auto flex items-center gap-2">
                    <Button onClick={() => setTimerRunning(true)} className="!px-3"><PlayCircle className="w-5 h-5" /> Start</Button>
                    <Button onClick={() => setTimerRunning(false)} className="!px-3"><PauseCircle className="w-5 h-5" /> Pause</Button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-zinc-500">Check-in 9:18 AM · Break 0:30 · Overtime 0:00</div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <footer className="py-8 text-center text-xs text-zinc-500">
        © 2025 Acme HR • Built with React + Tailwind
      </footer>
    </div>
  );
}