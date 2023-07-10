import FusePageSimple from '@app/core/PageSimple';
import useThemeMediaQuery from '@app/hooks/useThemeMediaQuery';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

function ActivitiesPage() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [effectivityConstant, setEffectivityConstant] = useState(0);

  useEffect(() => {
    const getEffectivityConstant = async () => {
      const docRef = doc(getFirestore(), 'effectivityConstant', 'data');
      const docSnap = await getDoc(docRef);
      setEffectivityConstant(docSnap.data().effectivityConstant);
    };
    getEffectivityConstant();
  }, []);

  const handleSaveEffectivityConstant = async () => {
    const effectivityRef = collection(getFirestore(), 'effectivityConstant');
    setDoc(doc(effectivityRef, 'data'), { effectivityConstant });
  };

  return (
    <>
      <FusePageSimple
        content={
          <>
            <div className="flex flex-col flex-auto px-24 py-40 sm:px-64 sm:pt-72 sm:pb-80">
              <Typography className="text-4xl font-extrabold tracking-tight leading-none">Nastavenia</Typography>
              <List className="mt-32">
                <ListItem>
                  <TextField
                    className="w-full"
                    type="text"
                    label="Spalné teplo zemného plynu"
                    value={effectivityConstant}
                    name="name"
                    onChange={({ target: { value } }) => setEffectivityConstant(value)}
                  />
                </ListItem>

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
