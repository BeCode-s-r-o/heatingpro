import FuseScrollbars from '@app/core/Scrollbars';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { selectContrastMainTheme } from 'app/store/slices/settingsSlice';
import clsx from 'clsx';
import { useSelector } from 'react-redux';

function FusePageCardedSidebarContent(props) {
  const theme = useTheme();
  const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.main));

  return (
    <FuseScrollbars enable={props.innerScroll}>
      {props.header && (
        <ThemeProvider theme={contrastTheme}>
          <div
            className={clsx(
              'FusePageCarded-sidebarHeader',
              props.variant,
              props.sidebarInner && 'FusePageCarded-sidebarHeaderInnerSidebar'
            )}
          >
            {props.header}
          </div>
        </ThemeProvider>
      )}

      {props.content && <div className="FusePageCarded-sidebarContent">{props.content}</div>}
    </FuseScrollbars>
  );
}

export default FusePageCardedSidebarContent;
