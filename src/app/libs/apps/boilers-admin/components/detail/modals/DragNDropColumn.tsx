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
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

interface SettingsColumnProps {
  columnOptions: { name: string; unit: string; desc: string }[];
  valueFromPlaceInSms: string | null;
  column: TBoilerColumn;
  index: number;
  onDragStart: (index: number) => void;
  onDragEnter: (index: number) => void;
  onDragEnd: () => void;
  onChange: (e: any, attribute: string, value: string | number | boolean) => void;
}

export const DragNDropColumn = React.memo(function SettingsColumn({
  column,
  index,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onChange,
  valueFromPlaceInSms,
  columnOptions,
}: SettingsColumnProps) {
  const actualColumnOption = columnOptions.find((item) => item.name === column.columnName) || {
    name: column.columnName,
    desc: column.desc,
    unit: column.unit,
  };
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
        {valueFromPlaceInSms !== null ? valueFromPlaceInSms : '-'}
      </Typography>
      <Autocomplete
        className="w-[165px] "
        disablePortal
        freeSolo
        options={columnOptions} //@ts-ignore
        getOptionLabel={(option) => option.name} //@ts-ignore
        value={actualColumnOption}
        inputValue={column.columnName}
        onInputChange={(event, value) => {
          onChange(column.accessor, 'columnName', value);
        }}
        renderOption={(_props, option) => <li {..._props}>{option.name}</li>}
        renderInput={(params) => <TextField {...params} label="Názov" name={column.accessor} />}
      />
      <TextField
        type="text"
        label="Vysvetlivka"
        value={column.desc}
        name={column.accessor}
        onChange={(e) => onChange(column.accessor, 'desc', e.target.value)}
        className="w-[255px] "
      />
      <TextField
        type="text"
        label="Jednotka"
        value={column.unit}
        name={column.accessor}
        onChange={(e) => onChange(column.accessor, 'unit', e.target.value)}
        className="w-[80px] px-6"
      />
      <TextField
        type="number"
        label="Min."
        value={column.min}
        name={column.accessor}
        onChange={(e) => onChange(column.accessor, 'min', Number(e.target.value))}
        className="w-[70px] pr-6"
      />
      <TextField
        type="number"
        label="Max."
        value={column.max}
        name={column.accessor}
        onChange={(e) => onChange(column.accessor, 'max', Number(e.target.value))}
        className="w-[70px]"
      />
      <Switch
        checked={!column.hide}
        name={column.accessor}
        onChange={(e) => {
          onChange(column.accessor, 'hide', !e.target.checked);
        }}
      />
      <ListItemSecondaryAction className="pr-16 cursor-move -z-10 ">
        <HeightIcon />
      </ListItemSecondaryAction>
      <Typography className="text-lg font-bold ml-20">{column.accessor}</Typography>
    </ListItem>
  );
});
