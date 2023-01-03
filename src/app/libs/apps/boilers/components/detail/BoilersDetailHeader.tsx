import FuseSvgIcon from '@app/core/SvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useParams } from 'react-router-dom';
import { TBoiler } from 'src/@app/types/TBoilers';
interface Props {
  data: TBoiler;
}

export const BoilersDetailHeader = ({ data }: Props) => {
  const { id } = useParams();
  return (
    <div className="flex flex-col w-full px-24 sm:px-32">
      <div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
        <div className="flex flex-auto items-center min-w-0">
          <div className="flex flex-col min-w-0 mx-16">
            <Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
              Bojler {id || ''}
            </Typography>

            <div className="flex items-center">
              <FuseSvgIcon size={20} color="action">
                heroicons-solid:clock
              </FuseSvgIcon>
              <Typography className="mx-6 leading-6 truncate" color="text.secondary">
                {/* TODO - with real data */}
                Posledná aktualizácia: {new Date().toLocaleString()}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
          <Button className="whitespace-nowrap" variant="contained" color="primary">
            Zmeniť poradie stĺpcov
          </Button>
          <Button
            className="whitespace-nowrap"
            variant="contained"
            color="secondary"
            startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
          >
            Nastavenia
          </Button>
        </div>
      </div>
    </div>
  );
};
