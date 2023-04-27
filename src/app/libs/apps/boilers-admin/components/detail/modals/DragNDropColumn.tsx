import { useRef, useState } from 'react';
import { showMessage } from 'app/store/slices/messageSlice';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

import { db } from 'src/firebase-config';
import { TBoiler, TBoilerColumn } from '@app/types/TBoilers';
import { useDispatch } from 'react-redux';
import { getBoiler } from '../../../store/boilersSlice';
import { AppDispatch } from 'app/store/index';
import HeightIcon from '@mui/icons-material/Height';
import React from 'react';
import { Typography } from '@mui/material';

interface SettingsColumnProps {
  valueFromPlaceInSms: string | null;
  column: TBoilerColumn;
  index: number;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    attribute: string,
    value: string | number | boolean
  ) => void;
}

export const DragNDropColumn = React.memo(function SettingsColumn({
  column,
  index,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onChange,
  valueFromPlaceInSms,
}: SettingsColumnProps) {
  return (
    <ListItem
      key={index}
      button
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className="cursor-move"
    >
      {' '}
      <Typography className="text-lg font-bold mr-8">
        {/* @ts-ignore */}
        {column.value}
      </Typography>
      <TextField
        type="text"
        label="Názov"
        value={column.columnName}
        name={column.accessor}
        onChange={(e) => onChange(e, 'columnName', e.target.value)}
        className="w-[165px] "
      />
      <TextField
        type="text"
        label="Vysvetlivka"
        value={column.desc}
        name={column.accessor}
        onChange={(e) => onChange(e, 'desc', e.target.value)}
        className="w-[255px] "
      />
      <TextField
        type="text"
        label="Jednotka"
        value={column.unit}
        name={column.accessor}
        onChange={(e) => onChange(e, 'unit', e.target.value)}
        className="w-[80px] px-6"
      />
      <TextField
        type="number"
        label="Min."
        value={column.min}
        name={column.accessor}
        onChange={(e) => onChange(e, 'min', Number(e.target.value))}
        className="w-[70px] pr-6"
      />
      <TextField
        type="number"
        label="Max."
        value={column.max}
        name={column.accessor}
        onChange={(e) => onChange(e, 'max', Number(e.target.value))}
        className="w-[70px]"
      />
      <Switch
        checked={!column.hide}
        name={column.accessor}
        onChange={(e) => {
          onChange(e, 'hide', !e.target.checked);
        }}
      />
      <ListItemSecondaryAction className="mx-12 cursor-move -z-10">
        <HeightIcon />
      </ListItemSecondaryAction>
    </ListItem>
  );
});
