import FusePageCarded from '@app/core/FusePageCarded';
import { styled } from '@mui/material/styles';
import DemoContent from '../../shared-components/DemoContent';
import DemoHeader from '../../shared-components/DemoHeader';

const Root = styled(FusePageCarded)({
  '& .FusePageCarded-header': {},
  '& .FusePageCarded-toolbar': {},
  '& .FusePageCarded-content': {},
  '& .FusePageCarded-sidebarHeader': {},
  '& .FusePageCarded-sidebarContent': {},
});

function CardedFullWidthContentScrollComponent() {
  return <Root header={<DemoHeader />} content={<DemoContent />} scroll="content" />;
}

export default CardedFullWidthContentScrollComponent;
