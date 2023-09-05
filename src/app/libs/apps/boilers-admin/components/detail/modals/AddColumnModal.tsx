import FuseSvgIcon from '@app/core/SvgIcon';
import {
  Autocomplete,
  Button,
  Drawer,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { AppDispatch } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
import { getBoiler } from '../../../store/boilersSlice';
interface Props {
  isOpen: boolean;
  close: () => void;
  setColumns: React.Dispatch<any>;
  columns: { id: string; field: string; headerName: string; unit: string; desc: string }[];
  rows: {}[];
  deviceID: string;
}

function AddColumnModal({ isOpen, close, columns, deviceID, rows, setColumns }: Props) {
  const [formFields, setFormFields] = useState<{ name: string; desc: string; unit: string; id: string }[]>([
    { name: '', desc: '', unit: '', id: '' },
  ]);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (columns.length > 0) {
      setFormFields(columns.map((column) => ({ ...column, name: column.headerName, unit: column.unit })));
    }
  }, [columns]);
  const columnOptions = [
    { name: 'VO1', desc: 'Merač tepla (VO1)', units: ['kJ', 'MJ', 'GJ', 'kWh', 'MWh', 'GWh', 'kcal', 'Mcal', 'Gcal'] },
    { name: 'VO2', desc: 'Merač tepla (VO2)', units: ['kJ', 'MJ', 'GJ', 'kWh', 'MWh', 'GWh', 'kcal', 'Mcal', 'Gcal'] },
    { name: 'VO3', desc: 'Merač tepla (VO3)', units: ['kJ', 'MJ', 'GJ', 'kWh', 'MWh', 'GWh', 'kcal', 'Mcal', 'Gcal'] },
    { name: 'VO4', desc: 'Merač tepla (VO4)', units: ['kJ', 'MJ', 'GJ', 'kWh', 'MWh', 'GWh', 'kcal', 'Mcal', 'Gcal'] },
    { name: 'VO5', desc: 'Merač tepla (VO5)', units: ['kJ', 'MJ', 'GJ', 'kWh', 'MWh', 'GWh', 'kcal', 'Mcal', 'Gcal'] },
    { name: 'VO6', desc: 'Merač tepla (VO6)', units: ['kJ', 'MJ', 'GJ', 'kWh', 'MWh', 'GWh', 'kcal', 'Mcal', 'Gcal'] },
    { name: 'VO7', desc: 'Merač tepla (VO7)', units: ['kJ', 'MJ', 'GJ', 'kWh', 'MWh', 'GWh', 'kcal', 'Mcal', 'Gcal'] },
    { name: 'VO8', desc: 'Merač tepla (VO8)', units: ['kJ', 'MJ', 'GJ', 'kWh', 'MWh', 'GWh', 'kcal', 'Mcal', 'Gcal'] },
    {
      name: 'MT TUV',
      desc: 'Merač tepla pre TUV',
      units: ['kJ', 'MJ', 'GJ', 'kWh', 'MWh', 'GWh', 'kcal', 'Mcal', 'Gcal'],
    },
    { name: 'vpv TUV', desc: 'Vodomer pre výrobu TUV', units: ['m3'] },
    { name: 'VnDVS', desc: 'Vodomer na dopúťanie vykurovacieho systému', units: ['m3'] },
    { name: 'VCH', desc: 'Vodomer chladenia', units: ['m3'] },
    { name: 'VpZ', desc: 'Vodomer pre záhradu', units: ['m3'] },
    { name: 'MT VZT', desc: 'Merač tepla VZT', units: ['kJ', 'MJ', 'GJ', 'kWh', 'MWh', 'GWh', 'kcal', 'Mcal', 'Gcal'] },
    { name: 'Elektro', desc: 'Elektromer', units: ['kWh'] },
    { name: 'Plyn', desc: 'Plynomer', units: ['m3', 'kWh'] },
  ];

  const hanldeChange = (event, index) => {
    let { name, value } = event.target;
    let actualFormFields = [...formFields];
    actualFormFields[index][name] = value;
    setFormFields(actualFormFields);
  };
  const onChange = (columnID, attribute, value) => {
    setFormFields((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnID
          ? {
              ...column,
              [attribute]: value,
              ...(attribute === 'name' && columnOptions.find((option) => option.name === value)),
            }
          : column
      )
    );
  };
  const handleUnitChange = (event) => {
    let { name, value } = event.target;
    setFormFields((prev) => prev.map((column) => (column.name === name ? { ...column, unit: value } : column)));
  };
  const submit = (e) => {
    e.preventDefault();

    const newColumns = formFields.map((column) => ({
      id: column.id,
      field: column.name,
      headerName: column.name,
      unit: column.unit,
      desc: column.desc,
    }));
    if (existDuplicateColumn(newColumns)) {
      dispatch(showMessage({ message: 'Vyskytol sa duplicitný stĺpec' }));
      return;
    }
    try {
      const boilerRef = doc(db, 'boilers', deviceID);
      const updatedColumnsArray = [...newColumns];
      updateDoc(boilerRef, { monthTable: { columns: updatedColumnsArray, rows: addEmptyValueForRows() } });
      setColumns(updatedColumnsArray);
      close();
    } catch (error) {
      dispatch(showMessage({ message: 'Ups, vyskytla sa chyba ' + error }));
    }
    dispatch(getBoiler(deviceID || ''));
    dispatch(showMessage({ message: 'Zmeny boli úspešne uložené' }));
  };

  const addFields = () => {
    let object = {
      id: crypto.randomUUID(),
      name: '',
      unit: '',
      desc: '',
      sortable: false,
    };

    setFormFields([...formFields, object]);
  };
  const addEmptyValueForRows = () => {
    const newColumns = formFields.map((column) => column.name);
    const updatedRows: {}[] = [];
    for (let i = 0; i < rows.length; i++) {
      var updatedRow = { ...rows[i] };
      for (let j = 0; j < newColumns.length; j++) {
        if (updatedRow[newColumns[j]] !== '-' && updatedRow[newColumns[j]] === undefined) {
          updatedRow[newColumns[j]] = '-';
        }
      }
      updatedRows.push(updatedRow);
    }
    return updatedRows;
  };

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };
  const existDuplicateColumn = (columns) => {
    const names = new Set();
    for (let column of columns) {
      if (names.has(column.field)) {
        return true;
      }
      names.add(column.field);
    }
    return false;
  };
  return (
    <Drawer anchor="right" open={isOpen} onClose={close}>
      <div className="max-w-[98vw] overflow-x-scroll min-h-full">
        <List className="w-[550px]">
          <ListItem>
            <ListItemText primary="Upravovanie stĺpcov" />
          </ListItem>
          <form onSubmit={submit}>
            {formFields.map((field, index) => {
              const actualColumnOption = columnOptions.find((item) => item.name === field.name) || {
                name: field.name,
                desc: 'todo',
                units: null,
              };
              return (
                <ListItem key={index}>
                  <Autocomplete
                    className="w-[165px] "
                    disablePortal
                    freeSolo
                    options={columnOptions} //@ts-ignore
                    getOptionLabel={(option) => option.name} //@ts-ignore
                    value={actualColumnOption}
                    inputValue={field.name}
                    onInputChange={(event, value) => {
                      onChange(field.id, 'name', value);
                    }}
                    renderOption={(_props, option) => <li {..._props}>{option.name}</li>}
                    renderInput={(params) => <TextField {...params} label="Názov" name={field.name} />}
                  />

                  <TextField
                    type="text"
                    label="Vysvetlivka"
                    value={field.desc || ''}
                    name={field.desc}
                    onChange={(e) => onChange(field.id, 'desc', e.target.value)}
                    className="w-[255px] "
                  />
                  <FormControl className="w-[9rem]">
                    <InputLabel id="choice-label">Jednotka</InputLabel>
                    <Select
                      labelId="choice-label"
                      id="choice"
                      label="Jednotka"
                      name={field.name}
                      value={field.unit}
                      onChange={(e) => handleUnitChange(e)}
                    >
                      {actualColumnOption?.units ? (
                        actualColumnOption?.units?.map((unit) => <MenuItem value={unit.toLowerCase()}>{unit}</MenuItem>)
                      ) : (
                        <>
                          {' '}
                          <MenuItem value="mwh">MWh</MenuItem>
                          <MenuItem value="kwh">kWh</MenuItem>
                          <MenuItem value="gj">GJ</MenuItem>
                          <MenuItem value="m3">m³</MenuItem>
                        </>
                      )}
                    </Select>
                  </FormControl>

                  <Button onClick={() => removeFields(index)}>
                    <FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
                  </Button>
                </ListItem>
              );
            })}
          </form>
          <ListItem>
            <Button onClick={addFields} className="mx-auto">
              <FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>
            </Button>
          </ListItem>
          <br />
          <ListItem className="flex justify-end gap-12 sticky bottom-0 z-50 bg-white">
            <Button variant="contained" onClick={submit} color="primary">
              Uložiť
            </Button>
            <Button variant="contained" onClick={close} color="secondary">
              Zrušiť
            </Button>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}

export default AddColumnModal;
