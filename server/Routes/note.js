import express from "express";
import pool from "../db.js";



const router = express.Router();



// Get all notes
// Get all notes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM notes
      ORDER BY
        is_pinned DESC,
        original_order DESC
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});



router.post("/submit", async (req, res) => {
  try {
    const { id, title, content, sentences, emojis, color } = req.body;

    const result = await pool.query(
      `INSERT INTO notes (
        id,
        title,
        content,
        emojis,
        sentences,
        is_pinned,
        original_order,
        card_color
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        false,
        COALESCE((SELECT MAX(original_order) FROM notes), 0) + 1,
        $6
      )
      RETURNING *`,
      [id, title, content, emojis, sentences, color]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save note" });
  }
});


router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_pinned } = req.body;

    if (typeof is_pinned !== "boolean") {
      return res.status(400).json({
        error: "is_pinned must be a boolean",
      });
    }

    const result = await pool.query(
      `
      UPDATE notes
      SET is_pinned = $1
      WHERE id = $2
      RETURNING *
      `,
      [is_pinned, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update pin" });
  }
});



router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1",
      [id]
    );

    // Optional: check if any row was actually deleted
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Send success response
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete note" });
  }
});



export default router;
