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

function UserNamePaymentHistoryV2() {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/dashboard/userPaymentHistorty`, {});
      if (res.data.success) {
        setPayments(res.data.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Define columns
  const columns = [
    { Header: "userId", accessor: "userId" },
    {
      Header: "name",
      accessor: "name",
    },
    { Header: "email", accessor: "email" },
    { Header: "walletAmount", accessor: "walletAmount" },
    { Header: "totalWinningAmount", accessor: "totalWinningAmount" },
    { Header: "rechargeSuccess", accessor: "rechargeSuccess" },
    { Header: "rechargeFailed", accessor: "rechargeFailed" },
    { Header: "withdrawalSuccess", accessor: "withdrawalSuccess" },
    { Header: "withdrawalFailed", accessor: "withdrawalFailed" },
  ];

  // Map rows with unique id
  const rows = payments.map((p, index) => ({ id: index + 1, ...p }));

  return (
    <DashboardLayout>
      <DashboardNavbar />

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

export default UserNamePaymentHistoryV2;
