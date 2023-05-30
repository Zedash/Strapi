/*
 *
 * HomePage
 *
 */

import React, { memo } from "react";
// import PropTypes from 'prop-types';
import { Padded } from "@buffetjs/core";
import { Header } from "@buffetjs/custom";
import { Deployments, DeployButton } from "../../view/index";

const HomePage = () => {
  return (
    <>
      <Padded top right left size="md">
        <Header
          title={{ label: "Dashboard" }}
          actions={[{ Component: DeployButton }]}
        />
      </Padded>
      <Padded right left size="md">
        <Deployments />
      </Padded>
    </>
  );
};

export default memo(HomePage);
