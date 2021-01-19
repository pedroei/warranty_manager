import React, { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import UserContext from '../../context/user/userContext';

const NotFound: React.FC<RouteComponentProps> = ({ history }) => {
  const userContext: any = useContext(UserContext);

  const { isAuthenticated, auth } = userContext;

  useEffect(() => {
    auth();
    // eslint-disable-next-line
  }, [isAuthenticated, history]);

  return (
    <div className="container mt-5">
      <h1 className="display-3">Not Found</h1>
      <p className="lead">This page was not recognized.</p>
    </div>
  );
};

export default NotFound;
