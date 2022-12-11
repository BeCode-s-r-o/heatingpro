import { FuseScrollbars } from "@app/core";
import { selectContrastMainTheme } from "@app/store";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import clsx from "clsx";
import { useSelector } from "react-redux";

interface FusePageCardedSidebarContentProps {
  header?: any;
  content?: any;
  variant?: string;
  sidebarInner?: boolean;
  innerScroll?: boolean;
}

function FusePageCardedSidebarContent(
  props: FusePageCardedSidebarContentProps
) {
  const theme = useTheme();
  const contrastTheme = useSelector(
    selectContrastMainTheme(theme.palette.primary.main)
  );

  return (
    //@ts-ignore
    <FuseScrollbars enable={props.innerScroll}>
      {props.header && (
        <ThemeProvider theme={contrastTheme}>
          <div
            className={clsx(
              "FusePageCarded-sidebarHeader",
              props.variant,
              props.sidebarInner && "FusePageCarded-sidebarHeaderInnerSidebar"
            )}
          >
            {props.header}
          </div>
        </ThemeProvider>
      )}

      {props.content && (
        <div className="FusePageCarded-sidebarContent">{props.content}</div>
      )}
    </FuseScrollbars>
  );
}

export default FusePageCardedSidebarContent;
