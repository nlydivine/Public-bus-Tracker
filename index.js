const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/buses", require("./routes/buses"));
app.use("/api/routes", require("./routes/routes"));
app.use("/api/fares", require("./routes/fares"));
app.use("/api/gps", require("./routes/gps"));
app.use("/api/ussd", require("./routes/ussd"));

// Serve frontend
app.use(express.static(path.join(__dirname, "frontend")));

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log("==================================");
    console.log(`Server running at http://localhost:${PORT}`);
    console.log("==================================");
});