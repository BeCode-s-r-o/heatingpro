import { styled } from '@mui/material/styles';
import FusePageSimple from 'src/@app/core/FusePageSimple';

export const Wrapper = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));
