import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import axios from "axios";
import { API_URL } from "../../config";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";

export default function VoucherManagement() {
  const [vouchers, setVouchers] = useState([]);
  const [rows, setRows] = useState([]);
  const [dummyVouchers, setDummyVouchers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditOpen, setEditOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [vouchersEdit, setVouchersEdit] = useState({});
  const [categoryAmount, setCategoryAmount] = useState("");
  const [limitVoucherRange, setLimitVoucherRange] = useState("");
  const [winPrizeRange, setWinPrizeRange] = useState("");
  const [minPrizeRange, setMinPrizeRange] = useState("");

  // Fetch vouchers from backend
  const fetchVouchers = async () => {
    try {
      const res = await axios.get(API_URL + "/api/dashboard/getVoucher");
      const voucherList = res.data.voucherList || [];
      setVouchers(voucherList);
      setRows(voucherList);
      setDummyVouchers(voucherList);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // Add voucher
  const addVouchers = async () => {
    try {
      const addVoucherJson = {
        amount: categoryAmount || "500",
        limitVoucher: limitVoucherRange,
        winPrizeRange: winPrizeRange,
        minPrizeRange: minPrizeRange,
      };
      const res = await axios.post(API_URL + "/api/dashboard/addVoucher", addVoucherJson, {
        headers: { "Content-Type": "application/json" },
      });
      fetchVouchers();
      alert(res.data.message);
    } catch (err) {
      console.error("Error adding voucher:", err);
      alert("Voucher Add Failed!");
    }
  };

  // Update voucher
  const UpdateVouchers = async (voucherId) => {
    try {
      const updateData = { voucherId, winamount: vouchersEdit.winAmount };
      const res = await axios.post(API_URL + "/api/dashboard/updateVoucher", updateData, {
        headers: { "Content-Type": "application/json" },
      });
      fetchVouchers();
      alert(res.data.message);
    } catch (err) {
      console.error("Error updating vouchers:", err);
      alert("Voucher Update Failed!");
    }
  };

  // Delete voucher
  const handleDelete = async (voucherId) => {
    try {
      if (!window.confirm("Are you sure you want to delete this Banner Image?")) return;
      const res = await axios.post(
        API_URL + "/api/dashboard/deleteVoucher",
        { voucherId },
        { headers: { "Content-Type": "application/json" } }
      );
      fetchVouchers();
      alert(res.data.message);
    } catch (err) {
      console.error("Error deleting vouchers:", err);
      alert("Voucher Delete Failed!");
    }
  };

  // Handle search/filter
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setRows(dummyVouchers);
      return;
    }
    const filtered = vouchers.filter(
      (v) => v.categoryAmount?.toString().toLowerCase() === query.toLowerCase()
    );
    setRows(filtered);
  };

  // Columns for DataTable
  const columns = [
    { Header: "Position", accessor: "position" },
    { Header: "VoucherId", accessor: "voucherId" },
    { Header: "Category", accessor: "categoryAmount" },
    { Header: "WinAmount", accessor: "winAmount" },
    { Header: "CreatedAt", accessor: "createdAt" },
    {
      Header: "Actions",
      accessor: "action",
      Cell: ({ row }) => (
        <MDBox display="flex" gap={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setVouchersEdit(row.original);
              setEditOpen(true);
            }}
            sx={{ color: "#fff" }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="error"
            sx={{ color: "red", borderColor: "red" }}
            onClick={() => handleDelete(row.original._id)}
          >
            Delete
          </Button>
        </MDBox>
      ),
    },
  ];

  // Compute category counts based on current rows
  const categoryCounts = rows.reduce((acc, voucher) => {
    const key = voucher.categoryAmount || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Voucher Management
                </MDTypography>
              </MDBox>

              <MDBox display="flex" justifyContent="flex-end" alignItems="center" p={2} gap={2}>
                <Button variant="contained" onClick={() => setAddOpen(true)} sx={{ color: "#fff" }}>
                  Add Voucher
                </Button>

                <TextField
                  size="small"
                  placeholder="Search by category..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </MDBox>

              {/* Display category counts as cards */}
              <MDBox px={2} py={1} display="flex" gap={2} flexWrap="wrap">
                {Object.entries(categoryCounts).map(([category, count]) => (
                  <Grid item xs={12} md={6} lg={3} key={category}>
                    <ComplexStatisticsCard
                      icon="loyalty"
                      title={category + " Category"}
                      count={count}
                    />
                  </Grid>
                ))}
              </MDBox>

              <MDBox pt={3}>
                <DataTable table={{ columns, rows }} isSorted entriesPerPage showTotalEntries />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Voucher</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
          <TextField
            label="Category Amount"
            value={vouchersEdit.categoryAmount || ""}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Win Amount"
            value={vouchersEdit.winAmount || ""}
            onChange={(e) => setVouchersEdit({ ...vouchersEdit, winAmount: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ color: "#fff" }}
            onClick={() => UpdateVouchers(vouchersEdit._id)}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Voucher</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
          <MDBox mt={2}>
            <label>
              <strong>Category Amount</strong>
            </label>
            <select
              value={categoryAmount}
              onChange={(e) => setCategoryAmount(e.target.value)}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ddd",
                marginTop: 5,
              }}
            >
              <option value="1000">1000</option>
              <option value="500">500</option>
              <option value="100">100</option>
              <option value="50">50</option>
              <option value="10">10</option>
            </select>
          </MDBox>
          <TextField
            label="LimitRange Voucher"
            value={limitVoucherRange}
            onChange={(e) => setLimitVoucherRange(e.target.value)}
            fullWidth
          />
          <TextField
            label="Max Prize Range"
            value={winPrizeRange}
            onChange={(e) => setWinPrizeRange(e.target.value)}
            fullWidth
          />

          <TextField
            label="Min Prize Range"
            value={minPrizeRange}
            onChange={(e) => setMinPrizeRange(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ color: "#fff" }} onClick={addVouchers}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Footer />
    </DashboardLayout>
  );
}
