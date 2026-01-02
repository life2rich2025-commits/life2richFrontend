import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

// Material Dashboard Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

import axios from "axios";
import { API_URL } from "../../config";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function CreateNotification() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targets, setTargets] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [openSB, setOpenSB] = useState(false);

  // 🔹 Load dropdown data
  useEffect(() => {
    fetchTargets();
  }, []);

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

  // 🔹 Submit Notification
  const handleSubmit = async () => {
    try {
      if (!title || !message || !selectedTarget) {
        alert("Please fill all fields!");
        return;
      }

      const res = await axios.post(`${API_URL}/api/notification/send`, {
        title,
        body: message,
        userId: selectedTarget == "ALL" ? "" : selectedTarget,
      });

      if (res.data.success) {
        setTitle("");
        setMessage("");
        setSelectedTarget("");
        setOpenSB(true);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to send Notification");
    }
  };

  const closeSB = () => setOpenSB(false);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox mt={6} mb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={12}>
            <Card sx={{ p: 3 }}>
              <MDTypography variant="h5" mb={2}>
                Create Notification
              </MDTypography>

              {/* Dropdown */}
              <MDBox mb={2}>
                <FormControl fullWidth>
                  <InputLabel id="target-label">Send To</InputLabel>
                  <Select
                    labelId="target-label"
                    label="Send To"
                    value={selectedTarget}
                    sx={{ height: 45 }}
                    onChange={(e) => setSelectedTarget(e.target.value)}
                  >
                    <MenuItem value={"ALL"}>{"ALL"}</MenuItem>
                    {targets.map((item) => (
                      <MenuItem key={item._id} value={item._id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MDBox>

              {/* Title */}
              <MDBox mb={2}>
                <TextField
                  label="Notification Title"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </MDBox>

              {/* Message */}
              <MDBox mb={2}>
                <TextField
                  label="Notification Message"
                  fullWidth
                  multiline
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </MDBox>

              <MDButton variant="gradient" color="info" fullWidth onClick={handleSubmit}>
                Submit Notification
              </MDButton>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />

      {/* Snackbar */}
      <MDSnackbar
        open={openSB}
        color="success"
        icon="check"
        title="Success"
        content="Notification sent successfully"
        close={closeSB}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      />
    </DashboardLayout>
  );
}

export default CreateNotification;
