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
  const [isEditOpen, setEditOpen] = useState(false);
  const [isAddOpen, setAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    amount: "",
    imageUrl: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [vouchersEdit, setVouchersEdit] = useState({});
  const [categoryAmount, setCategoryAmount] = useState("");
  const [limitVoucherRange, setLimitVoucherRange] = useState("");
  const [winPrizeRange, setWinPrizeRange] = useState("");
  const [winPrizeAmount, setWinPrizeAmount] = useState("");

  const handleOpen = () => {
    setIsEdit(false);
    setFormData({ id: "", title: "", amount: "", imageUrl: "" });
    setAddOpen(true);
  };

  const handleEdit = (voucher) => {
    console.log(voucher);
    setIsEdit(true);
    setVouchersEdit(voucher);
    setEditOpen(true);
  };

  const UpdateVouchers = async (voucherId) => {
    try {
      const addVoucherJson = {
        voucherId: voucherId,
        winamount: vouchersEdit.winAmount,
      };

      console.log(addVoucherJson);

      const res = await axios.post(API_URL + "/api/dashboard/updateVoucher", addVoucherJson, {
        headers: { "Content-Type": "application/json" },
      });
      fetchVouchers();
      alert(res.data.message);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
      alert("Voucher Add Failed!");
    }
  };

  const handleDelete = async (voucherId) => {
    try {
      const deleteVoucherJson = {
        voucherId: voucherId,
      };

      const res = await axios.post(API_URL + "/api/dashboard/deleteVoucher", deleteVoucherJson, {
        headers: { "Content-Type": "application/json" },
      });
      fetchVouchers();
      alert(res.data.message);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
      alert("Voucher Add Failed!");
    }
  };

  const fetchVouchers = async () => {
    try {
      const res = await axios.get(API_URL + "/api/dashboard/getVoucher");
      setVouchers(res.data.voucherList); // assuming backend returns array
    } catch (err) {
      console.error("Error fetching vouchers:", err);
    }
  };

  const addVouchers = async () => {
    try {
      const addVoucherJson = {
        amount: categoryAmount || "500",
        limitVoucher: limitVoucherRange,
        winPrizeRange: winPrizeRange,
      };
      const res = await axios.post(API_URL + "/api/dashboard/addVoucher", addVoucherJson, {
        headers: { "Content-Type": "application/json" },
      });
      fetchVouchers();
      alert(res.data.message);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
      alert("Voucher Add Failed!");
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleEditSave = (voucher) => {
    console.log(voucher);
    setEditOpen(false);
    UpdateVouchers(voucher._id);
    fetchVouchers();
  };

  const handleSave = () => {
    setAddOpen(false);
    addVouchers();
  };

  const columns = [
    { Header: "Position", accessor: "position" },
    { Header: "VoucherId", accessor: "voucherId" },
    { Header: "Category", accessor: "categoryAmount" },
    { Header: "WinAmount", accessor: "winAmount" },
    { Header: "createdAt", accessor: "createdAt" },
    {
      Header: "Actions",
      accessor: "action",
      Cell: ({ row }) => (
        <MDBox display="flex" gap={1}>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleEdit(row.original)}
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

  const rows = vouchers;

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

              <MDBox display="flex" justifyContent="flex-end" p={2}>
                <Button variant="contained" onClick={handleOpen} sx={{ color: "#fff" }}>
                  Add Voucher
                </Button>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={true}
                  entriesPerPage={true}
                  showTotalEntries={true}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Add / Edit Dialog */}
      <Dialog open={isEditOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>{"Edit Voucher"}</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 400,
          }}
        >
          <TextField
            label="Category Amount"
            value={vouchersEdit.categoryAmount}
            InputProps={{ readOnly: true }}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            fullWidth
          />

          <TextField
            label="Win Amount"
            value={vouchersEdit.winAmount}
            onChange={(e) => {
              setVouchersEdit({
                ...vouchersEdit,
                winAmount: e.target.value,
              });
            }}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            sx={{ color: "#fff" }}
            onClick={() => handleEditSave(vouchersEdit)}
          >
            {"Update"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>{"Add Voucher"}</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 400,
          }}
        >
          <MDBox mt={2}>
            <label>
              <strong>CategoryAmount</strong>
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
            label="Win Prize Range"
            value={winPrizeRange}
            onChange={(e) => setWinPrizeRange(e.target.value)}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ color: "#fff" }} onClick={handleSave}>
            {"Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}
