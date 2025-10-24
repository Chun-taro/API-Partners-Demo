require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./middleware/auth");
const appointments = require("./data/appointments.json");
const { swaggerUi, specs } = require("./swagger");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /api/v1/appointments:
 *   get:
 *     summary: Retrieve appointments by date
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: Date in YYYY-MM-DD format
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       patient:
 *                         type: string
 *                       doctor:
 *                         type: string
 *                       time:
 *                         type: string
 *                       status:
 *                         type: string
 */

app.get("/api/v1/appointments", auth, (req, res) => {
  const date = req.query.date;
  const filtered = appointments.filter(a => a.time.startsWith(date));
  res.json({ appointments: filtered });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Partner API running on port ${PORT}`));