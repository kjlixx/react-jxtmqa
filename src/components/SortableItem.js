import React, { useState, useEffect, useMemo } from 'react';
// import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Heading,
  useDisclosure,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Spacer,
  Divider,
  Textarea,
} from '@chakra-ui/react';
import {
  SimpleGrid,
  Button,
  Container,
  Center,
  Flex,
  Box,
  Text,
  Image,
  Circle,
} from '@chakra-ui/react';

import { Icon } from '@chakra-ui/react';
import {
  BsFillFileImageFill,
  BsFillCameraVideoFill,
  BsExclamationTriangleFill,
} from 'react-icons/bs';

// DND KIT
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// this animateLayoutChanges stuff is here for when we implement deleting an item
// search github for issues and discussions, there's some info there...
// https://5fc05e08a4a65d0021ae0bf2-mhplerkrjw.chromatic.com/?path=/story/presets-sortable-vertical--removable-items
function animateLayoutChanges(args) {
  const { isSorting, wasSorting } = args;

  if (isSorting || wasSorting) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
}

export default function SortableItem(props) {
  // DND-KIT stuff here
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.props.sortID });

  const style = {
    position: 'relative',
    zIndex: isDragging ? 1 : undefined,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      bg="white"
      borderRadius="lg"
      p={5}
    >
      {props.props.mediaType === 'generative' && (
        <Icon as={BsExclamationTriangleFill} />
      )}
      {props.props.mediaType === 'video' && <Icon as={BsFillCameraVideoFill} />}
      {props.props.mediaType === 'image' && <Icon as={BsFillFileImageFill} />}

      <Text fontSize="xs">Strapi ID: {props.props.id}</Text>
      <Text fontSize="xs">Initial Drop Zone INDEX: {props.props.sortID}</Text>
      <Heading as="h5" size="sm">
        {props.props.mediaTitle}
      </Heading>
    </Box>
  );
}
