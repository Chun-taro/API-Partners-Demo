require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./middleware/auth");
const appointments = require("./data/appointments.json");
const { swaggerUi, specs } = require("./swagger");
const calendar = require("./data/calendar.json");

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
 *       - be arerAuth: []
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

/**
 * @swagger
 * /api/v1/calendar:
 *   get:
 *     summary: Retrieve available slots for a doctor on a given date
 *     parameters:
 *       - in: query
 *         name: doctor
 *         schema:
 *           type: string
 *         required: true
 *         description: Doctor's name
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
 *         description: Available time slots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slots:
 *                   type: array
 *                   items:
 *                     type: string
 */
app.get("/api/v1/calendar", auth, (req, res) => {
  const { doctor, date } = req.query;
  const entry = calendar.find(c => c.doctor === doctor && c.date === date);
  if (entry) {
    res.json({ slots: entry.slots });
  } else {
    res.json({ slots: [] });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Partner API running on port ${PORT}`));