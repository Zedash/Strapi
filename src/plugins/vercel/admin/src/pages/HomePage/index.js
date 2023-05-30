/*
 *
 * HomePage
 *
 */

import React, { memo } from "react";
// Strapi UI
import { BaseHeaderLayout } from "@strapi/design-system";
import { Box } from "@strapi/design-system/Box";
// Custom UI
import { DeployButton } from "../../components/DeployButton";
import { Deployments, useDeployments } from "../../components/Deployments";

const HomePage = () => {
  const { deployments: allDeployment } = useDeployments();
  return (
    <>
      <Box background="neutral100">
        <BaseHeaderLayout
          primaryAction={<DeployButton />}
          title="Vercel Deploy"
          subtitle={`${allDeployment.length} deployments`}
          as="h2"
        />
      </Box>
      <Box padding={8}>
        <Deployments />
      </Box>
    </>
  );
};

export default memo(HomePage);
