import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';

import UserContext from '../../../context/user/userContext';

import { gql, useMutation, useQuery } from '@apollo/client';
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
const DELETE_INVOICE = gql`
  mutation DeleteInvoice($id: ID!) {
    deleteInvoice(id: $id) {
      code
      success
      message
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

  const [deleteInvoice] = useMutation(DELETE_INVOICE);

  const [localLoading, setLocalLoading] = useState(false);

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

  const handleDelete = () => {
    console.log('Delete: ' + id);

    // Changes layout for the spiner while waiting for the request
    setLocalLoading(true);

    deleteInvoice({
      variables: { id },
    }).then(({ data }) => {
      if (data.deleteInvoice.code === '200') {
        history.push('/');
      } else {
        console.log('Error deleting invoice', data.deleteInvoice.message);
      }
    });
  };

  return (
    <div className="mt-5 mb-3 row">
      {localLoading && <Spinner />}
      {!localLoading && (
        <>
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
              <i
                className="fas fa-trash fa-2x"
                data-toggle="modal"
                data-target="#exampleModal"
              ></i>

              <i className="fas fa-pencil-alt fa-2x ml-4"></i>
              {/* <button className="btn btn-outline-primary">Delete</button> */}
              {/* <button className="btn btn-outline-primary ml-4">Edit</button> */}
            </div>
          </div>
          <div className="col-6">
            <Pdf preview={false} previewSize={800} selectedFile={document} />
          </div>
          {/* Modal */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Confirmation
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this invoice?
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-dismiss="modal"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Invoice;
