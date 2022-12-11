import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import FuseNavItem from "../FuseNavItem";

const StyledList = styled(List)(({ theme }) => ({
  "& .fuse-list-item": {
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.05)"
          : "rgba(0,0,0,.04)",
    },
    "&:focus:not(.active)": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255, 255, 255, 0.06)"
          : "rgba(0,0,0,.05)",
    },
  },
  "& .fuse-list-item-text": {
    margin: 0,
  },
  "& .fuse-list-item-text-primary": {
    lineHeight: "20px",
  },
  "&.active-square-list": {
    "& .fuse-list-item, & .active.fuse-list-item": {
      width: "100%",
      borderRadius: "0",
    },
  },
  "&.dense": {
    "& .fuse-list-item": {
      paddingTop: 0,
      paddingBottom: 0,
      height: 32,
    },
  },
}));

interface FuseNavVerticalLayout1Props {
  navigation: any[];
  active: boolean;
  dense: boolean;
  className: string;
  onItemClick: (item: any) => void;
}

function FuseNavVerticalLayout1(props: FuseNavVerticalLayout1Props) {
  const { navigation, active, dense, className, onItemClick } = props;

  function handleItemClick(item: any) {
    onItemClick?.(item);
  }

  return (
    <StyledList
      className={clsx(
        "navigation whitespace-nowrap px-12 py-0",
        `active-${active}-list`,
        dense && "dense",
        className
      )}
    >
      {navigation.map((_item) => (
        <FuseNavItem
          key={_item.id}
          type={`vertical-${_item.type}`}
          item={_item}
          nestedLevel={0}
          onItemClick={handleItemClick}
        />
      ))}
    </StyledList>
  );
}

export default FuseNavVerticalLayout1;
