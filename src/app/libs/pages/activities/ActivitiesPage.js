import FusePageSimple from '@app/core/PageSimple';
import useThemeMediaQuery from '@app/hooks/useThemeMediaQuery';
import Typography from '@mui/material/Typography';

function ActivitiesPage() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <FusePageSimple
      content={
        <div className="flex flex-col flex-auto px-24 py-40 sm:px-64 sm:pt-72 sm:pb-80">
          <Typography className="text-4xl font-extrabold tracking-tight leading-none">Nastavenia</Typography>
        </div>
      }
      scroll={isMobile ? 'normal' : 'page'}
    />
  );
}

export default ActivitiesPage;
