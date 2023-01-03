import FusePageSimple from '@app/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import DemoContent from '../../shared-components/DemoContent';
import DemoHeader from '../../shared-components/DemoHeader';

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-header': {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: theme.palette.divider,
  },
  '& .FusePageSimple-toolbar': {},
  '& .FusePageSimple-content': {},
  '& .FusePageSimple-sidebarHeader': {},
  '& .FusePageSimple-sidebarContent': {},
}));

function SimpleFullWidthContentScrollComponent() {
  return <Root header={<DemoHeader />} content={<DemoContent />} scroll="content" />;
}

export default SimpleFullWidthContentScrollComponent;
