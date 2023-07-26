import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { DndContext, useDroppable } from '@dnd-kit/core';
import {
  arrayMove,
  verticalListSortingStrategy,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
// import { restrictToVerticalAxis, restrictToWindowEdges, restrictToParentElement } from "@dnd-kit/modifiers";

import { Box, SimpleGrid, Text, Heading } from '@chakra-ui/react';
import { Icon } from '@chakra-ui/react';

import {
  BsFillFileImageFill,
  BsFillCameraVideoFill,
  BsExclamationTriangleFill,
} from 'react-icons/bs';

import SortableItem from './SortableItem.js';

export default function Droppable(props) {
  // DND-KIT stuff here
  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });

  const itemIds = useMemo(
    () => props.droppedItems.map((item) => item.sortID),
    [props.droppedItems]
  );
  // console.log(itemIds);
  // console.log(props.droppedItems);

  return (
    <>
      <SortableContext items={itemIds} strategy={rectSortingStrategy}>
        <Box
          ref={setNodeRef}
          bg={isOver ? 'green.200' : 'gray.200'}
          w={'800px'}
          h={'800px'}
          overflowY="auto"
          ml={200}
          mt={10}
          p={10}
          borderRadius={10}
        >
          <Heading as="h4" size="md">
            DROP ZONE
          </Heading>

          <SimpleGrid borderRadius={10} p={2} columns={1} spacing={4}>
            {props.droppedItems.map((item, index) => (
              <SortableItem key={item.sortID} item={item} props={item} />
            ))}
          </SimpleGrid>
        </Box>
      </SortableContext>
    </>
  );
}
