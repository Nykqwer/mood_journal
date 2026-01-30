import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import PushPinIcon from "@mui/icons-material/PushPin";
import Drawer from "./Drawer";
import { Note } from "./types/note";


const SERVER = "http://localhost:5000";


type NoteListProps = {
  note: Note;
  onToggle: (id: string) => void;
  onPinned: (note: Note) => void;
  onDelete: (id: string) => void; 
}


export default function OutlinedCard({
  note,
  onToggle,
  onPinned,
  onDelete,
}: NoteListProps ) {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState(note.is_pinned);

  const handlePinned = async () => {


    const updatedPinned = !isPinned;

    try {
      const res = await fetch(`${SERVER}/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_pinned: updatedPinned }),
      });

      if (!res.ok) throw new Error("Failed to update pin");

      const updatedNote = await res.json();
      console.log(updatedNote, "eto yunnnnnn")
      setIsPinned(updatedPinned);
      onPinned(updatedNote);
    } catch (err) {
      console.error(err);
    }
  };



  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const displayText =
    note.content.length < 65
      ? note.content
      : note.content.split(" ").slice(0, 65).join(" ") + "...";

  return (
    <Box sx={{ minWidth: 347 }} onClick={() => onToggle(note.id)}>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: `${note.card_color}`,
          height: 300,
          position: "relative",
          borderRadius: 3,
        }}
      >
        <CardContent>
          {/* Icons */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              display: "flex",
              gap: 1,
            }}
          >
            <PushPinIcon
              onClick={handlePinned}
              sx={{ fontSize: 15 }}
              color={note.is_pinned ? "primary" : "inherit"}
            >
              {note.is_pinned ? "unpin" : "pin"}
            </PushPinIcon>
            <CloseIcon onClick={() => onDelete(note.id)} sx={{ fontSize: 16 }} />
          </Box>

          {/* Title */}
          <Typography variant="h5">{note.title}</Typography>

          {/* Emojis */}
          <Typography sx={{ mb: 1.5, fontSize: 14 }}>
            {note.emojis}{" "}
           <Box
              component="span"
              sx={{ ml: 4.5, color: "#666666" }}
            >
              {formattedDate}
          </Box>
          </Typography>

          {/* Mood Content */}
          <Typography variant="body2">
            {displayText}

            <Drawer
              id={note.id}
              title={note.title}
              mood={note.emojis}
              date={formattedDate}
              handleToggle={() => setExpanded((prev) => !prev)}
              content={note.content}
            >
              {note.content.length < 65 ? "" : expanded ? "Show less" : "Show more"}
            </Drawer>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
