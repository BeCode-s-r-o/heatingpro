import { FuseScrollbars } from "@app/core";
import GlobalStyles from "@mui/material/GlobalStyles";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import * as PropTypes from "prop-types";
import { forwardRef, memo, useImperativeHandle, useRef } from "react";
import FusePageSimpleHeader from "./FusePageSimpleHeader";
import FusePageSimpleSidebar from "./FusePageSimpleSidebar";

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

  "&.FusePageSimple-scroll-content": {
    height: "100%",
  },

  "& .FusePageSimple-wrapper": {
    display: "flex",
    flexDirection: "row",
    flex: "1 1 auto",
    zIndex: 2,
    minWidth: 0,
    height: "100%",
    backgroundColor: theme.palette.background.default,
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

  "& .FusePageSimple-header": {
    display: "flex",
    flex: "0 0 auto",
    backgroundSize: "cover",
  },

  "& .FusePageSimple-topBg": {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: headerHeight,
    pointerEvents: "none",
  },

  "& .FusePageSimple-contentWrapper": {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    flex: "1 1 auto",
    overflow: "hidden",
    //    WebkitOverflowScrolling: 'touch',
    zIndex: 9999,
  },

  "& .FusePageSimple-toolbar": {
    height: toolbarHeight,
    minHeight: toolbarHeight,
    display: "flex",
    alignItems: "center",
  },

  "& .FusePageSimple-content": {
    display: "flex",
    flex: "1 1 auto",
    alignItems: "start",
    minHeight: 0,
    overflowY: "auto",
  },

  "& .FusePageSimple-sidebarWrapper": {
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

          "&.FusePageSimple-leftSidebar": {
            //@ts-ignore
            marginLeft: -props.leftsidebarwidth,
          },
          "&.FusePageSimple-rightSidebar": {
            //@ts-ignore
            marginRight: -props.rightsidebarwidth,
          },
        },
      },
    },
  },

  "& .FusePageSimple-sidebar": {
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

  "& .FusePageSimple-leftSidebar": {
    //@ts-ignore
    width: props.leftsidebarwidth,

    [theme.breakpoints.up("lg")]: {
      borderRight: `1px solid ${theme.palette.divider}`,
      borderLeft: 0,
    },
  },

  "& .FusePageSimple-rightSidebar": {
    //@ts-ignore
    width: props.rightsidebarwidth,

    [theme.breakpoints.up("lg")]: {
      borderLeft: `1px solid ${theme.palette.divider}`,
      borderRight: 0,
    },
  },

  "& .FusePageSimple-sidebarHeader": {
    height: headerHeight,
    minHeight: headerHeight,
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },

  "& .FusePageSimple-sidebarHeaderInnerSidebar": {
    backgroundColor: "transparent",
    color: "inherit",
    height: "auto",
    minHeight: "auto",
  },

  "& .FusePageSimple-sidebarContent": {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
  },

  "& .FusePageSimple-backdrop": {
    position: "absolute",
  },
}));

const headerHeight = 120;
const toolbarHeight = 64;

const FusePageSimple = forwardRef((props, ref) => {
  // console.info("render::FusePageSimple");
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
          "FusePageSimple-root",
          //@ts-ignore
          `FusePageSimple-scroll-${props.scroll}`,
          //@ts-ignore
          props.className
        )}
        ref={rootRef}
        //@ts-ignore
        scroll={props.scroll}
        //@ts-ignore
        leftsidebarwidth={props.leftSidebarWidth}
        //@ts-ignore
        rightsidebarwidth={props.rightSidebarWidth}
      >
        <div className="flex flex-auto flex-col z-10 h-full">
          <div className="FusePageSimple-wrapper">
            {
              //@ts-ignore
              props.leftSidebarContent && (
                <FusePageSimpleSidebar
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

            <div
              className="FusePageSimple-contentWrapper"
              // enable={props.scroll === 'page'}
            >
              {
                //@ts-ignore
                props.header && <FusePageSimpleHeader header={props.header} />
              }
              {
                //@ts-ignore
                props.content && (
                  <FuseScrollbars
                    //@ts-ignore
                    enable={props.scroll === "content"}
                    className={clsx("FusePageSimple-content container")}
                  >
                    {
                      //@ts-ignore
                      props.content
                    }
                  </FuseScrollbars>
                )
              }
            </div>

            {
              //@ts-ignore
              props.rightSidebarContent && (
                <FusePageSimpleSidebar
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

FusePageSimple.propTypes = {
  //@ts-ignore
  leftSidebarContent: PropTypes.node,
  leftSidebarVariant: PropTypes.node,
  rightSidebarContent: PropTypes.node,
  rightSidebarVariant: PropTypes.node,
  header: PropTypes.node,
  content: PropTypes.node,
  scroll: PropTypes.oneOf(["normal", "page", "content"]),
  leftSidebarOpen: PropTypes.bool,
  rightSidebarOpen: PropTypes.bool,
  leftSidebarWidth: PropTypes.number,
  rightSidebarWidth: PropTypes.number,
  rightSidebarOnClose: PropTypes.func,
  leftSidebarOnClose: PropTypes.func,
};

FusePageSimple.defaultProps = {
  //@ts-ignore
  classes: {},
  scroll: "page",
  leftSidebarOpen: false,
  rightSidebarOpen: false,
  rightSidebarWidth: 240,
  leftSidebarWidth: 240,
};

export default memo(styled(FusePageSimple)``);
