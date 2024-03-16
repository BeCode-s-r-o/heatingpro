import { TBoiler } from '@app/types/TBoilers';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import * as Sentry from '@sentry/react';
import axiosInstance from 'app/config/axiosConfig';
import { AppDispatch } from 'app/store/index';
import { showMessage } from 'app/store/slices/messageSlice';
import { doc, updateDoc } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { db } from 'src/firebase-config';
import { DragNDropColumn } from './DragNDropColumn';

interface Props {
  boiler: TBoiler;
  isOpen: boolean;
  toggleOpen: () => void;
  columnsValues: any[];
}
function SettingsModal({ boiler, isOpen, toggleOpen, columnsValues }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const [arrayOfLimits, setArrayOfLimits] = useState<any[]>([]);
  const [tableColumns, setTableColumns] = useState(boiler?.columns || []);
  const dragItem = useRef<any>(null);
  const [changedColumnIds, setChangedColumnIds] = useState<string[]>([]);
  const dragOverItem = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTableColumns(boiler?.columns || []);
  }, [boiler.columns]);

  const columnOptions = [
    { name: 'K1P', desc: 'Kotol 1 prívod', unit: '°C' },
    { name: 'K2P', desc: 'Kotol 2 prívod', unit: '°C' },
    { name: 'K3P', desc: 'Kotol 3 prívod', unit: '°C' },
    { name: 'K4P', desc: 'Kotol 4 prívod', unit: '°C' },
    { name: 'K5P', desc: 'Kotol 5 prívod', unit: '°C' },
    { name: 'VOP1', desc: 'Vykurovací okruh prívod 1', unit: '°C' },
    { name: 'VOS1', desc: 'Vykurovací okruh spiatočka 1', unit: '°C' },
    { name: 'VOP2', desc: 'Vykurovací okruh prívod 2', unit: '°C' },
    { name: 'VOS2', desc: 'Vykurovací okruh spiatočka 2', unit: '°C' },
    { name: 'VOP3', desc: 'Vykurovací okruh prívod 3', unit: '°C' },
    { name: 'VOS3', desc: 'Vykurovací okruh spiatočka 3', unit: '°C' },
    { name: 'VOP4', desc: 'Vykurovací okruh prívod 4', unit: '°C' },
    { name: 'VOS4', desc: 'Vykurovací okruh spiatočka 4', unit: '°C' },
    { name: 'VOP5', desc: 'Vykurovací okruh prívod 5', unit: '°C' },
    { name: 'VOS5', desc: 'Vykurovací okruh spiatočka 5', unit: '°C' },
    { name: 'TPP', desc: 'Teplota prívod primár', unit: '°C' },
    { name: 'TSP', desc: 'Teplota spiatočka primár', unit: '°C' },
    { name: 'VT', desc: 'Vonkajšia teplota', unit: '°C' },
    { name: 'T TUV', desc: 'Teplota teplej užitkovej vody', unit: '°C' },
    { name: 'T TUVc', desc: 'Teplota TUV cirkulácia', unit: '°C' },
    { name: 'S CO2', desc: 'Snímač CO2', unit: '0/1' },
    { name: 'TVS', desc: 'Tlak vykurovacieho systému', unit: 'bar' },
    { name: 'S TP', desc: 'Snímač tlaku plynu', unit: 'bar' },
    { name: 'S ZK', desc: 'Snímač zaplavenia kotolne', unit: '0/1' },
    { name: 'S UP', desc: 'Snímač úniku plynu', unit: '0/1' },
    { name: 'SPK', desc: 'Sumárna porucha kotolne', unit: '0/1' },
  ];

  const handleSort = () => {
    let _tableColums = [...tableColumns];

    const draggedItemContent = _tableColums.splice(dragItem.current, 1)[0];

    _tableColums.splice(dragOverItem.current, 0, draggedItemContent);
    let changedOrderIds: string[] = [];

    const changedOrders = _tableColums.map((i, idx) => {
      changedOrderIds.push(i.id);
      if (i.order < Number(dragOverItem.current)) {
        return { ...i, order: idx };
      }
      if (i.order == Number(dragItem.current)) {
        return { ...i, order: Number(dragOverItem.current) };
      }
      if (i.order >= Number(dragOverItem.current)) {
        return { ...i, order: idx };
      }
      return i;
    });
    changedOrderIds.push(draggedItemContent.id);
    setChangedColumnIds((prev) => {
      return Array(...new Set([...prev, ...changedOrderIds]));
    });

    setTableColumns(changedOrders);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const handleChange = useCallback(
    (columnAccessor, attribute, value) => {
      const col = tableColumns.find((column) => column.accessor === columnAccessor);
      setChangedColumnIds((prev) => {
        if (col) {
          //@ts-ignore
          return prev.includes(col.id) ? prev : [...prev, col.id];
        }
        return prev;
      });
      const isVT = col?.columnName === 'VT';

      if ((attribute === 'min' && value < 0 && !isVT) || (attribute === 'max' && value > 99)) {
        return;
      }

      setTableColumns((prevColumns) =>
        prevColumns.map((column) => {
          if (column.accessor == columnAccessor) {
            if (attribute === 'columnName') {
              const constantAttributes = columnOptions.find((option) => option.name === value);
              return {
                ...column,
                [attribute]: value,
                ...constantAttributes,
              };
            }

            return {
              ...column,
              [attribute]: value,
            };
          }
          return column;
        })
      );

      if (attribute === 'min' || attribute === 'max') {
        setArrayOfLimits((prevLimits) =>
          prevLimits.includes(columnAccessor) ? prevLimits : [...prevLimits, columnAccessor]
        );
      }
    },
    [tableColumns]
  );

  const sendSmsToChangeLimits = async (limits) => {
    const data = {
      phoneNumber: boiler?.phoneNumber,
      boilerId: boiler?.id,
      limits: limits,
    };

    try {
      await axiosInstance.post('change-limits', data);
    } catch (error) {
      Sentry.captureException(error);
      dispatch(showMessage({ message: 'Vyskytla sa chyba pri nastavovaní periódy!' }));
    }
  };

  const saveColumnsForBoilerInFirebase = async () => {
    setLoading(true);
    try {
      if (arrayOfLimits.length > 0) {
        const arrayOfLimitsForSms = arrayOfLimits.map((accessor) => {
          const column = tableColumns.find((col) => col.accessor === accessor);

          if (!column) return; // Early return if column not found

          let min: string | number = String(column.min).replaceAll(',', '.');
          let max: string | number = String(column.max).replaceAll(',', '.');

          if (column.unit.toLowerCase() === 'bar' || column.unit.toLowerCase() === 'bary') {
            min = parseFloat(min) * 10;
            max = parseFloat(max) * 10;
          } else {
            // Ensure single digit numbers are prefixed with '0'
            min = +min < 10 && +min > -10 ? `0${min}` : min;
            max = +max < 10 && +max > -10 ? `0${max}` : max;
          }

          // Construct the limit string directly to avoid redundant code
          const limit = `${min}${max}`;

          return {
            columnAccessor: column.accessor,
            limit,
          };
        });

        await sendSmsToChangeLimits(arrayOfLimitsForSms);
      }

      const promises = changedColumnIds.map(async (colId) => {
        //@ts-ignore
        const changedCol = tableColumns.find((i) => i.id === colId);
        if (changedCol) {
          const ref = doc(db, 'dailyTableColumns', changedCol.id);
          return await updateDoc(ref, changedCol);
        }
      });

      await Promise.all(promises);
      setLoading(false);
      toggleOpen();
      dispatch(showMessage({ message: 'Zmeny boli uložené' }));
    } catch (error) {
      setLoading(false);
      dispatch(showMessage({ message: 'Vyskytol sa nejaký problém' }));
    }
  };

  return (
    <Drawer anchor="right" open={isOpen} onClose={toggleOpen}>
      <div className="max-w-[98vw] overflow-x-scroll">
        <List className="w-[850px]">
          <ListItem>
            <ListItemText
              primary="Nastavenie stĺpcov"
              secondary="Pri nastavovaní limitov (minimum a maximum) je technicky možné nastaviť maximálne 15 stĺpcov naraz, teda 15
            riadkom viete nastaviť zvlášť 15 minimum a 15 maximum hodnôt. V prípade, že nastavujete viac ako 15tim
            riadkom limity naraz, po zmene prvých 15 kliknite na uložiť a potom pristúpte k nastaveniu ďalších
            znovukliknutím na tlačidlo Nastaviť stĺpce."
            />
          </ListItem>

          {tableColumns?.map((column, index) => {
            return (
              <DragNDropColumn
                columnOptions={columnOptions}
                valueFromPlaceInSms={columnsValues?.[Number(column.accessor)]}
                key={index}
                column={column}
                index={index}
                onChange={handleChange}
                onDragStart={() => (dragItem.current = index)}
                onDragEnter={() => (dragOverItem.current = index)}
                onDragEnd={handleSort}
              />
            );
          })}

          <div className="flex justify-end gap-12 sticky bottom-0 z-50 bg-white ">
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={saveColumnsForBoilerInFirebase}
            >
              {loading ? 'Ukladám...' : 'Uložiť'}
            </Button>
            <Button className="whitespace-nowrap" variant="contained" color="secondary" onClick={toggleOpen}>
              Zrušiť
            </Button>
          </div>
        </List>
      </div>
    </Drawer>
  );
}

export default SettingsModal;
