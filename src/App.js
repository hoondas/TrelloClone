import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

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
    items:[],
  },
  {
    name: "Done",
    id: "789",
    items:[],
  },
];

function App() {
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result) => {
    var sourceIndex = 0;
    var destinationIndex = 0;
    var draggedItem = {};

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
    var filteredSourceColumnItems = sourceColumnItems.filter((item) => item.id != result.draggableId);

    // Adding it to the new position and changing the state
    var columnsCopy = JSON.parse(JSON.stringify(columns));
    if (result.source.droppableId == result.destination.droppableId) {
      filteredSourceColumnItems.splice(result.destination.index, 0, draggedItem)
    } else {
      destinationColumnItems.splice(result.destination.index, 0, draggedItem);
      columnsCopy[destinationIndex].items = destinationColumnItems;
    }
    columnsCopy[sourceIndex].items = filteredSourceColumnItems;
    setColumns(columnsCopy);
  }

  return (
    <div style={{display:"flex", justifyContent:"center", }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {columns.map((column) => (
          <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1>{column.name}</h1>
            <Droppable droppableId={column.id} key={column.id}>
              {(provided) => (
                <div ref={provided.innerRef} style={{backgroundColor:"lightblue", width:250, height:500, padding: 10, margin: 10}}>
                  {column.items.map((item, index) => (
                    <Draggable draggableId={item.id} index={index} key={item.id}>
                      {(provided) => (
                        <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef} style={{backgroundColor:"gray", height: 40, marginBottom: 10, ...provided.draggableProps.style}}>
                          {item.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
    
  );
}

export default App;
