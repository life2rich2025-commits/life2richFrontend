import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Chip from "@mui/material/Chip";
import PropTypes from "prop-types";
import DataTable from "examples/Tables/DataTable";

// Material Dashboard Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios";
import { API_URL } from "../../config";

// ------------------ Action Cell Component ------------------
function ActionCell({ row, toggleStatus, deleteUPI }) {
  return (
    <MDBox display="flex" gap={1}>
      <Switch
        checked={row.original.status}
        onChange={() => toggleStatus(row.original.id)}
        color="info"
      />
      <MDButton
        variant="outlined"
        color="error"
        size="small"
        onClick={() => deleteUPI(row.original.id)}
      >
        Delete
      </MDButton>
    </MDBox>
  );
}

// Add prop types to ActionCell
ActionCell.propTypes = {
  row: PropTypes.shape({
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
      status: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
  toggleStatus: PropTypes.func.isRequired,
  deleteUPI: PropTypes.func.isRequired,
};

// ------------------ Main Component ------------------
function CompanyUPI() {
  const [title, setTitle] = useState("");
  const [upiId, setUpiId] = useState("");
  const [status, setStatus] = useState(true);
  const [upiList, setUpiList] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedList = localStorage.getItem("upiList");
    if (savedList) setUpiList(JSON.parse(savedList));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("upiList", JSON.stringify(upiList));
  }, [upiList]);

  // Validate UPI
  const isValidUpi = (id) => /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(id);

  // Add new UPI
  // const handleSubmit = () => {
  //   if (!title || !upiId) {
  //     alert("Please enter Payment Type and UPI ID!");
  //     return;
  //   }
  //   if (!isValidUpi(upiId)) {
  //     alert("Invalid UPI format! Use example@upi");
  //     return;
  //   }

  //   const newItem = { id: Date.now(), title, upiId, status };
  //   setUpiList([...upiList, newItem]);
  //   setTitle("");
  //   setUpiId("");
  //   setStatus(true);
  // };

  useEffect(() => {
    const fetchUPI = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dashboard/getupi`);
        const formatted = res.data.response.map((item) => ({
          id: item._id,
          title: item.paymentType,
          upiId: item.upiid,
          status: item.status,
        }));
        setUpiList(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUPI();
  }, []);

  // Toggle status
  const toggleStatus = (id) => {
    setUpiList(upiList.map((item) => (item.id === id ? { ...item, status: !item.status } : item)));
  };

  // Delete UPI
  const deleteUPI = (id) => {
    setUpiList(upiList.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    if (!title || !upiId) {
      alert("Please enter Payment Type and UPI ID!");
      return;
    }

    if (!isValidUpi(upiId)) {
      alert("Invalid UPI format! Use example@upi");
      return;
    }

    try {
      const payload = {
        paymentType: title, // gpay, phonepe, etc
        upiid: upiId,
        bussinessname: "Liferich", // or dynamic
        status: status,
      };

      const res = await axios.post(`${API_URL}/api/dashboard/addupi`, payload);

      if (res.data?.response) {
        const newItem = {
          id: res.data.response._id,
          title: res.data.response.paymentType,
          upiId: res.data.response.upiid,
          status: res.data.response.status,
        };

        setUpiList((prev) => [...prev, newItem]);

        setTitle("");
        setUpiId("");
        setStatus(true);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add UPI");
    }
  };

  // DataTable columns
  const columns = [
    { Header: "Payment Type", accessor: "title" },
    { Header: "UPI ID", accessor: "upiId" },
    {
      Header: "Status",
      accessor: "status",
      // eslint-disable-next-line react/prop-types
      Cell: ({ row }) => (
        <Chip
          // eslint-disable-next-line react/prop-types
          label={row.original.status ? "Active" : "Inactive"}
          // eslint-disable-next-line react/prop-types
          color={row.original.status ? "success" : "error"}
          size="small"
        />
      ),
    },
    {
      Header: "Actions",
      accessor: "actions",
      // eslint-disable-next-line react/prop-types
      Cell: ({ row }) => <ActionCell row={row} toggleStatus={toggleStatus} deleteUPI={deleteUPI} />,
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* Form */}
      <MDBox mt={6} mb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={6}>
            <Card style={{ padding: 20 }}>
              <MDTypography variant="h5" mb={2}>
                Create UPI
              </MDTypography>

              <MDBox mb={2}>
                <TextField
                  label="Payment Type"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </MDBox>

              <MDBox mb={2}>
                <TextField
                  label="UPI ID"
                  fullWidth
                  placeholder="example@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </MDBox>

              <MDBox mb={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={status}
                      onChange={(e) => setStatus(e.target.checked)}
                      color="success"
                    />
                  }
                  label={status ? "Active" : "Inactive"}
                />
              </MDBox>

              <MDButton variant="gradient" color="info" fullWidth onClick={handleSubmit}>
                Add UPI
              </MDButton>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* DataTable */}
      <MDBox pt={3}>
        <DataTable table={{ columns, rows: upiList }} isSorted entriesPerPage showTotalEntries />
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

export default CompanyUPI;
