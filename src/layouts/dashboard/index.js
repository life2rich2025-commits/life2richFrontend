import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import axios from "axios";

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
  const [dashboard, setDashboard] = useState({});
  const [offer, setOffer] = useState([]);
  const [dashboardImage, setDashboardImage] = useState([]);
  const [imageTag, setImageTag] = useState("");

  /* ------------------ OFFER STATE -------------------- */
  const [offerTitle, setOfferTitle] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [validDate, setValidDate] = useState("");
  const [isOfferActive, setIsOfferActive] = useState(true);
  const [offers, setOffers] = useState([]);

  /* ------------------ HANDLE IMAGE UPLOAD -------------------- */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file)
      setSelectedImage({
        file: file,
        url: URL.createObjectURL(file),
      });
  };

  /* ------------------ SAVE IMAGE -------------------- */
  const saveDashboardImage = async () => {
    if (!selectedImage) return;

    console.log(imageTag);

    const formData = new FormData();
    formData.append("uploadImage", selectedImage.file);
    formData.append("imagetag", imageTag);
    formData.append("status", true);

    try {
      const res = await axios.put("http://localhost:4000/api/dashboard/uploadImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response:", res.data.response);
      setDashboardImage(res.data.response);
      alert("Image Uploaded Successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed!");
    }
  };

  /* ------------------ SAVE OFFER -------------------- */
  const saveOffer = async () => {
    if (!offerTitle || !validDate) return;

    const newOffer = {
      title: offerTitle,
      description: offerDescription,
      validTill: validDate,
    };

    try {
      const res = await axios.post("http://localhost:4000/api/dashboard/addOffer", newOffer, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response:", res.data.response);
      setOffer(res.data.response);
      setOfferTitle("");
      setOfferDescription("");
      setValidDate("");
      setIsOfferActive(true);
      alert("Offer added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add offer");
    }
  };

  useEffect(() => {
    fetchDashboardImages();
  }, []);

  const fetchDashboardImages = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/dashboard/home");
      setDashboard(res.data.reponse);
      setDashboardImage(res.data.reponse.imageUrl || []);
      setOffer(res.data.reponse.offer || []);
    } catch (err) {
      console.log("Error fetching images:", err);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* ------------------ STAT CARDS ------------------ */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              icon="person_add"
              title="Total Users"
              count={dashboard?.totalUser?.length || 0}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="dark"
              icon="weekend"
              title="Total Voucher"
              count={dashboard?.totalVoucher?.length || 0}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="success"
              icon="store"
              title="Scratched Voucher"
              count={dashboard?.scratedVoucher?.length || 0}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <ComplexStatisticsCard
              color="primary"
              icon="leaderboard"
              title="Total Amount Earn"
              count={dashboard?.totalAmountEarn || 0}
            />
          </Grid>
        </Grid>

        {/* ------------------------------------------------------------
             SECTION 1: UPLOAD DASHBOARD IMAGE
        ------------------------------------------------------------ */}
        <MDBox mt={4}>
          <Card style={{ padding: 20 }}>
            <h3>Banner Image</h3>

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

            <MDBox mt={2}>
              <label>
                <strong>Image Tag</strong>
              </label>
              <select
                value={imageTag}
                onChange={(e) => setImageTag(e.target.value)}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  marginTop: 5,
                }}
              >
                <option value="voucher">voucher</option>
                <option value="dashboard">dashboard</option>
              </select>
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
          <DashboardImageTable images={dashboardImage} />
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

            {/* Offer Description */}
            <MDBox mt={2}>
              <label>
                <strong>Offer Description</strong>
              </label>
              <input
                type="text"
                value={offerDescription}
                onChange={(e) => setOfferDescription(e.target.value)}
                placeholder=""
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
            {/* <MDBox mt={2} display="flex" alignItems="center" gap={2}>
              <strong>Status:</strong>
              <Switch checked={isOfferActive} onChange={() => setIsOfferActive(!isOfferActive)} />
              <strong>{isOfferActive ? "Active" : "Inactive"}</strong>
            </MDBox> */}

            {/* Save */}
            <Button
              variant="contained"
              color="primary"
              onClick={saveOffer}
              sx={{ mt: 3, color: "#fff" }}
            >
              Save Offer
            </Button>
          </Card>
        </MDBox>

        {/* ------ Offer Table -------- */}
        <MDBox mt={4}>
          <OfferTable offers={offer} />
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
      <h3>Banner Images</h3>

      <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>#</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Image</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Image Name</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Image Tag</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Status</th>
          </tr>
        </thead>

        <tbody>
          {images.map((img, idx) => (
            <tr key={idx} style={{ textAlign: "center" }}>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{idx + 1}</td>

              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <img
                  src={"http://localhost:4000" + img.imageUrl}
                  alt="uploaded"
                  style={{ width: 60, borderRadius: 8 }}
                />
              </td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{img.imagename}</td>

              <td style={{ padding: 10, border: "1px solid #ddd" }}>{img.tag}</td>

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
            <th style={{ padding: 10, border: "1px solid #ddd" }}>offerTitle</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>offerDescription</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Valid Date</th>
            <th style={{ padding: 10, border: "1px solid #ddd" }}>Status</th>
          </tr>
        </thead>

        <tbody>
          {offers.map((item, idx) => (
            <tr key={idx} style={{ textAlign: "center" }}>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{idx + 1}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.title}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>{item.description}</td>
              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                {new Date(item.validTill).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>

              <td style={{ padding: 10, border: "1px solid #ddd" }}>
                <span
                  style={{
                    padding: "4px 10px",
                    background: item.status ? "#4caf50" : "#f44336",
                    color: "#fff",
                    borderRadius: 6,
                  }}
                >
                  {item.status ? "Active" : "Inactive"}
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
