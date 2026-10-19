import React from "react";
import "./dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", amount: 2400 },
  { month: "Feb", amount: 1400 },
  { month: "Mar", amount: 2000 },
  { month: "Apr", amount: 1500 },
  { month: "May", amount: 500 },
  { month: "Jun", amount: 4000 },
  { month: "Jul", amount: 3000 },
  { month: "Aug", amount: 2300 },
  { month: "Sep", amount: 1000 },
  { month: "Oct", amount: 2000 },
  { month: "Nov", amount: 2900 },
  { month: "Dec", amount: 2400 },
];

function Dashboard() {
  return (
    <>
      <div className="dashboard">
        <div className="dash-top">
          <div className="sales">
            <div className="day-sales">
              <h1>Your sales today</h1>
              <p id="amount">
                <sup>Ksh. </sup>1000.00
              </p>
            </div>
            <div className="month-sales">
              <span className="material-symbols-outlined" id="month-icon">
                finance
              </span>
              <span className="monthly-words">
                <p id="amount">
                  <sup>Ksh.</sup>1000.00
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
                    <p id="size">4</p>
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
                    <p id="size">9</p>
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
                    <p id="size">60</p>
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
                    <p id="size">100</p>
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
              <BarChart data={data} margin={{ top: 5, right: 30, left: 0 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020202",
                    border: "none",
                    outline: "none",
                    color: "#fff",
                    borderRadius: "8px",
                  }}
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
