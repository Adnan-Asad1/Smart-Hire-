import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import HRLeftSideBar from "./HRLeftSideBar";

const GetAllEmployees = () => {
  const [userName, setUserName] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.fullName);
    }

    fetch("http://localhost:5000/api/employees/getEmployees")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Data:", data);
        setEmployees(data.employees);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50">
      {/* Sidebar */}
     <HRLeftSideBar/>

      {/* Main Content */}
      <div className="flex-1 px-10 py-8  ml-64 p-6">
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
            Welcome Back, {userName || "Guest"} 👋
          </h2>
          <p className="text-gray-500 text-md font-medium">
            Here is the list of all registered employees
          </p>
        </div>

        {/* Employees Table */}
        <div className="bg-white shadow-2xl rounded-2xl p-6 border border-gray-200">
  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
    <FaUsers className="text-blue-600" /> All Employees
  </h3>

  <div className="overflow-x-auto">
    <table className="w-full border-separate border-spacing-y-3">
      <thead>
        <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md">
          <th className="p-4 text-left rounded-l-xl">Name</th>
          <th className="p-4 text-left">Email</th>
          <th className="p-4 text-left">Designation</th>
          <th className="p-4 text-left">Experience</th>
          <th className="p-4 text-left rounded-r-xl">Skills</th>
        </tr>
      </thead>
      <tbody>
        {employees.length > 0 ? (
          employees.map((emp) => (
            <tr
              key={emp._id}
              className="bg-white hover:bg-blue-50 transition-all shadow-sm hover:shadow-lg cursor-pointer rounded-xl"
            >
              <td className="p-4 font-semibold text-gray-900">{emp.name}</td>
              <td className="p-4 text-gray-600">{emp.email}</td>
              <td className="p-4">
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 font-medium shadow-sm">
                  {emp.designation}
                </span>
              </td>
              <td className="p-4 text-gray-700 font-medium">
                {emp.experience} 
              </td>
              <td className="p-4">
                <div className="flex flex-wrap gap-2">
                  {emp.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan="5"
              className="p-6 text-center text-gray-500 italic"
            >
              No employees found 🚫
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
      </div>
    </div>
  );
};

export default GetAllEmployees;
