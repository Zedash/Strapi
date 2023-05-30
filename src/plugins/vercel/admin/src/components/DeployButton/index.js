import React, { useState } from "react";
import { request } from "@strapi/helper-plugin";
import { Button } from "@strapi/design-system/Button";
import Plus from '@strapi/icons/Plus';

export const DeployButton = () => {
  const [state, setState] = useState({
    loading: false,
  });

  const onClick = async () => {
    setState({ loading: true });
    await deploy("production");
    setImmediate(() => window.location.reload());
  };

  return (
    <Button
      variant="success"
      type="submit"
      startIcon={<Plus />}
      loading={state.loading}
      onClick={onClick}
    >
      Deploy to production
    </Button>
  );
};

const deploy = async (target) => {
  try {
    const data = await request(`/vercel/deploy/${target}`, {
      method: "POST",
    });
    return data;
  } catch (e) {
    strapi.notification.error("notification.error");
  }
};
