// @flow

import { Container, Typography } from '@material-ui/core';
import React from 'react';

// PasswordResetPage

type PropsT = {
  header: string,
  children: any,
};

export const AuthenticationFrame = (props: PropsT) => {
  return (
    <Container component="main" maxWidth="xs">
      <div className="">
        <Typography component="h1" variant="h5">
          {props.header}
        </Typography>
        {props.children}
      </div>
    </Container>
  );
};
