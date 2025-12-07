import { useState } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

/* =====================================================================
   MAIN DASHBOARD COMPONENT
===================================================================== */
function Dashboard() {
  /* ------------------ DASHBOARD IMAGE STATE -------------------- */
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageActive, setIsImageActive] = useState(true);
  const [dashboardImages, setDashboardImages] = useState([]);

  /* ------------------ OFFER STATE -------------------- */
  const [offerTitle, setOfferTitle] = useState("");
  const [validDate, setValidDate] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(true);
  const [offers, setOffers] = useState([]);

  /* ------------------ HANDLE IMAGE UPLOAD -------------------- */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file)
      setSelectedImage({
        file,
        url: URL.createObjectURL(file),
      });
  };

  /* ------------------ SAVE IMAGE -------------------- */
  const saveDashboardImage = () => {
    if (!selectedImage) return;

    const newImage = {
      url: selectedImage.url,
      active: isImageActive,
    };

    setDashboardImages([...dashboardImages, newImage]);

    // Reset
    setSelectedImage(null);
    setIsImageActive(true);
  };

  /* ------------------ SAVE OFFER -------------------- */
  const saveOffer = () => {
    if (!offerTitle || !validDate) return;

    const newOffer = {
      title: offerTitle,
      validDate,
      active: isOfferActive,
    };

    setOffers([...offers, newOffer]);

    // Reset
    setOfferTitle("");
    setValidDate("");
    setIsOfferActive(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        {/* ------------------ STAT CARDS ------------------ */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard color="dark" icon="weekend" title="Total Voucher" count={281} />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard icon="leaderboard" title="Total Users" count="2,300" />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="success"
              icon="store"
              title="Scratched Voucher"
              count="34k"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="primary"
              icon="person_add"
              title="Total Amount Earn"
              count="91"
            />
          </Grid>
        </Grid>

        {/* ------------------------------------------------------------
             SECTION 1: UPLOAD DASHBOARD IMAGE
        ------------------------------------------------------------ */}
        <MDBox mt={4}>
          <Card style={{ padding: 20 }}>
            <h3>Upload Dashboard Image</h3>

            {/* Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ marginTop: 10 }}
            />

            {/* Preview */}
            {selectedImage && (
              <img
                src={selectedImage.url}
                alt="Preview"
                style={{
                  width: "100%",
                  marginTop: 20,
                  borderRadius: 12,
                  border: "1px solid #ddd",
                }}
              />
            )}

            {/* Status Toggle */}
            <MDBox mt={2} display="flex" alignItems="center" gap={2}>
              <strong>Status:</strong>
              <Switch checked={isImageActive} onChange={() => setIsImageActive(!isImageActive)} />
              <strong>{isImageActive ? "Active" : "Inactive"}</strong>
            </MDBox>

            {/* Save */}
            <Button
              variant="contained"
              color="primary"
              onClick={saveDashboardImage}
              sx={{ mt: 3, color: "#fff" }}
            >
              Save Image
            </Button>
          </Card>
        </MDBox>

        {/* ------ Image Table -------- */}
        <MDBox mt={4}>
          <DashboardImageTable images={dashboardImages} />
        </MDBox>

        {/* ------------------------------------------------------------
             SECTION 2: CREATE OFFER
        ------------------------------------------------------------ */}
        <MDBox mt={6}>
          <Card style={{ padding: 20 }}>
            <h3>Available Offer</h3>

            {/* Offer Title */}
            <MDBox mt={2}>
              <label>
                <strong>Offer Title</strong>
              </label>
              <input
                type="text"
                value={offerTitle}
                onChange={(e) => setOfferTitle(e.target.value)}
                placeholder="Example: 20% OFF"
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  marginTop: 5,
                }}
              />
            </MDBox>

            {/* Valid Date */}
            <MDBox mt={2}>
              <label>
                <strong>Valid Date</strong>
              </label>
              <input
                type="date"
                value={validDate}
                onChange={(e) => setValidDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  marginTop: 5,
                }}
              />
            </MDBox>

            {/* Status Toggle */}
            <MDBox mt={2} display="flex" alignItems="center" gap={2}>
              <strong>Status:</strong>
              <Switch checked={isOfferActive} onChange={() => setIsOfferActive(!isOfferActive)} />
              <strong>{isOfferActive ? "Active" : "Inactive"}</strong>
            </MDBox>

            {/* Save */}
            <Button
              variant="contained"
              color="success"
              onClick={saveOffer}
              sx={{ mt: 3, color: "#fff" }}
            >
              Save Offer
            </Button>
          </Card>
        </MDBox>

        {/* ------ Offer Table -------- */}
        <MDBox mt={4}>
          <OfferTable offers={offers} />
        </MDBox>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}

/* =====================================================================
   TABLE 1: Dashboard Images
===================================================================== */
function DashboardImageTable({ images }) {
  return (
    <Card style={{ padding: 20 }}>
      <h3>Dashboard Images</h3>

      <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>#</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Image</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Status</th>
          </tr>
        </thead>

        <tbody>
          {images.map((img, idx) => (
            <tr key={idx}>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{idx + 1}</td>

              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <img src={img.url} alt="uploaded" style={{ width: 60, borderRadius: 8 }} />
              </td>

              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <span
                  style={{
                    padding: "4px 10px",
                    background: img.active ? "#4caf50" : "#f44336",
                    color: "#fff",
                    borderRadius: 6,
                  }}
                >
                  {img.active ? "Active" : "Inactive"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

DashboardImageTable.propTypes = {
  images: PropTypes.array.isRequired,
};

/* =====================================================================
   TABLE 2: Offers
===================================================================== */
function OfferTable({ offers }) {
  return (
    <Card style={{ padding: 20 }}>
      <h3>Available Offers</h3>

      <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>#</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Offer</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Valid Date</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Status</th>
          </tr>
        </thead>

        <tbody>
          {offers.map((item, idx) => (
            <tr key={idx}>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{idx + 1}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.title}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.validDate}</td>

              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <span
                  style={{
                    padding: "4px 10px",
                    background: item.active ? "#4caf50" : "#f44336",
                    color: "#fff",
                    borderRadius: 6,
                  }}
                >
                  {item.active ? "Active" : "Inactive"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

OfferTable.propTypes = {
  offers: PropTypes.array.isRequired,
};

export default Dashboard;
