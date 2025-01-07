import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Box, Button, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from '@mui/icons-material/Edit';
import Navbar from "./components/Navbar";

const initialItems = [
  { id: "111", content: "Content 1" },
  { id: "222", content: "Content 2" },
  { id: "333", content: "Content 3" },
];

const initialColumns = [
  {
    name: "To do",
    id: "123",
    items: initialItems,
  },
  {
    name: "Doing",
    id: "456",
    items: [],
  },
  {
    name: "Done",
    id: "789",
    items: [],
  },
];

function App() {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result) => {
    var sourceIndex = 0;
    var destinationIndex = 0;
    var draggedItem = {};
    console.log(result);

    for (var i in columns) {
      if (result.source.droppableId == columns[i].id) {
        var sourceColumnItems = columns[i].items;
        sourceIndex = i;
      } else if (result.destination.droppableId == columns[i].id) {
        var destinationColumnItems = [...columns[i].items];
        destinationIndex = i;
      }
    }

    // Find the dragged item
    for (var i in sourceColumnItems) {
      if (sourceColumnItems[i].id == result.draggableId) {
        draggedItem = sourceColumnItems[i];
      }
    }

    // "Excluding" the dragged object by filtering
    var filteredSourceColumnItems = sourceColumnItems.filter(
      (item) => item.id != result.draggableId
    );

    // Adding it to the new position and changing the state
    var columnsCopy = JSON.parse(JSON.stringify(columns));
    if (result.source.droppableId == result.destination.droppableId) {
      filteredSourceColumnItems.splice(
        result.destination.index,
        0,
        draggedItem
      );
    } else {
      destinationColumnItems.splice(result.destination.index, 0, draggedItem);
      columnsCopy[destinationIndex].items = destinationColumnItems;
    }
    columnsCopy[sourceIndex].items = filteredSourceColumnItems;
    setColumns(columnsCopy);
  };

  // Adding a new card
  const addingCard = (columnId) => {
    const newCard = {
      id: Date.now().toString(),
      content: 'New Card'
    }

    const updatedColumns = columns.map((column) => {
      if (column.id == columnId) {
        return {
          ...column,
          items: [...column.items, newCard]
        };
      }
      return column
    });
    setColumns(updatedColumns);
  }

  return (
    <Box
      sx={{
        backgroundImage: "linear-gradient(45deg, #8587f3 30%, #fd84ae 100%)",
      }}
    >
      <Navbar />
      <Box display="flex" justifyContent="center" height="100vh">
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((column) => (
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Droppable droppableId={column.id} key={column.id}>
                {(provided) => (
                  <Box
                    style={{
                      backgroundColor: "#ebebf1",
                      width: 400,
                      height: "fit-content",
                      padding: 10,
                      margin: 10,
                    }}
                  >
                    <Typography variant="h4">{column.name}</Typography>
                    <Box ref={provided.innerRef} width="100%" height="100%">
                      {column.items.map((item, index) => (
                        <Draggable
                          draggableId={item.id}
                          index={index}
                          key={item.id}
                        >
                          {(provided) => (
                            <Paper
                              elevation={2}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              style={{
                                height: 40,
                                marginTop: 10,
                                padding: 5,
                                ...provided.draggableProps.style,
                              }}
                            >
                              {item.content}
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <Button sx={{marginTop:"10px", color: "#959dab"}} size="large" startIcon={<AddIcon />} onClick={() => addingCard(column.id)}>
                        Card
                      </Button>
                      <Button sx={{marginTop:"10px", color: "#959dab"}} size="large" startIcon={<EditIcon />} onClick={() => addingCard(column.id)}>
                        Edit
                      </Button>
                    </Box>
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </DragDropContext>
      </Box>
    </Box>
  );
}

export default App;
