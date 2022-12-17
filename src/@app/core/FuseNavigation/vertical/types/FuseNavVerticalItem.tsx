import { NavLinkAdapter } from "@app/core";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { alpha, styled } from "@mui/material/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { FuseSvgIcon } from "src/@app/core/FuseSvgIcon";
import FuseNavBadge from "../../FuseNavBadge";

interface RootProps {
  itempadding: number;
  theme?: any;
}

const Root = styled(ListItem)(({ theme, itempadding }: RootProps) => ({
  minHeight: 44,
  width: "100%",
  borderRadius: "6px",
  margin: "0 0 4px 0",
  paddingRight: 16,
  paddingLeft: itempadding > 80 ? 80 : itempadding,
  paddingTop: 10,
  paddingBottom: 10,
  color: alpha(theme.palette.text.primary, 0.7),
  cursor: "pointer",
  textDecoration: "none!important",
  "&:hover": {
    color: theme.palette.text.primary,
  },
  "&.active": {
    color: theme.palette.text.primary,
    backgroundColor:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, .05)!important"
        : "rgba(255, 255, 255, .1)!important",
    pointerEvents: "none",
    transition: "border-radius .15s cubic-bezier(0.4,0.0,0.2,1)",
    "& > .fuse-list-item-text-primary": {
      color: "inherit",
    },
    "& > .fuse-list-item-icon": {
      color: "inherit",
    },
  },
  "& >.fuse-list-item-icon": {
    marginRight: 16,
    color: "inherit",
  },
  "& > .fuse-list-item-text": {},
}));

interface FuseNavVerticalItemProps {
  item: any;
  nestedLevel: number;
  onItemClick: any;
}

function FuseNavVerticalItem(props: FuseNavVerticalItemProps) {
  const { item, nestedLevel, onItemClick } = props;

  const itempadding = nestedLevel > 0 ? 38 + nestedLevel * 16 : 16;

  return useMemo(
    () => (
      <Root
        //@ts-ignore
        button
        component={NavLinkAdapter}
        to={item.url || ""}
        activeClassName={item.url ? "active" : ""}
        className={clsx("fuse-list-item", item.active && "active")}
        onClick={() => onItemClick && onItemClick(item)}
        end={item.end}
        itempadding={itempadding}
        role="button"
        sx={item.sx}
        disabled={item.disabled}
      >
        {item.icon && (
          <FuseSvgIcon
            className={clsx("fuse-list-item-icon shrink-0", item.iconClass)}
            color="action"
          >
            {item.icon}
          </FuseSvgIcon>
        )}

        <ListItemText
          className="fuse-list-item-text"
          primary={item.title}
          secondary={item.subtitle}
          classes={{
            primary: "text-13 font-medium fuse-list-item-text-primary truncate",
            secondary:
              "text-11 font-medium fuse-list-item-text-secondary leading-normal truncate",
          }}
        />
        {item.badge && <FuseNavBadge badge={item.badge} />}
      </Root>
    ),
    [item, itempadding, onItemClick]
  );
}

FuseNavVerticalItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
    url: PropTypes.string,
  }),
};

FuseNavVerticalItem.defaultProps = {};

const NavVerticalItem = FuseNavVerticalItem;

export default NavVerticalItem;
