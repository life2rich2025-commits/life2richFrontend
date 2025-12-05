import { useState } from "react";

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

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function CreateNotification() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [openSB, setOpenSB] = useState(false);

  const handleSubmit = () => {
    if (!title || !message) {
      alert("Please enter title and message!");
      return;
    }
    setOpenSB(true);
  };

  const closeSB = () => setOpenSB(false);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox mt={6} mb={3}>
        <Grid container justifyContent="center">
          <Grid item xs={12} lg={6}>
            <Card style={{ padding: 20 }}>
              <MDTypography variant="h5" mb={2}>
                Create Notification
              </MDTypography>

              <MDBox mb={2}>
                <TextField
                  label="Notification Title"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </MDBox>

              <MDBox mb={4}>
                <TextField
                  label="Notification Message"
                  fullWidth
                  multiline
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </MDBox>

              {/* Styled Dropdown */}
              {/* <MDBox mb={4}>
                <FormControl fullWidth>
                  <InputLabel>Notification Type</InputLabel>
                  <Select
                    value={type}
                    label="Notification Type"
                    onChange={(e) => setType(e.target.value)}
                  >
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                    <MenuItem value="warning">Warning</MenuItem>
                    <MenuItem value="error">Error</MenuItem>
                  </Select>
                </FormControl>
              </MDBox> */}

              <MDButton variant="gradient" color="info" fullWidth onClick={handleSubmit}>
                Submit Notification
              </MDButton>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* <MDSnackbar
        open={openSB}
        onClose={closeSB}
        close={closeSB}
        color={type}
        title={title || "Notification"}
        content={message || "Message content"}
        dateTime="Just Now"
        icon={type === "success" ? "check" : type === "error" ? "warning" : "notifications"}
      /> */}

      <Footer />
    </DashboardLayout>
  );
}

export default CreateNotification;
