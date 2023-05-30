import React, { useState, useEffect } from "react";
import { request } from "@strapi/helper-plugin";
import { Box, Flex, Loader, Typography } from "@strapi/design-system";
import { Table, Thead, Tbody, Tr, Td, Th } from "@strapi/design-system/Table";
import { Badge } from '@strapi/design-system/Badge';
import moment from "moment";
import { Block, StatusWrapper } from "../Status";

const DATETIME_FORMAT = "DD.MM.YYYY HH:mm:ss";

export const Deployments = () => {
  const { error, isLoading, deployments: allDeployment } = useDeployments();

  if (isLoading) {
    return (
      <Box padding={8}>
        <Flex alignItems="center" justifyContent="center">
          <Loader>Loading content...</Loader>
        </Flex>
      </Box>
    );
  }

  if (error) return <Block>Error occured during fetching deployments</Block>;

  const [latestDeploy, ...deployments] = allDeployment;

  return (
    <>
      <DeploymentLast deployment={latestDeploy} />
      <DeploymentList deployments={deployments} />
    </>
  );
};

const DeploymentList = (props) => {
  const { deployments } = props;

  if (!deployments || deployments.length === 0) {
    return (
      <Box padding={8} background="neutral100">
        <p>No deployments, make your first deploy</p>
      </Box>
    );
  }

  return (
    <Table colCount={6} rowCount={deployments.length + 1}>
      <Thead>
        <Tr>
          <Th>
            <Typography variant="sigma">#</Typography>
          </Th>
          <Th>
            <Typography variant="sigma">Date</Typography>
          </Th>
          <Th>
            <Typography variant="sigma">URL</Typography>
          </Th>
          <Th>
            <Typography variant="sigma">State</Typography>
          </Th>
          <Th>
            <Typography variant="sigma">Target</Typography>
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {deployments.map((entry, key) => (
          <Tr
            key={entry.uid}
            onClick={(e, data) => {
              window.open(urlize(data.url), "_blank");
            }}
          >
            <Td>
              <Typography textColor="neutral800">{key + 1}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">
                {moment(entry.created).format(DATETIME_FORMAT)}
              </Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{entry.url}</Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">
                {
                  <StatusWrapper state={entry.state}>
                    {entry.state}
                  </StatusWrapper>
                }
              </Typography>
            </Td>
            <Td>
              <Typography textColor="neutral800">{entry.target}</Typography>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

const DeploymentLast = (props) => {
  const { deployment: deploy } = props;

  if (!deploy) return <Block>No last deployment found</Block>;

  const { error, isLoading, deployment } = useDeployment({ id: deploy.uid });

  if (isLoading) {
    return (
      <Box padding={8} background="neutral100">
        <Flex alignItems="center" justifyContent="center">
          <Loader>Loading content...</Loader>
        </Flex>
      </Box>
    );
  }

  if (error)
    return <Block>Error occured during fetching last deployment</Block>;

  return (
    <Block>
      <Flex alignItems="center">
        <div className="mr-4">
          {deployment.readyState === "READY" ? (
            <a
              href={urlize(deployment.url)}
              target="_blank"
              style={{ width: "400px", height: "250px", display: "block" }}
            >
              <img
                height="250"
                title={deployment.url}
                alt={deployment.url}
                src={`https://api.microlink.io?url=${urlize(
                  deployment.url
                )}&screenshot=true&meta=false&embed=screenshot.url`}
              />
            </a>
          ) : (
            <div className="waiting">Waiting for deployment to finish...</div>
          )}
        </div>
        <div>
          <div className="mb-4">
            <div className="label">DEPLOYMENT</div>
            <div>
              <a href={urlize(deployment.url)} target="_blank">
                {deployment.url}
              </a>
            </div>
          </div>
          <div className="mb-4">
            <div className="label">DOMAINS</div>
            <div>
              {deployment.alias.map((alias) => (
                <div key={alias}>
                  <a href={urlize(alias)} target="_blank">
                    {alias}
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="label">STATE</div>
            <div>
              <StatusWrapper state={deployment.readyState}>
                {deployment.readyState}
              </StatusWrapper>
              {deployment.readyState === "READY" &&
                ` (${moment(deployment.ready).format(DATETIME_FORMAT)})`}
            </div>
          </div>
          <div className="mb-4">
            <div className="label">CREATED</div>
            <div>{moment(deployment.createdAt).format(DATETIME_FORMAT)}</div>
          </div>
          <div>
            <div className="label">TARGET</div>
            <Badge backgroundColor="success100" textColor="success500">{deployment.target}</Badge>
          </div>
        </div>
      </Flex>
    </Block>
  );
};

export const useDeployments = () => {
  const [state, setState] = useState({
    error: null,
    isLoading: true,
    deployments: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { deployments } = await request("/vercel/deployments", {
          method: "GET",
        });
        setState({ isLoading: false, deployments, error: null });
      } catch (e) {
        strapi.notification.error("notification.error");
        setState({ isLoading: false, error: e, deployments: [] });
      }
    };

    fetchData();
  }, []);

  return state;
};

const useDeployment = (props) => {
  const { id } = props;
  const [state, setState] = useState({
    error: null,
    isLoading: true,
    deployment: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await request(`/vercel/deployments/${id}`, {
          method: "GET",
        });
        setState({ isLoading: false, deployment: data, error: null });
      } catch (e) {
        strapi.notification.error("notification.error");
        setState({ isLoading: false, error: e, deployment: null });
      }
    };

    fetchData();
  }, []);

  return state;
};

const urlize = (url) => {
  return `https://${url}`;
};
