import _ from "@lodash";
import Divider from "@mui/material/Divider";
import GlobalStyles from "@mui/material/GlobalStyles";
import PropTypes from "prop-types";
import { memo } from "react";
import { registerComponent } from "./FuseNavItem";
import FuseNavHorizontalLayout1 from "./horizontal/FuseNavHorizontalLayout1";
import FuseNavHorizontalCollapse from "./horizontal/types/FuseNavHorizontalCollapse";
import FuseNavHorizontalGroup from "./horizontal/types/FuseNavHorizontalGroup";
import FuseNavHorizontalItem from "./horizontal/types/FuseNavHorizontalItem";
import FuseNavHorizontalLink from "./horizontal/types/FuseNavHorizontalLink";
import FuseNavVerticalLayout1 from "./vertical/FuseNavVerticalLayout1";
import FuseNavVerticalLayout2 from "./vertical/FuseNavVerticalLayout2";
import FuseNavVerticalCollapse from "./vertical/types/FuseNavVerticalCollapse";
import FuseNavVerticalGroup from "./vertical/types/FuseNavVerticalGroup";
import FuseNavVerticalItem from "./vertical/types/FuseNavVerticalItem";
import FuseNavVerticalLink from "./vertical/types/FuseNavVerticalLink";

const inputGlobalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      ".popper-navigation-list": {
        "& .fuse-list-item": {
          padding: "8px 12px 8px 12px",
          height: 40,
          minHeight: 40,
          "& .fuse-list-item-text": {
            padding: "0 0 0 8px",
          },
        },
        "&.dense": {
          "& .fuse-list-item": {
            minHeight: 32,
            height: 32,
            "& .fuse-list-item-text": {
              padding: "0 0 0 8px",
            },
          },
        },
      },
    })}
  />
);

/*
Register Fuse Navigation Components
 */
registerComponent("vertical-group", FuseNavVerticalGroup as any);
registerComponent("vertical-collapse", FuseNavVerticalCollapse as any);
registerComponent("vertical-item", FuseNavVerticalItem as any);
registerComponent("vertical-link", FuseNavVerticalLink as any);
registerComponent("horizontal-group", FuseNavHorizontalGroup);
registerComponent("horizontal-collapse", FuseNavHorizontalCollapse);
registerComponent("horizontal-item", FuseNavHorizontalItem);
registerComponent("horizontal-link", FuseNavHorizontalLink);
registerComponent("vertical-divider", () => <Divider className="my-16" />);
registerComponent("horizontal-divider", () => <Divider className="my-16" />);

interface FuseNavigationProps {
  navigation: any[];
  layout: "vertical" | "vertical-2" | "horizontal";
  active: boolean;
  dense: boolean;
  className: string;
  onItemClick: (item: any) => void;
  firstLevel: boolean;
  selectedId: string;
}

function FuseNavigation(props: FuseNavigationProps) {
  const options = _.pick(props, [
    "navigation",
    "layout",
    "active",
    "dense",
    "className",
    "onItemClick",
    "firstLevel",
    "selectedId",
  ]);
  if (props.navigation.length > 0) {
    if (props.layout === "horizontal") {
      return <FuseNavHorizontalLayout1 {...options} />;
    }
    return (
      <>
        {inputGlobalStyles}
        {props.layout === "vertical" && <FuseNavVerticalLayout1 {...options} />}
        {props.layout === "vertical-2" && (
          <FuseNavVerticalLayout2 {...options} />
        )}
      </>
    );
  }
  return null;
}

FuseNavigation.propTypes = {
  navigation: PropTypes.array.isRequired,
};

FuseNavigation.defaultProps = {
  layout: "vertical",
};

export default memo(FuseNavigation);
