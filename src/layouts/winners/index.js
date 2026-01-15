import { useEffect, useState } from "react";
import axios from "axios";

// MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

// MD
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { API_URL } from "../../config";

function WinnerPaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [targets, setTargets] = useState([]);

  // 🔹 Filters state
  const [filters, setFilters] = useState({
    userId: "",
    voucherId: "",
    status: "",
    fromDate: "",
    toDate: "",
    minWinAmount: "",
    maxWinAmount: "",
  });

  const fetchTargets = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/getUserDetails`);
      console.log("res" + res);
      if (res.data.success) {
        setTargets(res.data.user);
      }
    } catch (error) {
      console.error("Failed to load targets", error);
    }
  };

  const fetchPayments = async (params = {}) => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/getWinnerList`, { params });

      if (res.data.success) {
        setPayments(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTargets();
    fetchPayments();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    const selectedUser = targets.find((u) => u._id === e.target.value);
    setFilters({
      ...filters,
      userId: selectedUser?._id || "",
    });
  };

  // 🔹 Apply Filters
  const applyFilters = () => {
    fetchPayments(filters);
  };

  // 🔹 Reset Filters
  const resetFilters = () => {
    const emptyFilters = {
      userId: "",
      voucherId: "",
      status: "",
      fromDate: "",
      toDate: "",
      minWinAmount: "",
      maxWinAmount: "",
    };
    setFilters(emptyFilters);
    fetchPayments();
  };

  // Columns
  const columns = [
    { Header: "User ID", accessor: "user._id" },
    { Header: "Name", accessor: "user.name" },
    { Header: "Email", accessor: "user.email" },
    { Header: "Date Time", accessor: "createdAt" },
    { Header: "Voucher Category", accessor: "voucher.categoryAmount" },
    { Header: "Winner Amount", accessor: "winnerAmount" },
  ];

  const rows = payments.map((p, index) => ({ id: index + 1, ...p }));

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* 🔹 FILTER CARD */}
      <Card sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <select
              label="User Name"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ddd",
                marginTop: 5,
              }}
            >
              <option value="">All User</option>
              {targets.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.userName})
                </option>
              ))}
            </select>
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              type="date"
              label="From Date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              type="date"
              label="To Date"
              name="toDate"
              value={filters.toDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              type="number"
              label="Min Win Amount"
              name="minWinAmount"
              value={filters.minWinAmount}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              type="number"
              label="Max Win Amount"
              name="maxWinAmount"
              value={filters.maxWinAmount}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3} display="flex" alignItems="center" gap={2}>
            <MDButton color="info" onClick={applyFilters}>
              Apply
            </MDButton>
            <MDButton color="secondary" onClick={resetFilters}>
              Reset
            </MDButton>
          </Grid>
        </Grid>
      </Card>

      {/* 🔹 TABLE */}
      <Card sx={{ mt: 3 }}>
        <MDBox pt={3}>
          <DataTable table={{ columns, rows }} isSorted entriesPerPage showTotalEntries />
        </MDBox>
      </Card>

      <Footer />
    </DashboardLayout>
  );
}

export default WinnerPaymentHistory;
