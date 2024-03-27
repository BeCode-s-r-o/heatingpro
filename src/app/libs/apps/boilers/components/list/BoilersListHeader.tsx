import FuseSvgIcon from '@app/core/SvgIcon';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { selectUser } from 'app/store/userSlice';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AddNewBoilerModal from './AddNewBoilerModal';

export const BoilersListHeader = () => {
  const { data: user } = useSelector(selectUser);
  const [showAddNewBoilerModal, setShowAddNewBoilerModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showEffectivityConstant, setShowEffectivityConstant] = useState<any>(false);

  useEffect(() => {
    const getEffectivityConstant = async () => {
      const docSnap = await getDoc(doc(getFirestore(), 'effectivityConstant', moment().year().toString()));
      const data = docSnap.data();
      if (user?.role === 'admin') {
        setShowEffectivityConstant(!data?.[moment().month()]);
      }
    };

    if (moment().date() > 3) {
      getEffectivityConstant();
    }
  }, []);

  return (
    <div
      style={{ background: 'url(/assets/images/backgrounds/white.jpg)', backgroundSize: 'cover' }}
      className="flex flex-col w-full px-24 sm:px-32"
    >
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
        <div className="flex flex-auto items-center min-w-0">
          <Avatar className="flex-0 w-64 h-64" alt="user photo" src={user?.avatar || undefined}>
            {user?.name[0]}
          </Avatar>
          <div className="flex flex-col min-w-0 mx-16">
            <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
              {`Vitajte, ${user?.name || ''}!`}
            </Typography>
          </div>
        </div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          {(user?.role === 'admin' || user?.role === 'instalater') && (
            <Button
              className="whitespace-nowrap"
              variant="contained"
              color="primary"
              startIcon={<FuseSvgIcon size={20}>heroicons-solid:plus</FuseSvgIcon>}
              onClick={() => {
                setShowAddNewBoilerModal(true);
                setShowWarning(true);
              }}
            >
              Pridať systém
            </Button>
          )}

          <AddNewBoilerModal
            isOpen={showAddNewBoilerModal}
            toggleOpen={() => setShowAddNewBoilerModal((prev) => !prev)}
          />
          <Dialog
            open={showWarning}
            onClose={() => setShowWarning(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Pozor</DialogTitle>
            <DialogContent>
              <DialogContentText style={{ whiteSpace: 'pre-line' }} id="alert-dialog-description">
                <p className="mb-10">
                  Pre úspešnú inštaláciu je potrebné aby ste mali k dispozícií <strong>adresu </strong> a{' '}
                  <strong>telefónne číslo </strong>SIM karty kotolne.
                </p>
                <p className="mb-10">
                  Ako prvý krok pred pridaním systému do aplikácie je potrebné aby ste nakonfigurovali manuálne ID
                  kotolne, teda pridelili novej kotolni ID podľa dohodnutého systému evidencie na linku{' '}
                  <a
                    className="font-bold"
                    href="https://docs.google.com/spreadsheets/d/1rg0WZDZ892C6qCJua1AiJwu9qS-3-t_l/edit#gid=817262613"
                    target="_blank"
                    style={{ background: '#fff', color: 'red' }}
                  >
                    TU
                  </a>
                  . To spravíte tak, že napíšete SMS na telefónne číslo kotolne v tvare: **0000*dns*0015A* s tým, že
                  0000 je ID kotolne od výrobcu vždy rovnaké a 0015A je príklad nového ID ktoré mu pridelíte na základe
                  tabuľky evidencie ID kotolní. Po použití vybraného ID je potrebné aby ste{' '}
                  <strong>vyznačili v tabuľke ID ako obsadené</strong>. Po zmene ID kotolne vám príde z kotolne
                  potvrdzovacia SMS na základe čoho môžete už pristúpiť k vyplneniu formuláru s novonakonfigurovaným ID.
                </p>
                <p>
                  {' '}
                  <strong className="text-red">Upozornenie: </strong>Pozor pri zadávaní ID a telefónneho čísla kotolne (
                  <strong> vypĺňať v tvare +421</strong> ) ktoré už nie je po pridaní systému možné meniť.
                </p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                className="whitespace-nowrap w-fit mb-2 mr-8"
                color="primary"
                autoFocus
                onClick={() => setShowWarning(false)}
              >
                Zatvoriť
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={showEffectivityConstant}
            onClose={() => setShowEffectivityConstant(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title" color="error">
              Pozor
            </DialogTitle>
            <DialogContent>
              <DialogContentText style={{ whiteSpace: 'pre-line' }} id="alert-dialog-description">
                <p className="mb-10">Chýbajúca konštanta spalného tepla zemného plynu pre tento mesiac</p>
                <p className="mb-10">
                  Prosíme zadajte konštantu v <a href="/nastavenia">nastaveniach</a>
                </p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                className="whitespace-nowrap w-fit mb-2 mr-8"
                color="primary"
                autoFocus
                onClick={() => setShowEffectivityConstant(false)}
              >
                Zatvoriť
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
