import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Box, Text, Heading } from '@chakra-ui/react';

export default function DraggableItem(props) {
  // DND-KIT stuff here
  const { isDragging, attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: props.id,
      data: props,
    });

  const style = transform
    ? {
        position: 'relative',
        zIndex: isDragging ? 1 : undefined,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        cursor: 'pointer',
      }
    : { cursor: 'pointer' };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      w={'230px'}
      h={'80px'}
      p={2}
      bg={'orange'}
      borderRadius={5}
    >
      <Text fontSize="sm">Strapi ID: {props?.props?.id}</Text>
      <Heading as="h5" size="sm">
        {props?.props?.mediaTitle}
      </Heading>
      <Text fontSize="xs">{props?.props?.mediaRunLength}</Text>
    </Box>
  );
}
