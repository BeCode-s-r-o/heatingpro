import React, { memo } from 'react';
import { TextField, ListItem, Typography, Switch, MenuItem } from '@mui/material';

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
  columnOptions: { name: string; desc: string; unit: string }[];
  handleColumnNameChange: (e: any, field: string, value: string) => void;
}

const SettingsModalColumn = memo(
  ({ item, handleChange, columnOptions, handleColumnNameChange }: SettingsModalColumnProps) => {
    return (
      <ListItem>
        <Typography className="text-lg font-bold mr-8">{item.value}</Typography>
        <TextField
          select
          label="Názov"
          value={item.columnName}
          name={item.accessor}
          onChange={(e) => handleColumnNameChange(e, 'columnName', e.target.value)}
          className="w-[165px]"
        >
          {columnOptions.map((option) => (
            <MenuItem key={option.name} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="text"
          label="Vysvetlivka"
          value={item.desc}
          name={item.accessor}
          onChange={(e) => handleChange(e, 'desc', e.target.value)}
          className="w-[255px]"
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
          value={item.min}
          name={item.accessor}
          onChange={(e) => handleChange(e, 'min', Number(e.target.value))}
          className="w-[70px] pr-6"
        />
        <TextField
          type="number"
          label="Max."
          value={item.max}
          name={item.accessor}
          onChange={(e) => handleChange(e, 'max', Number(e.target.value))}
          className="w-[70px]"
        />
        <Switch
          checked={!item.hide}
          name={item.accessor}
          onChange={(e) => handleChange(e, 'hide', !e.target.checked)}
        />
      </ListItem>
    );
  }
);

export default SettingsModalColumn;
