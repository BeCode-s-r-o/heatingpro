import FusePageSimple from '@app/core/PageSimple';
import useThemeMediaQuery from '@app/hooks/useThemeMediaQuery';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { showMessage } from 'app/store/slices/messageSlice';
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import moment from 'moment';
import 'moment/locale/sk';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

moment.locale('sk');

function ActivitiesPage() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [effectivityConstant, setEffectivityConstant] = useState({});
  const dispatch = useDispatch();

  const fillInMissingMonths = (data) => {
    const currentYear = moment().year();
    const currentMonth = moment().month();

    const filledData = { ...data };
    const firstYear = parseInt(Object.keys(filledData).sort((a, b) => a - b)[0], 10);

    // Create years only from firstYear to currentYear
    for (let year = firstYear; year <= currentYear; year += 1) {
      if (!filledData[year]) {
        filledData[year] = {};
      }

      // If it's the firstYear, start from the month in the data or from January if it's not
      const startMonth =
        year === firstYear ? parseInt(Object.keys(filledData[year]).sort((a, b) => a - b)[0] || '0', 10) : 0;
      // If it's the currentYear, stop at currentMonth, else go up to December
      const endMonth = year === currentYear ? currentMonth : 11;

      // Fill in the missing months
      for (let month = startMonth; month <= endMonth; month += 1) {
        if (filledData[year][month] === undefined) {
          filledData[year][month] = 0;
        }
      }
    }

    return filledData;
  };
  useEffect(() => {
    const getEffectivityConstant = async () => {
      const docSnap = await getDocs(collection(getFirestore(), 'effectivityConstant'));

      let data = {};
      docSnap.forEach((document) => {
        data = {
          ...data,
          [document.id]: document.data(),
        };
      });

      setEffectivityConstant(fillInMissingMonths(data));
    };

    getEffectivityConstant();
  }, []);

  const handleSaveEffectivityConstant = async () => {
    const effectivityRef = collection(getFirestore(), 'effectivityConstant');
    Object.entries(effectivityConstant).forEach(async ([year, months]) => {
      await setDoc(doc(effectivityRef, year), months);
    });
    dispatch(showMessage({ message: 'Spalné teplo zemného plynu bolo uložené' }));
  };

  return (
    <>
      <FusePageSimple
        content={
          <>
            <div className="flex flex-col flex-auto px-24 py-40 sm:px-64 sm:pt-72 sm:pb-80">
              <Typography className="text-4xl font-extrabold tracking-tight leading-none">Nastavenia</Typography>
              <List className="mt-32">
                {Object.entries(effectivityConstant)
                  .reverse()
                  .map(([year, months]) =>
                    Object.entries(months)
                      .reverse()
                      .map(([monthIndex, value]) => {
                        const currentYear = moment().year();
                        const currentMonth = moment().month();
                        const isPast =
                          (currentYear === parseInt(year, 10) && currentMonth > parseInt(monthIndex, 10)) ||
                          currentYear > parseInt(year, 10);

                        return (
                          <ListItem key={`${year}-${monthIndex}`}>
                            <TextField
                              className="w-full"
                              type="text"
                              style={value ? { color: 'red' } : {}}
                              label={`Spalné teplo zemného plynu - ${moment
                                .months()
                                [parseInt(monthIndex, 10)].toUpperCase()} ${year}`}
                              value={value}
                              name="name"
                              disabled={isPast}
                              onChange={({ target: { value: val } }) => {
                                const newEffectivityConstant = { ...effectivityConstant };
                                newEffectivityConstant[year][monthIndex] = Number(val);
                                setEffectivityConstant(newEffectivityConstant);
                              }}
                            />
                          </ListItem>
                        );
                      })
                  )}

                <ListItem className="flex justify-end gap-12 sticky bottom-0 z-50">
                  <Button
                    className="whitespace-nowrap"
                    variant="contained"
                    color="primary"
                    onClick={handleSaveEffectivityConstant}
                  >
                    Uložiť
                  </Button>
                </ListItem>
              </List>
            </div>
          </>
        }
        scroll={isMobile ? 'normal' : 'page'}
      />
    </>
  );
}

export default ActivitiesPage;
