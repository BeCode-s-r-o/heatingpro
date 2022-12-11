import List from "@mui/material/List";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import FuseNavVerticalTab from "./types/FuseNavVerticalTab";

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
  "& .fuse-list-item-text-primary": {
    lineHeight: "1",
  },
  "&.active-square-list": {
    "& .fuse-list-item, & .active.fuse-list-item": {
      width: "100%",
      borderRadius: "0",
    },
  },
  "&.dense": {},
}));

interface FuseNavVerticalLayout2Props {
  navigation: any[];
  active: boolean;
  dense: boolean;
  className: string;
  onItemClick: (item: any) => void;
  firstLevel: boolean;
  selectedId: string;
}

function FuseNavVerticalLayout2(props: FuseNavVerticalLayout2Props) {
  const {
    navigation,
    active,
    dense,
    className,
    onItemClick,
    firstLevel,
    selectedId,
  } = props;

  function handleItemClick(item: any) {
    onItemClick?.(item);
  }

  return (
    <StyledList
      className={clsx(
        "navigation whitespace-nowrap items-center flex flex-col",
        `active-${active}-list`,
        dense && "dense",
        className
      )}
    >
      {navigation.map((_item) => (
        <FuseNavVerticalTab
          key={_item.id}
          type={`vertical-${_item.type}`}
          item={_item}
          nestedLevel={0}
          onItemClick={handleItemClick}
          firstLevel={firstLevel}
          dense={dense}
          selectedId={selectedId}
        />
      ))}
    </StyledList>
  );
}

export default FuseNavVerticalLayout2;
