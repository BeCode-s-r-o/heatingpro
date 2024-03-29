import FuseScrollbars from '@app/core/Scrollbars';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { selectContrastMainTheme } from 'app/store/slices/settingsSlice';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

function FusePageSimpleSidebarContent(props) {
  const theme = useTheme();
  const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.main));

  return (
    <FuseScrollbars enable={props.innerScroll}>
      {props.header && (
        <ThemeProvider theme={contrastTheme}>
          <div className={clsx('FusePageSimple-sidebarHeader', props.variant)}>{props.header}</div>
        </ThemeProvider>
      )}

      {props.content && <div className="FusePageSimple-sidebarContent">{props.content}</div>}
    </FuseScrollbars>
  );
}

export default FusePageSimpleSidebarContent;
