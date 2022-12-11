import { FuseScrollbars } from "@app/core";
import GlobalStyles from "@mui/material/GlobalStyles";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import * as PropTypes from "prop-types";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import FusePageCardedHeader from "./FusePageCardedHeader";
import FusePageCardedSidebar from "./FusePageCardedSidebar";

const Root = styled("div")(({ theme, ...props }) => ({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  minHeight: "100%",
  position: "relative",
  flex: "1 1 auto",
  width: "100%",
  height: "auto",
  backgroundColor: theme.palette.background.default,

  "& .FusePageCarded-scroll-content": {
    height: "100%",
  },

  "& .FusePageCarded-wrapper": {
    display: "flex",
    flexDirection: "row",
    flex: "1 1 auto",
    zIndex: 2,
    maxWidth: "100%",
    minWidth: 0,
    height: "100%",
    backgroundColor: theme.palette.background.paper,
    //@ts-ignore
    ...(props.scroll === "content" && {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      overflow: "hidden",
    }),
  },

  "& .FusePageCarded-header": {
    display: "flex",
    flex: "0 0 auto",
  },

  "& .FusePageCarded-contentWrapper": {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 auto",
    overflow: "auto",
    WebkitOverflowScrolling: "touch",
    zIndex: 9999,
  },

  "& .FusePageCarded-toolbar": {
    height: toolbarHeight,
    minHeight: toolbarHeight,
    display: "flex",
    alignItems: "center",
  },

  "& .FusePageCarded-content": {
    flex: "1 0 auto",
  },

  "& .FusePageCarded-sidebarWrapper": {
    overflow: "hidden",
    backgroundColor: "transparent",
    position: "absolute",
    "&.permanent": {
      [theme.breakpoints.up("lg")]: {
        position: "relative",
        marginLeft: 0,
        marginRight: 0,
        transition: theme.transitions.create("margin", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        "&.closed": {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),

          "&.FusePageCarded-leftSidebar": {
            //@ts-ignore
            marginLeft: -props.leftsidebarwidth,
          },
          "&.FusePageCarded-rightSidebar": {
            //@ts-ignore
            marginRight: -props.rightsidebarwidth,
          },
        },
      },
    },
  },

  "& .FusePageCarded-sidebar": {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,

    "&.permanent": {
      [theme.breakpoints.up("lg")]: {
        position: "relative",
      },
    },
    maxWidth: "100%",
    height: "100%",
  },

  "& .FusePageCarded-leftSidebar": {
    //@ts-ignore
    width: props.leftsidebarwidth,

    [theme.breakpoints.up("lg")]: {
      // borderRight: `1px solid ${theme.palette.divider}`,
      // borderLeft: 0,
    },
  },

  "& .FusePageCarded-rightSidebar": {
    //@ts-ignore
    width: props.rightsidebarwidth,

    [theme.breakpoints.up("lg")]: {
      // borderLeft: `1px solid ${theme.palette.divider}`,
      // borderRight: 0,
    },
  },

  "& .FusePageCarded-sidebarHeader": {
    height: headerHeight,
    minHeight: headerHeight,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },

  "& .FusePageCarded-sidebarHeaderInnerSidebar": {
    backgroundColor: "transparent",
    color: "inherit",
    height: "auto",
    minHeight: "auto",
  },

  "& .FusePageCarded-sidebarContent": {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
  },

  "& .FusePageCarded-backdrop": {
    position: "absolute",
  },
}));

const headerHeight = 120;
const toolbarHeight = 64;

