import { NavLinkAdapter } from "@app/core";
import { ListItemText } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import { alpha, styled } from "@mui/material/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useMemo } from "react";
import FuseNavItem from "../../FuseNavItem";

interface RootProps {
  itempadding: number;
  theme?: any;
}

const Root = styled(ListItem)(
  ({ theme, itempadding, ...props }: RootProps) => ({
    minminHeight: 44,
    width: "100%",
    borderRadius: "6px",
    margin: "28px 0 0 0",
    paddingRight: 16,
    paddingLeft: itempadding > 80 ? 80 : itempadding,
    paddingTop: 10,
    paddingBottom: 10,
    color: alpha(theme.palette.text.primary, 0.7),
    fontWeight: 600,
    letterSpacing: "0.025em",
  })
);

interface FuseNavVerticalGroupProps {
  item: any;
  nestedLevel: number;
  onItemClick: any;
}

function FuseNavVerticalGroup(props: FuseNavVerticalGroupProps) {
  const { item, nestedLevel, onItemClick } = props;

  const itempadding = nestedLevel > 0 ? 38 + nestedLevel * 16 : 16;

  return useMemo(
    () => (
      <>
        <Root
          //@ts-ignore
          component={item.url ? NavLinkAdapter : "li"}
          itempadding={itempadding}
          className={clsx(
            "fuse-list-subheader flex items-center  py-10",
            !item.url && "cursor-default"
          )}
          onClick={() => onItemClick && onItemClick(item)}
          to={item.url}
          end={item.end}
          role="button"
          sx={item.sx}
          disabled={item.disabled}
        >
          <ListItemText
            className="fuse-list-subheader-text"
            sx={{
              margin: 0,
              "& > .MuiListItemText-primary": {
                fontSize: 12,
                color: "secondary.light",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: ".05em",
                lineHeight: "20px",
              },

              "& > .MuiListItemText-secondary": {
                fontSize: 11,
                color: "text.disabled",
                letterSpacing: ".06px",
                fontWeight: 500,
                lineHeight: "1.5",
              },
            }}
            primary={item.title}
            secondary={item.subtitle}
          />
        </Root>
        {item.children && (
          <>
            {item.children.map((_item: any) => (
              <FuseNavItem
                key={_item.id}
                type={`vertical-${_item.type}`}
                item={_item}
                nestedLevel={nestedLevel}
                onItemClick={onItemClick}
              />
            ))}
          </>
        )}
      </>
    ),
    [item, itempadding, nestedLevel, onItemClick]
  );
}

FuseNavVerticalGroup.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    children: PropTypes.array,
  }),
};

FuseNavVerticalGroup.defaultProps = {};

const NavVerticalGroup = FuseNavVerticalGroup;

export default NavVerticalGroup;
