import Icon from "@mui/material/Icon";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import clsx from "clsx";
import { forwardRef, ReactComponentElement } from "react";

interface RootProps {
  theme: any;
  size?: number | string;
  colorType: string;
  [x: string]: any;
}

const Root = styled(Box)(({ theme, ...props }: RootProps) => ({
  width: props.size,
  height: props.size,
  minWidth: props.size,
  minHeight: props.size,
  fontSize: props.size,
  lineHeight: props.size,
  color: {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    info: theme.palette.info.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    action: theme.palette.action.active,
    error: theme.palette.error.main,
    disabled: theme.palette.action.disabled,
    inherit: undefined,
  }[props.colorType],
}));

interface FuseSvgIconProps {
  children: any | string;
  className?: string;
  size?: number | string;
  sx?: any;
  color:
    | "inherit"
    | "disabled"
    | "primary"
    | "secondary"
    | "action"
    | "error"
    | "info"
    | "success"
    | "warning";
}

const FuseSvgIcon = forwardRef(
  ({ children, size, sx, color, className, ...rest }: any, ref) => {
    if (!children && !Array(children).includes(":")) {
      return <Icon />; //bolo tu <Icon {...props} />
    }

    const iconPath = children ? children.replace(":", ".svg#") : "";

    return (
      <Root
        theme={undefined}
        {...rest}
        component="svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className={clsx("shrink-0 fill-current ", className)}
        ref={ref}
        size={size}
        sx={sx}
        colorType={color}
      >
        <use xlinkHref={`assets/icons/${iconPath}`} />
      </Root>
    );
  }
);

FuseSvgIcon.defaultProps = {
  children: "",
  size: 24,
  sx: {},
  color: "inherit",
};

export default FuseSvgIcon;
