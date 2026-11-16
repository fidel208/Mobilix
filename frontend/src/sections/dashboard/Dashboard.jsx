import React, { useEffect, useState } from "react";
import "./dashboard.css";
import API from "../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const defaultMonthlyData = [
  { month: "Jan", amount: 0 },
  { month: "Feb", amount: 0 },
  { month: "Mar", amount: 0 },
  { month: "Apr", amount: 0 },
  { month: "May", amount: 0 },
  { month: "Jun", amount: 0 },
  { month: "Jul", amount: 0 },
  { month: "Aug", amount: 0 },
  { month: "Sep", amount: 0 },
  { month: "Oct", amount: 0 },
  { month: "Nov", amount: 0 },
  { month: "Dec", amount: 0 },
];

function Dashboard() {
  const [stats, setStats] = useState({
    todaySales: 0,
    monthSales: 0,
    servicesCount: 0,
    routesCount: 0,
    ticketsCount: 0,
    communityCount: 0,
    yearlyData: defaultMonthlyData,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/dashboard/stats");
        if (response.data?.stats) {
          setStats(response.data.stats);
        }
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="dashboard">
        <div className="dash-top">
          <div className="sales">
            <div className="day-sales">
              <h1>Your sales today</h1>
              <p id="amount">
                <sup>Ksh. </sup>
                {Number(stats.todaySales || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="month-sales">
              <span className="material-symbols-outlined" id="month-icon">
                finance
              </span>
              <span className="monthly-words">
                <p id="amount">
                  <sup>Ksh.</sup>
                  {Number(stats.monthSales || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <h1>Monthly sales</h1>
              </span>
            </div>
          </div>
          <div className="counts">
            <div className="counts-left">
              <div className="small-cont">
                <span>
                  <div className="span-num">
                    <p id="size">{stats.servicesCount}</p>
                    <p>Services</p>
                  </div>
                  <span className="material-symbols-outlined" id="span-icon">
                    handyman
                  </span>
                </span>
              </div>
              <div className="small-cont">
                <span>
                  <div className="span-num">
                    <p id="size">{stats.routesCount}</p>
                    <p>Routes</p>
                  </div>
                  <span className="material-symbols-outlined" id="span-icon">
                    alt_route
                  </span>
                </span>
              </div>
            </div>
            <div className="counts-right">
              <div className="small-cont">
                <span>
                  <div className="span-num">
                    <p id="size">{stats.ticketsCount}</p>
                    <p>Tickets sold</p>
                  </div>
                  <span className="material-symbols-outlined" id="span-icon">
                    local_activity
                  </span>
                </span>
              </div>
              <div className="small-cont">
                <span>
                  <div className="span-num">
                    <p id="size">{stats.communityCount}</p>
                    <p>Community</p>
                  </div>
                  <span className="material-symbols-outlined" id="span-icon">
                    groups
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="dash-graph">
          <div className="graph">
            <p>Yearly sales</p>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.yearlyData || defaultMonthlyData}
                margin={{ top: 5, right: 30, left: 0 }}
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020202",
                    border: "none",
                    outline: "none",
                    color: "#fff",
                    borderRadius: "12px",
                  }}
                  formatter={(value) => [`Ksh. ${Number(value).toLocaleString()}`, "Amount"]}
                />
                <Legend iconType="circle" />
                <Bar
                  dataKey="amount"
                  name="Amount"
                  fill="rgb(10, 99, 72)"
                  opacity="0.7"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
