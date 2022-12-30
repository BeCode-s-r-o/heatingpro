import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getWidgets } from './store/widgetsSlice';
import SystemsDashboardHeader from './SystemsDashboardHeader';
import SystemsTab from './tabs/all-systems/SystemsTab';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));

const SystemsDashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // @ts-ignore
    dispatch(getWidgets());
  }, [dispatch]);

  return (
    <Root
      header={<SystemsDashboardHeader />}
      content={
        <div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
          <SystemsTab />
        </div>
      }
    />
  );
};

export default SystemsDashboard;
