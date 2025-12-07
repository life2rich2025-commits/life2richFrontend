import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Button } from "@mui/material";
import axios from "axios";
import { API_URL } from "../../config";

export default function BillingApproval() {
  const [billInfoList, setBilingInfoList] = useState([]);

  const handleAction = async (id, action) => {
    try {
      const billInfoJson = {
        paymentId: id,
        status: action,
      };

      console.log(billInfoJson);
      const res = await axios.post(API_URL + "/api/dashboard/updateBillingStatus", billInfoJson, {
        headers: { "Content-Type": "application/json" },
      });
      fetchBillInfo();
      alert(res.data.message);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
      alert("Voucher Add Failed!");
    }
  };

  useEffect(() => {
    fetchBillInfo();
  }, []);

  const fetchBillInfo = async () => {
    try {
      const res = await axios.get(API_URL + "/api/dashboard/getBillingInFo");
      console.log(res.data); // assuming backend returns array
      setBilingInfoList(res.data.billInfoList);
    } catch (err) {
      console.error("Error fetching vouchers:", err);
    }
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
                  {billInfoList.map((req) => (
                    <Card key={req.id} style={{ padding: 16, marginBottom: 20 }}>
                      <MDTypography variant="h6">
                        {req.userId?.userName || "Unknown User"}
                      </MDTypography>
                      <MDTypography variant="body2" color="text">
                        {req.Description}
                      </MDTypography>
                      <MDTypography variant="body1" sx={{ mt: 1 }}>
                        Amount: ₹{req.amount}
                      </MDTypography>
                      <MDTypography variant="body1" sx={{ mt: 1 }}>
                        Status: {req.status}
                      </MDTypography>

                      {req.status === "pending" && (
                        <MDBox display="flex" gap={2} mt={2}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleAction(req._id, "success")}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleAction(req._id, "failed")}
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