const FusePageCarded = forwardRef((props, ref) => {
  // console.info("render::FusePageCarded");
  const leftSidebarRef = useRef(null);
  const rightSidebarRef = useRef(null);
  const rootRef = useRef(null);

  useImperativeHandle(ref, () => ({
    rootRef,
    toggleLeftSidebar: (val) => {
      //@ts-ignore
      leftSidebarRef.current.toggleSidebar(val);
    },
    toggleRightSidebar: (val) => {
      //@ts-ignore
      rightSidebarRef.current.toggleSidebar(val);
    },
  }));

  return (
    <>
      <GlobalStyles
        styles={(theme) => ({
          //@ts-ignore
          ...(props.scroll !== "page" && {
            "#fuse-toolbar": {
              position: "static",
            },
            "#fuse-footer": {
              position: "static",
            },
          }),
          //@ts-ignore
          ...(props.scroll === "page" && {
            "#fuse-toolbar": {
              position: "sticky",
              top: 0,
            },
            "#fuse-footer": {
              position: "sticky",
              bottom: 0,
            },
          }),
        })}
      />
      <Root
        className={clsx(
          "FusePageCarded-root",
          //@ts-ignore
          `FusePageCarded-scroll-${props.scroll}`,
          //@ts-ignore
          props.className
        )}
        ref={rootRef}
        //@ts-ignore
        scroll={props.scroll} //@ts-ignore
        leftsidebarwidth={props.leftSidebarWidth} //@ts-ignore
        rightsidebarwidth={props.rightSidebarWidth}
      >
        {
          //@ts-ignore
          props.header && <FusePageCardedHeader header={props.header} />
        }

        <div className="flex flex-auto flex-col container z-10 h-full shadow-1 rounded-t-16 relative overflow-hidden">
          <div className="FusePageCarded-wrapper">
            {
              //@ts-ignore
              props.leftSidebarContent && (
                <FusePageCardedSidebar
                  //@ts-ignore
                  position="left"
                  //@ts-ignore
                  content={props.leftSidebarContent}
                  //@ts-ignore
                  variant={props.leftSidebarVariant || "permanent"}
                  ref={leftSidebarRef}
                  rootRef={rootRef}
                  //@ts-ignore
                  open={props.leftSidebarOpen}
                  //@ts-ignore
                  onClose={props.leftSidebarOnClose}
                />
              )
            }
            <FuseScrollbars
              className="FusePageCarded-contentWrapper"
              //@ts-ignore
              enable={props.scroll === "content"}
            >
              {
                //@ts-ignore
                props.content && (
                  <div className={clsx("FusePageCarded-content")}>
                    {
                      //@ts-ignore
                      props.content
                    }
                  </div>
                )
              }
            </FuseScrollbars>

            {
              //@ts-ignore
              props.rightSidebarContent && (
                <FusePageCardedSidebar
                  //@ts-ignore
                  position="right"
                  //@ts-ignore
                  content={props.rightSidebarContent}
                  //@ts-ignore
                  variant={props.rightSidebarVariant || "permanent"}
                  ref={rightSidebarRef}
                  rootRef={rootRef}
                  //@ts-ignore
                  open={props.rightSidebarOpen}
                  //@ts-ignore
                  onClose={props.rightSidebarOnClose}
                />
              )
            }
          </div>
        </div>
      </Root>
    </>
  );
});

FusePageCarded.propTypes = {
  //@ts-ignore
  leftSidebarHeader: PropTypes.node,
  leftSidebarContent: PropTypes.node,
  leftSidebarVariant: PropTypes.node,
  rightSidebarContent: PropTypes.node,
  rightSidebarVariant: PropTypes.node,
  header: PropTypes.node,
  content: PropTypes.node,
  contentToolbar: PropTypes.node,
  scroll: PropTypes.oneOf(["normal", "page", "content"]),
  leftSidebarOpen: PropTypes.bool,
  rightSidebarOpen: PropTypes.bool,
  leftSidebarWidth: PropTypes.number,
  rightSidebarWidth: PropTypes.number,
  rightSidebarOnClose: PropTypes.func,
  leftSidebarOnClose: PropTypes.func,
};

FusePageCarded.defaultProps = {
  //@ts-ignore
  classes: {},
  scroll: "page",
  leftSidebarOpen: false,
  rightSidebarOpen: false,
  rightSidebarWidth: 240,
  leftSidebarWidth: 240,
};

export default memo(styled(FusePageCarded)``);
