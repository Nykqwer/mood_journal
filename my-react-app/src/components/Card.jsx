import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import PushPinIcon from '@mui/icons-material/PushPin';
import { color, margin } from '@mui/system';


const cardColors = [
  '#E3F2FD',
  '#FCE4EC',
  '#E8F5E9',
  '#FFFDE7',
  '#F3E5F5',
];

function getRandomColor() {
  return cardColors[Math.floor(Math.random() * cardColors.length)];
}



export default function OutlinedCard({id,title, emojis, date, content, pinned, onPin, onDelete}) {
  const [bgColor] = useState(getRandomColor);


    const handlePinned = e => {
    e.preventDefault();
    onPin(id, !pinned); // toggle parent state
  };

  const handleDelete = e => {
    e.preventDefault();

   onDelete(id);
  }




  return (
    <Box sx={{ minWidth: 347 }}>
      <Card
        variant="outlined"
        sx={{
          backgroundColor: bgColor,
          height: 300,
          position: 'relative',
          borderRadius: 3,
        }}
      >
        <CardContent>
          {/* Icons */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
            }}
          >
            <PushPinIcon onClick={handlePinned} sx={{ fontSize: 15 }} color={pinned ? 'primary' : 'inherit'} />
            <CloseIcon onClick={handleDelete} sx={{ fontSize: 16 }} />
          </Box>

          {/* Title */}
          <Typography variant="h5">
            {title}
          </Typography>

          {/* Emojis */}
          <Typography sx={{ mb: 1.5, fontSize: 14 }}>
            {emojis}  <span sx={{ml: 4.5,  color: '#666666'}}>{date}</span>
          </Typography>

          {/* Mood Content */}
          <Typography variant="body2">
            {content}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
