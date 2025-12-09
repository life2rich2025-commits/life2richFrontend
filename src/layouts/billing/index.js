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

      const res = await axios.post(API_URL + "/api/dashboard/updateBillingStatus", billInfoJson, {
        headers: { "Content-Type": "application/json" },
      });
      fetchBillInfo();
      alert(res.data.message);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Status update failed!");
    }
  };

  useEffect(() => {
    fetchBillInfo();
  }, []);

  const fetchBillInfo = async () => {
    try {
      const res = await axios.get(API_URL + "/api/dashboard/getBillingInFo");
      setBilingInfoList(res.data.billInfoList);
    } catch (err) {
      console.error("Error fetching billing info:", err);
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
                    <Card key={req._id} style={{ padding: 16, marginBottom: 20 }}>
                      <MDTypography variant="h6">{req.userId?.name || "Unknown User"}</MDTypography>

                      {/* BILL DESCRIPTION */}
                      <MDTypography variant="body2" color="text">
                        {req.Description}
                      </MDTypography>

                      {/* BILL DESCRIPTION */}
                      <MDTypography variant="body1" sx={{ mt: 1 }}>
                        UTRNumber: {req.utrNumber}
                      </MDTypography>
                      {/* AMOUNT */}

                      <MDTypography variant="body1" sx={{ mt: 1 }}>
                        Amount: ₹{req.amount}
                      </MDTypography>

                      {/* STATUS */}
                      <MDTypography variant="body1" sx={{ mt: 1 }}>
                        Status: {req.status}
                      </MDTypography>

                      {/* BANK DETAILS ADDED HERE */}
                      {req?.userId?.paymentMethod?.length > 0 ? (
                        req?.userId?.paymentMethod?.[0]?.type === "bank" ? (
                          <MDBox mt={2} p={2} sx={{ background: "#f7f7f7", borderRadius: "10px" }}>
                            <MDTypography variant="subtitle2" fontWeight="bold">
                              Bank Details
                            </MDTypography>
                            <MDTypography variant="body2">
                              Account Holder:{" "}
                              {req?.userId?.paymentMethod?.[0]?.bankDetails?.accountHolder || "N/A"}
                            </MDTypography>
                            <MDTypography variant="body2">
                              Bank Name:{" "}
                              {req?.userId?.paymentMethod?.[0]?.bankDetails?.bankName || "N/A"}
                            </MDTypography>
                            <MDTypography variant="body2">
                              Account No:{" "}
                              {req?.userId?.paymentMethod?.[0]?.bankDetails?.accountNumber || "N/A"}
                            </MDTypography>
                            <MDTypography variant="body2">
                              IFSC Code:{" "}
                              {req?.userId?.paymentMethod?.[0]?.bankDetails?.ifsc || "N/A"}
                            </MDTypography>
                          </MDBox>
                        ) : (
                          <MDBox mt={2} p={2} sx={{ background: "#f7f7f7", borderRadius: "10px" }}>
                            <MDTypography variant="subtitle2" fontWeight="bold">
                              UPI ID
                            </MDTypography>
                            <MDTypography variant="body2">
                              UPI ID: {req?.userId?.paymentMethod?.[0]?.upiId || "N/A"}
                            </MDTypography>
                          </MDBox>
                        )
                      ) : (
                        <MDTypography variant="body2" color="error">
                          No Payment Method Found
                        </MDTypography>
                      )}

                      {/* APPROVE / REJECT BUTTONS */}
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
