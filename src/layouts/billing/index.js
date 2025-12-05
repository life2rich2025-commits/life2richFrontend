import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Button } from "@mui/material";

export default function BillingApproval() {
  const [requests, setRequests] = useState([
    {
      id: "1",
      user: "John Doe",
      amount: "2500",
      description: "Monthly salary release",
      status: "Pending",
    },
    {
      id: "2",
      user: "Priya Sharma",
      amount: "1200",
      description: "Freelance design payout",
      status: "Pending",
    },
  ]);

  const handleAction = (id, action) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: action === "approve" ? "Approved" : "Rejected" } : req
      )
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox mt={8}>
        <MDBox mb={3}>
          <Grid container spacing={3}>
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
                    Billing Approval Dashboard
                  </MDTypography>
                </MDBox>

                <MDBox p={3}>
                  {requests.map((req) => (
                    <Card key={req.id} style={{ padding: 16, marginBottom: 20 }}>
                      <MDTypography variant="h6">{req.user}</MDTypography>
                      <MDTypography variant="body2" color="text">
                        {req.description}
                      </MDTypography>
                      <MDTypography variant="body1" sx={{ mt: 1 }}>
                        Amount: ₹{req.amount}
                      </MDTypography>
                      <MDTypography variant="body1" sx={{ mt: 1 }}>
                        Status: {req.status}
                      </MDTypography>

                      {req.status === "Pending" && (
                        <MDBox display="flex" gap={2} mt={2}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleAction(req.id, "approve")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleAction(req.id, "reject")}
                          >
                            Reject
                          </Button>
                        </MDBox>
                      )}
                    </Card>
                  ))}
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
