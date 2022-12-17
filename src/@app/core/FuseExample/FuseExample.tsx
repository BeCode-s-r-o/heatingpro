import { FuseHighlight } from "@app/core";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { darken } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useState } from "react";
import { FuseSvgIcon } from "../FuseSvgIcon";
import DemoFrame from "./DemoFrame";

const propTypes = {
  name: PropTypes.string,
  raw: PropTypes.object,
  currentTabIndex: PropTypes.number,
};

const defaultProps = {
  name: "",
  currentTabIndex: 0,
};

interface FuseExampleProps {
  name: string;
  raw: any;
  currentTabIndex: number;
  component: any;
  iframe: any;
  className: string;
}

function FuseExample(props: FuseExampleProps) {
  const [currentTab, setCurrentTab] = useState(props.currentTabIndex);
  const { component: Component, raw, iframe, className, name } = props;

  function handleChange(event: any, value: any) {
    setCurrentTab(value);
  }

  return (
    <Card
      className={clsx(className, "shadow")}
      sx={{
        backgroundColor: (theme) =>
          darken(
            theme.palette.background.paper,
            theme.palette.mode === "light" ? 0.01 : 0.1
          ),
      }}
    >
      <Box
        sx={{
          backgroundColor: (theme) =>
            darken(
              theme.palette.background.paper,
              theme.palette.mode === "light" ? 0.02 : 0.2
            ),
        }}
      >
        <Tabs
          classes={{
            root: "border-b-1",
            flexContainer: "justify-end",
          }}
          value={currentTab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
        >
          {Component && (
            <Tab
              classes={{ root: "min-w-64" }}
              icon={<FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>}
            />
          )}
          {raw && (
            <Tab
              classes={{ root: "min-w-64" }}
              icon={<FuseSvgIcon>heroicons-outline:code</FuseSvgIcon>}
            />
          )}
        </Tabs>
      </Box>
      <div className="flex justify-center max-w-full relative">
        <div className={currentTab === 0 ? "flex flex-1 max-w-full" : "hidden"}>
          {Component &&
            (iframe ? (
              <DemoFrame name={name}>
                <Component />
              </DemoFrame>
            ) : (
              <div className="p-24 flex flex-1 justify-center max-w-full">
                <Component />
              </div>
            ))}
        </div>
        <div className={currentTab === 1 ? "flex flex-1" : "hidden"}>
          {raw && (
            <div className="flex flex-1">
              <FuseHighlight
                component="pre"
                className="language-javascript w-full"
                sx={{ borderRadius: "0!important" }}
              >
                {raw.default}
              </FuseHighlight>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

FuseExample.propTypes = propTypes;
FuseExample.defaultProps = defaultProps;

export default FuseExample;
