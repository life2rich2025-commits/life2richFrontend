import { useEffect, useState } from "react";
import axios from "axios";

// MUI
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";

// MD
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { API_URL } from "../../config";

function PaymentHistoryV2() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    method: "",
    search: "",
  });

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/payment/getAllPayment`, {});
      const data = res.data.getAllPaymentHistory;
      setPayments(data);
      setFilteredPayments(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const stats = {
    total: payments.length,
    success: payments.filter((p) => p.status === "success").length,
    pending: payments.filter((p) => p.status === "pending").length,
    failed: payments.filter((p) => p.status === "failed").length,
  };

  const filter = async () => {
    let data = [...payments];

    // 🔍 Search (UTR / Username)
    if (filters.search) {
      const search = filters.search.toLowerCase();
      data = data.filter(
        (p) =>
          p.utrNumber?.toLowerCase().includes(search) ||
          p.userId?.userName?.toLowerCase().includes(search)
      );
    }

    // 📌 Status filter
    if (filters.status) {
      data = data.filter((p) => p.status === filters.status);
    }

    // 💳 Method filter
    if (filters.method) {
      data = data.filter((p) => p.method === filters.method);
    }

    setPayments(data);
  };

  // Define columns
  const columns = [
    { Header: "ID", accessor: "orderId" },
    {
      Header: "Date",
      accessor: "createdAt",
      Cell: ({ value }) => {
        // Convert ISO string to a readable format
        return new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        // Example output: 19 Dec 2025
      },
    },
    { Header: "UserName", accessor: "userId.userName" },
    { Header: "Email", accessor: "userId.email" },
    { Header: "PhoneNumber", accessor: "userId.phoneNumber" },
    { Header: "Payment Method", accessor: "method" },
    { Header: "UTR Number", accessor: "utrNumber" },
    { Header: "Amount", accessor: "amount" },
    { Header: "Status", accessor: "status" },
    { Header: "PaymentStatus", accessor: "Description" },
  ];

  // Map rows with unique id
  const rows = payments.map((p, index) => ({ id: index + 1, ...p }));

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox mt={4} mb={3}>
        {/* 🔹 Stats Cards */}
        <Grid container spacing={3}>
          {[
            { label: "Total Payments", value: stats.total, color: "info" },
            { label: "Success", value: stats.success, color: "success" },
            { label: "Pending", value: stats.pending, color: "warning" },
            { label: "Failed", value: stats.failed, color: "error" },
          ].map((item) => (
            <Grid item xs={12} md={3} key={item.label}>
              <Card>
                <MDBox p={3} textAlign="center">
                  <MDTypography variant="h6">{item.label}</MDTypography>
                  <MDTypography variant="h4" color={item.color} fontWeight="bold">
                    {item.value}
                  </MDTypography>
                </MDBox>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>

      {/* 🔹 Filters */}
      <MDBox mb={3}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                label="Search UTR / Username"
                fullWidth
                size="small"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <select
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
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </Grid>

            <Grid item xs={12} md={3}>
              <select
                value={filters.method}
                onChange={(e) => setFilters({ ...filters, method: e.target.value })}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  marginTop: 5,
                }}
              >
                <option value="">All Methods</option>
                <option value="GPay">GPay</option>
                <option value="PhonePe">PhonePe</option>
                <option value="Paytm">Paytm</option>
              </select>
            </Grid>

            <Grid item xs={12} md={2}>
              <MDButton
                color="info"
                variant="gradient"
                fullWidth
                sx={{ height: 40 }}
                onClick={filter}
              >
                Filter
              </MDButton>
            </Grid>
          </Grid>
        </Card>
      </MDBox>

      {/* 🔹 Payment Table */}
      <Card sx={{ mt: 2 }}>
        <MDBox pt={3}>
          <DataTable table={{ columns, rows }} isSorted entriesPerPage showTotalEntries />
        </MDBox>
      </Card>

      <Footer />
    </DashboardLayout>
  );
}

export default PaymentHistoryV2;
