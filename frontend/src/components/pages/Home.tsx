import { useContext, useEffect } from 'react';
import Invoices from './invoices/Invoices';

import UserContext from '../../context/user/userContext';

import { RouteComponentProps } from 'react-router-dom';

import { gql, useQuery } from '@apollo/client';
import Spinner from '../layout/Spinner';

const GET_USER_INVOICES = gql`
  query GetUserInvoices($id: ID!) {
    user(id: $id) {
      invoices {
        id
        title
        storeName
        document
        warrantyFinalDate
      }
    }
  }
`;

// Needs to be here to properly extend and get the history props
interface HomeProps extends RouteComponentProps {
  filter: string;
}

/* When reloading this page, an error appears in console saying an't perform a React state update on an 
unmounted component, this appeans because of React.StrictMode, it is resolved in Apollo 3.0.0 beta
*/

const Home: React.FC<HomeProps> = ({ filter, history }) => {
  const userContext: any = useContext(UserContext);
  const { isAuthenticated, user } = userContext;

  // Make sure the variable passed in useQuery is not null
  // It will never be empty because when a user cant access the page without login
  let userId = null;
  if (user) userId = user.id;
  else userId = '';

  const { loading, error, data } = useQuery(GET_USER_INVOICES, {
    variables: { id: userId },
    pollInterval: 500, // makes a request every 1 second
  });

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }

    // eslint-disable-next-line
  }, [isAuthenticated, history]);

  if (filter) {
    // This is to filter the order that appears in the invoices, "most recent" or "date to end"
    console.log(filter);
  }

  if (loading) return <Spinner />;
  if (error) return <h1>Error! {error}</h1>;

  return (
    <div className="container mb-4">
      <Invoices invoices={data.user.invoices} />
    </div>
  );
};

export default Home;
