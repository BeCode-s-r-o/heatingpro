import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { useState } from 'react';
import { useTimeout } from 'src/@app/hooks';

interface LoadingProps {
  delay?: number;
}

const Loading = ({ delay }: LoadingProps) => {
  const [showLoading, setShowLoading] = useState(!delay);

  useTimeout(() => {
    setShowLoading(true);
  }, delay);

  return (
    <div className={clsx('flex flex-1 flex-col items-center justify-center p-24', !showLoading && 'hidden')}>
      <Typography className="text-13 sm:text-20 font-medium -mb-16" color="text.secondary">
        Načítavam...
      </Typography>
      <Box
        id="spinner"
        sx={{
          '& > div': {
            backgroundColor: 'palette.secondary.main',
          },
        }}
      >
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </Box>
    </div>
  );
};

export default Loading;
