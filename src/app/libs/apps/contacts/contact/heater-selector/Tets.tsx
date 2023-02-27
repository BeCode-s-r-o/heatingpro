import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox() {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top100Films}
      getOptionLabel={(option) => option.heater}
      sx={{ width: 300 }}
      //@ts-ignore
      onChange={(event: any, newValue: string | null) => {}}
      renderInput={(params) => <TextField {...params} label="Movie" />}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { heater: '0004A', label: 'The Shawshank Redemption', phone: '1994' },
  { heater: '0004B', label: 'The Shawshank Redemption', phone: '1994' },
  { heater: '0004C', label: 'The Shawshank Redemption', phone: '1994' },
];
