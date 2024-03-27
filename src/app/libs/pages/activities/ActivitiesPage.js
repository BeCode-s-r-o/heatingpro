import FusePageSimple from '@app/core/PageSimple';
import useThemeMediaQuery from '@app/hooks/useThemeMediaQuery';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { showMessage } from 'app/store/slices/messageSlice';
import { selectUser } from 'app/store/userSlice';
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import moment from 'moment';
import 'moment/locale/sk';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

moment.locale('sk');

function ActivitiesPage() {
  const { data: user } = useSelector(selectUser);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [effectivityConstant, setEffectivityConstant] = useState({});
  const dispatch = useDispatch();

  const fillInMissingMonths = (data) => {
    const currentYear = moment().year();
    const currentMonth = moment().month();

    const filledData = { ...data };
    const firstYear = parseInt(Object.keys(filledData).sort((a, b) => a - b)[0], 10);

    for (let year = firstYear; year <= currentYear; year += 1) {
      if (!filledData[year]) {
        filledData[year] = {};
      }

      const startMonth =
        year === firstYear ? parseInt(Object.keys(filledData[year]).sort((a, b) => a - b)[0] || '0', 10) : 0;

      const endMonth = year === currentYear ? currentMonth : 11;

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

    // Convert the value to float with decimal dot
    const toFloatWithDot = (value) => {
      if (typeof value === 'string') {
        value = value.replace(',', '.');
      }
      return parseFloat(value);
    };

    Object.entries(effectivityConstant).forEach(async ([year, months]) => {
      // Convert months to float with decimal dot
      const convertedMonths = {};
      Object.entries(months).forEach(([key, val]) => {
        convertedMonths[key] = toFloatWithDot(val);
      });

      await setDoc(doc(effectivityRef, year), convertedMonths);
    });
    dispatch(showMessage({ message: 'Spalné teplo zemného plynu bolo uložené' }));
  };

  return (
    <>
      <FusePageSimple
        content={
          <>
            <div
              style={{ background: 'url(/assets/images/backgrounds/white.jpg)', backgroundSize: 'cover' }}
              className="flex flex-col flex-auto px-24 py-40 sm:px-64 sm:pt-72 sm:pb-80"
            >
              <Typography className="text-4xl font-extrabold tracking-tight leading-none">Nastavenia</Typography>
              <Typography className="mt-3 mb-5 text-2xl font-extrabold tracking-tight leading-none">
                Spalné teplo zemného plynu
              </Typography>
              <Typography className="tracking-tight leading-none">
                Zaznamenanie hodnôt o Spalnom teple zemného plynu.
                <br /> Informácie o aktuálnych hodnotách Spalného tepla zemného plynu nájdete na linku tu:
                <br />
                <a
                  href="https://www.spp-distribucia.sk/dodavatelia/informacie/zlozenie-zemneho-plynu-a-emisny-faktor/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Zloženie zemného plynu a emisný faktor - SPP Distribúcia
                </a>
              </Typography>
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
                              className={`w-full ${!value ? 'red-color' : ''}`}
                              label={`Spalné teplo zemného plynu - ${moment
                                .months()
                                [parseInt(monthIndex, 10)].toUpperCase()} ${year}`}
                              value={value}
                              name={`${year}-${monthIndex}`}
                              disabled={isPast && user?.role !== 'admin'}
                              onChange={({ target: { value: val } }) => {
                                const newEffectivityConstant = { ...effectivityConstant };
                                newEffectivityConstant[year][monthIndex] = val;
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
