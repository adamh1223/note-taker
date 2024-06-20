const path = require("path");
const router = require("express").Router();
const fs = require("fs");

// API route to get all notes
router.get("/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// API route to save a new note
router.post("/notes", (req, res) => {
  const newNote = { id: uuidv4(), ...req.body };
  fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(
      path.join(__dirname, "../db/db.json"),
      JSON.stringify(notes, null, 2),
      (err) => {
        if (err) throw err;
        res.json(newNote);
      }
    );
  });
});

// API route to delete a note
router.delete("/notes/:id", (req, res) => {
  fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const filteredNotes = notes.filter((note) => note.id !== req.params.id);
    fs.writeFile(
      path.join(__dirname, "../db/db.json"),
      JSON.stringify(filteredNotes, null, 2),
      (err) => {
        if (err) throw err;
        res.json({ success: true });
      }
    );
  });
});

module.exports = router;
