import React, { memo } from 'react';
import { useRef, useState } from 'react';
import { showMessage } from 'app/store/slices/messageSlice';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

import { db } from 'src/firebase-config';
import { TBoiler } from '@app/types/TBoilers';
import { useDispatch } from 'react-redux';
import { getBoiler } from '../../../store/boilersSlice';
import { AppDispatch } from 'app/store/index';
import HeightIcon from '@mui/icons-material/Height';

interface SettingsModalColumnProps {
  item: {
    value: string;
    columnName: string;
    desc: string;
    unit: string;
    min?: number;
    max?: number;
    hide: boolean;
    accessor: string;
  };
  handleChange: (e: any, field: string, value: string | number | boolean) => void;
}

const SettingsModalColumn = memo(({ item, handleChange }: SettingsModalColumnProps) => {
  return (
    <ListItem>
      {' '}
      <Typography className="text-lg font-bold mr-8">{item.value}</Typography>
      <TextField
        type="text"
        label="Názov"
        value={item.columnName}
        name={item.accessor}
        onChange={(e) => handleChange(e, 'columnName', e.target.value)}
        className="w-[165px] "
      />
      <TextField
        type="text"
        label="Vysvetlivka"
        value={item.desc}
        name={item.accessor}
        onChange={(e) => handleChange(e, 'desc', e.target.value)}
        className="w-[255px] "
      />
      <TextField
        type="text"
        label="Jednotka"
        value={item.unit}
        name={item.accessor}
        onChange={(e) => handleChange(e, 'unit', e.target.value)}
        className="w-[80px] px-6"
      />
      <TextField
        type="number"
        label="Min."
        value={item.min || undefined}
        name={item.accessor}
        onChange={(e) => handleChange(e, 'min', Number(e.target.value))}
        className="w-[70px] pr-6"
      />
      <TextField
        type="number"
        label="Max."
        value={item.max || undefined}
        name={item.accessor}
        onChange={(e) => handleChange(e, 'max', Number(e.target.value))}
        className="w-[70px]"
      />{' '}
      <Switch
        checked={!item.hide}
        name={item.accessor}
        onChange={(e) => {
          handleChange(e, 'hide', !e.target.checked);
        }}
      />
    </ListItem>
  );
});

export default SettingsModalColumn;
