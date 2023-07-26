import React, { useState, useEffect, useLayoutEffect } from 'react';

import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  verticalListSortingStrategy,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
  restrictToParentElement,
} from '@dnd-kit/modifiers';

import { ChakraProvider } from '@chakra-ui/react';
import {
  Flex,
  VStack,
  Box,
  Stack,
  Heading,
  Image,
  Center,
} from '@chakra-ui/react';
import { SimpleGrid } from '@chakra-ui/react';

import DraggableItem from './components/DraggableItem.js';
import Droppable from './components/Droppable.js';

// initial drag and drop was built based on
// https://docs.dndkit.com/introduction/getting-started
// https://medium.com/@kurniawancristianto/implement-drag-and-drop-feature-in-react-js-using-dnd-kit-library-4cbd7e4b8135
// this also helped
// https://codesandbox.io/s/playground-0mine?file=/src/components/Droppable.jsx
// i set up data key in Draggable.js->useDraggable(), it was not clear how to do this

function App() {
  // STATE VARIABLES
  const [preDroppedItem, setPreDroppedItem] = useState(true);
  const [droppedItems, setDroppedItems] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const [activeSidebarField, setActiveSidebarField] = useState(false);
  const [activeDropField, setActiveDropField] = useState(false);

  // proxy fetch results from Strapi
  var fetchResults = [
    {
      id: '22',
      mediaType: 'generative',
      mediaTitle: 'super generative',
      mediaRunLength: '01:00:00',
    },
    {
      id: '14',
      mediaType: 'video',
      mediaTitle: 'awesome video 1',
      mediaRunLength: '0:05:35',
    },
    {
      id: '36',
      mediaType: 'image',
      mediaTitle: 'amazing image 1',
      mediaRunLength: '00:03:00',
    },
  ];
  const mediaArray = fetchResults;

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragCancel = () => setActiveId(null);

  const handleDragOver = ({ active, over }) => {
    const overId = over?.id;
    if (!overId) {
      return;
    }

    if (
      over &&
      typeof active.id === 'string' &&
      over.id !== 'droppable' &&
      preDroppedItem
    ) {
      setPreDroppedItem(false);
      console.log(`here's where we want to insert a new temp item`);
      const temp = [...droppedItems];
      // over.id is the sortID we passed back from sortableItem, not the array entry
      // console.log(`over sortID = ${over.id}`);
      const newSortID = temp.length + 1;
      const newIndex = temp.findIndex((item) => item.sortID === over.id);
      // console.log(`over index in droppedItems = ${newIndex}`);
      const newObj = active.data.current.props;
      newObj.sortID = newSortID;
      // push newObj into the array at a specifc entry point
      const insertAtIndex = (array, index, item) => {
        return [...array.slice(0, index), item, ...array.slice(index)];
      };
      const test = insertAtIndex(temp, newIndex, newObj);
      // console.log(test);
      setDroppedItems(test);
    } else if (
      over &&
      typeof active.id === 'string' &&
      over.id !== 'droppable' &&
      !preDroppedItem
    ) {
      // console.log(`now we just want to sort using the predropped item as an index`);
      // what is the last item added to droppedItems? that's the obj we want to place "above" the current over
      const temp = [...droppedItems];
      const lastAddedID = temp.length;
      setDroppedItems((items) => {
        const oldIndex = items.findIndex((item) => item.sortID === lastAddedID);
        const newIndex = items.findIndex((item) => item.sortID === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragEnd = ({ active, over }) => {
    setPreDroppedItem(true);

    if (!over) {
      console.log(`dropped, but not over anything`);
      setActiveId(null);
      return;
    }

    // handles dropping a draggableItem into the drop zone
    if (over && over.id === 'droppable' && typeof active.id === 'string') {
      // pass the array of objects to the Droppable component as a prop with added sortID
      const temp = [...droppedItems];
      var tempWithSortIDs = [];

      if (!temp.some((o) => o.sortID)) {
        // console.log(`there's no sortID yet, user dropped the first draggableItem`);
        temp.push(active.data.current.props);
        tempWithSortIDs = temp.map((v, index) => ({ ...v, sortID: index + 1 }));
      } else {
        // console.log(`there's already sortIDs, keeping them in the established order`);
        var newSortID = temp.length + 1;
        var newObj = active.data.current.props;
        newObj.sortID = newSortID;
        temp.push(newObj);
        tempWithSortIDs = temp;
      }
      setDroppedItems(tempWithSortIDs);
    }

    // handles sorting once items are in the drop zone
    if (over && active.id !== over.id && over.id !== 'droppable') {
      setDroppedItems((items) => {
        const oldIndex = items.findIndex((item) => item.sortID === active.id);
        const newIndex = items.findIndex((item) => item.sortID === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  return (
    <ChakraProvider>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
      >
        <Flex>
          <Box ml={5} mt={10}>
            <VStack>
              {mediaArray?.map((mediaEntry, index) => (
                <DraggableItem
                  key={index}
                  id={mediaEntry.mediaTitle}
                  props={mediaEntry}
                />
              ))}
            </VStack>
          </Box>

          <Droppable droppedItems={droppedItems} activeId={activeId} />
        </Flex>
        {/* <DragOverlay>{activeId ? <DraggableItem id={activeId} dragOverlay/> : null}</DragOverlay> */}
      </DndContext>
    </ChakraProvider>
  );
}

export default App;
