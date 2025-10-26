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

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Create a new appointment (mock)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patient:
 *                 type: string
 *               doctor:
 *                 type: string
 *               time:
 *                 type: string
 *               status:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Appointment created (mock)
 */
app.use(express.json());

app.post("/api/v1/appointments", auth, (req, res) => {
  const { patient, doctor, time, status } = req.body;

  // Simulate saving by logging
  console.log("📥 New appointment received (mock):", req.body);

  res.status(201).json({
    message: "Appointment created (mock only)",
    appointment: { patient, doctor, time, status },
  });
});

/**
 * @swagger
 * /api/v1/appointments/{id}:
 *   delete:
 *     summary: Delete an appointment by ID (mock)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Appointment ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Appointment deleted (mock)
 *       404:
 *         description: Appointment not found
 */
app.delete("/api/v1/appointments/:id", auth, (req, res) => {
  const id = parseInt(req.params.id);
  const exists = appointments.find(a => a.id === id);

  if (exists) {
    console.log(`🗑️ Mock delete: Appointment ID ${id}`);
    res.json({ message: `Appointment ID ${id} deleted (mock only)` });
  } else {
    res.status(404).json({ error: "Appointment not found" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Partner API running on port ${PORT}`));