import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import PushPinIcon from "@mui/icons-material/PushPin";
import Drawer from "./Drawer";

const SERVER = "http://localhost:5000";



export default function OutlinedCard({
  id,
  title,
  emojis,
  date,
  content,
  pinned,
  cardColor,
  onToggle,
  onPin,
  onDelete,
}) {
  const [expanded, setExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(pinned);

  const handlePinned = async (e) => {
    e.preventDefault();

    const updatedPinned = !isPinned;

    try {
      const res = await fetch(`${SERVER}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_pinned: updatedPinned }),
      });

      if (!res.ok) throw new Error("Failed to update pin");

      const updatedNote = await res.json();

      setIsPinned(updatedPinned);
      onPin(updatedNote);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();

    onDelete(id);
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const displayText =
    content.length < 65
      ? content
      : content.split(" ").slice(0, 65).join(" ") + "...";

  return (
    <Box sx={{ minWidth: 347 }} onClick={() => onToggle(id)}>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: `${cardColor}`,
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
              color={pinned ? "primary" : "inherit"}
            >
              {pinned ? "unpin" : "pin"}
            </PushPinIcon>
            <CloseIcon onClick={handleDelete} sx={{ fontSize: 16 }} />
          </Box>

          {/* Title */}
          <Typography variant="h5">{title}</Typography>

          {/* Emojis */}
          <Typography sx={{ mb: 1.5, fontSize: 14 }}>
            {emojis}{" "}
            <span sx={{ ml: 4.5, color: "#666666" }}>{formattedDate}</span>
          </Typography>

          {/* Mood Content */}
          <Typography variant="body2">
            {displayText}

            <Drawer
              id={id}
              title={title}
              mood={emojis}
              date={formattedDate}
              handleToggle={() => setExpanded((prev) => !prev)}
              content={content}
            >
              {content.length < 65 ? "" : expanded ? "Show less" : "Show more"}
            </Drawer>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
