const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// API route to get all notes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

// API route to save a new note
app.post("/api/notes", (req, res) => {
  const newNote = { id: uuidv4(), ...req.body };
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote);
    fs.writeFile(
      path.join(__dirname, "db/db.json"),
      JSON.stringify(notes, null, 2),
      (err) => {
        if (err) throw err;
        res.json(newNote);
      }
    );
  });
});

// API route to delete a note
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile(path.join(__dirname, "db/db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const filteredNotes = notes.filter((note) => note.id !== req.params.id);
    fs.writeFile(
      path.join(__dirname, "db/db.json"),
      JSON.stringify(filteredNotes, null, 2),
      (err) => {
        if (err) throw err;
        res.json({ success: true });
      }
    );
  });
});

// Route to serve notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Fallback route for index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
