import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';

import UserContext from '../../../context/user/userContext';

import { gql, useQuery } from '@apollo/client';
import Spinner from '../../layout/Spinner';
import Pdf from '../pdf/Pdf';

const GET_SINGLE_INVOICE = gql`
  query GetInvoice($id: ID!) {
    invoice(id: $id) {
      id
      title
      storeName
      storeUrl
      document
      warrantyFinalDate
    }
  }
`;

const Invoice: React.FC<RouteComponentProps> = ({ history }) => {
  const { id } = useParams<routerParams>();
  const userContext: any = useContext(UserContext);
  const { isAuthenticated } = userContext;

  const { loading, error, data } = useQuery(GET_SINGLE_INVOICE, {
    variables: { id },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }

    // eslint-disable-next-line
  }, [isAuthenticated, history]);
  if (!isAuthenticated) return null;

  if (id.length !== 24) {
    return <h1 className="mt-5 text-danger">Invoice "{id}" was not found</h1>;
  }
  if (loading) return <Spinner />;
  if (error) return <h1>Error! {error}</h1>;

  const {
    title,
    storeName,
    storeUrl,
    document,
    warrantyFinalDate,
  } = data.invoice;

  return (
    <div className="mt-5 mb-3 row">
      <div className="col-6">
        <h1 className="display-4 mb-3">{title}</h1>
        <p>
          <h4 className="inline-block undeline">Store Name</h4>
          <h4 className="inline-block">:</h4>{' '}
          <h4 className="inline-block">{storeName}</h4>
        </p>
        {storeUrl && (
          <p>
            <h4 className="inline-block undeline">Store URL</h4>
            <h4 className="inline-block">:</h4>{' '}
            <h4 className="inline-block">{storeUrl}</h4>
          </p>
        )}

        <p>
          <h4 className="inline-block undeline">Warranty Final Date</h4>
          <h4 className="inline-block">:</h4>{' '}
          <h4 className="inline-block">{warrantyFinalDate}</h4>
        </p>
        <div className="mt-5">
          <i className="fas fa-trash fa-2x"></i>
          <i className="fas fa-pencil-alt fa-2x ml-4"></i>
          {/* <button className="btn btn-outline-primary">Delete</button> */}
          {/* <button className="btn btn-outline-primary ml-4">Edit</button> */}
        </div>
      </div>
      <div className="col-6">
        <Pdf preview={false} previewSize={800} selectedFile={document} />
      </div>
    </div>
  );
};

export default Invoice;
