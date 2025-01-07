import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Box, Button, Paper, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [editingItemId, setEditingItemId] = useState(null);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumnIndex = columns.findIndex(
      (column) => column.id == source.droppableId
    );
    const destColumnIndex = columns.findIndex(
      (column) => column.id == destination.droppableId
    );

    const sourceColumn = columns[sourceColumnIndex];
    const destColumn = columns[destColumnIndex];

    // Excluding the item from the source columns
    const [movedItem] = sourceColumn.items.splice(source.index, 1);

    // Adding the item to the new position
    destColumn.items.splice(destination.index, 0, movedItem);

    // Update the state with the modified columns
    const updatedColumns = [...columns];
    updatedColumns[sourceColumnIndex] = sourceColumn;
    updatedColumns[destColumnIndex] = destColumn;

    setColumns(updatedColumns);
  };

  // Adding a new card
  const addingCard = (columnId) => {
    const newCard = {
      id: Date.now().toString(),
      content: "New Card",
    };

    const updatedColumns = columns.map((column) => {
      if (column.id == columnId) {
        return {
          ...column,
          items: [...column.items, newCard],
        };
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  //Editing the card
  const toggleEditMode = (id) => {
    setEditingItemId(editingItemId === id ? null : id);
  };

  const updateItemContent = (columnId, itemId, newContent) => {
    const updatedColumns = columns.map((column) => {
      if (columnId === column.id) {
        return {
          ...column,
          items: column.items.map((item) =>
            item.id === itemId ? { ...item, content: newContent } : item
          ),
        };
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  // Deleting the card
  const deleteCard = (itemId) => {
    const updatedColumns = columns.map((column) => ({
      ...column,
      items: column.items.filter((item) => item.id !== itemId),
    }));
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
                              {editingItemId === item.id ? (
                                <Box display="flex" alignItems="center">
                                  <input
                                    type="text"
                                    value={item.content}
                                    onChange={(e) =>
                                      updateItemContent(
                                        column.id,
                                        item.id,
                                        e.target.value
                                      )
                                    }
                                    style={{ flex: 1, marginRight: 5 }}
                                  />
                                  <Button
                                    onClick={() => toggleEditMode(item.id)}
                                    size="small"
                                    color="primary"
                                  >
                                    Save
                                  </Button>
                                  
                                </Box>
                              ) : (
                                <Box display="flex" alignItems="center">
                                  <Typography style={{ flex: 1 }}>
                                    {item.content}
                                  </Typography>
                                  <Button
                                    onClick={() => toggleEditMode(item.id)}
                                    size="small"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => deleteCard(item.id)}
                                    size="small"
                                    color="secondary"
                                    startIcon={<DeleteIcon />}
                                  >
                                    Delete
                                  </Button>
                                </Box>
                              )}
                            </Paper>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                      <Button
                        sx={{ marginTop: "10px", color: "#959dab" }}
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={() => addingCard(column.id)}
                      >
                        Card
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
