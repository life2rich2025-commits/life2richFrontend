import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
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
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ id: "", title: "", amount: "", imageUrl: "" });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    // mock data — replace with API call
    setVouchers([
      {
        id: "1",
        title: "New Year Offer",
        amount: "50",
        imageUrl: "https://via.placeholder.com/80",
      },
      {
        id: "2",
        title: "Festive Bonus",
        amount: "100",
        imageUrl: "https://via.placeholder.com/80",
      },
    ]);
  }, []);

  const columns = [
    { Header: "ID", accessor: "id" },
    { Header: "Title", accessor: "title" },
    { Header: "Amount", accessor: "amount" },
    {
      Header: "Image",
      accessor: "imageUrl",
      Cell: ({ value }) => <img src={value} width={50} alt="voucher" />,
    },
    {
      Header: "Actions",
      accessor: "action",
      Cell: ({ row }) => (
        <MDBox display="flex" gap={1}>
          <Button variant="contained" size="small" onClick={() => handleEdit(row.original)}>
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(row.original.id)}
          >
            Delete
          </Button>
        </MDBox>
      ),
    },
  ];

  const handleOpen = () => {
    setOpen(true);
    setIsEdit(false);
    setFormData({ id: "", title: "", amount: "", imageUrl: "" });
  };

  const handleEdit = (voucher) => {
    setIsEdit(true);
    setFormData(voucher);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setVouchers(vouchers.filter((v) => v.id !== id));
  };

  const handleSave = () => {
    if (isEdit) {
      setVouchers(vouchers.map((v) => (v.id === formData.id ? formData : v)));
    } else {
      setVouchers([...vouchers, { ...formData, id: Date.now().toString() }]);
    }
    setOpen(false);
  };

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
                <Button variant="contained" onClick={handleOpen}>
                  Add Voucher
                </Button>
              </MDBox>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows: vouchers }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEdit ? "Edit Voucher" : "Add Voucher"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 400 }}>
          <TextField
            label="Title"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            label="Amount"
            fullWidth
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
          <TextField
            label="Image URL"
            fullWidth
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}
