import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
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
const EDIT_INVOICE_MUTATION = gql`
  mutation UpdateInvoice(
    $id: ID!
    $title: String
    $storeName: String
    $storeUrl: String
    $document: String
    $warrantyFinalDate: String
  ) {
    updateInvoice(
      id: $id
      title: $title
      storeName: $storeName
      storeUrl: $storeUrl
      document: $document
      warrantyFinalDate: $warrantyFinalDate
    ) {
      code
      success
      message
    }
  }
`;

const Invoice: React.FC<RouteComponentProps> = ({ history }) => {
  const { id } = useParams<routerParams>();
  const userContext: any = useContext(UserContext);
  const { isAuthenticated, auth } = userContext;

  const { loading, error, data } = useQuery(GET_SINGLE_INVOICE, {
    variables: { id },
  });

  const [deleteInvoice] = useMutation(DELETE_INVOICE);
  const [updateInvoice] = useMutation(EDIT_INVOICE_MUTATION);

  const [localLoading, setLocalLoading] = useState(false);

  const [localError, setLocalError] = useState({
    title: '',
    storeName: '',
    storeUrl: '',
    document: '',
    warrantyFinalDate: '',
  });

  const [editForm, setEditForm] = useState(false);
  const [editInvoice, setEditInvoice] = useState({
    title: '',
    storeName: '',
    storeUrl: '',
    document: '',
    warrantyFinalDate: '',
  });

  const [uploadedFile, setUploadedFile] = useState({ file: '', fileName: '' });

  useEffect(() => {
    auth();
    if (!localStorage.token && !isAuthenticated) {
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

  // Detail functions
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

  const activateEdit = () => {
    setEditForm(true);
    setEditInvoice({
      title: data.invoice.title,
      storeName: data.invoice.storeName,
      storeUrl: data.invoice.storeUrl,
      document: '',
      warrantyFinalDate: data.invoice.warrantyFinalDate,
    });
  };

  // Edit functions
  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setEditInvoice({ ...editInvoice, [e.target.name]: e.target.value });

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile: any = e.target.files;
    let file: any = null;
    let fileName = '';
    //Check File is not Empty
    if (selectedFile.length > 0) {
      // Select the very first file from list
      let fileToLoad = selectedFile[0];
      fileName = fileToLoad.name;
      // FileReader function for read the file.
      let fileReader = new FileReader();
      // Onload of file read the file content
      fileReader.onload = function (fileLoadedEvent: any) {
        file = fileLoadedEvent.target.result;
        // Print data in console
        // console.log(file);
        setUploadedFile({ file, fileName });
      };
      // Convert data to base64
      fileReader.readAsDataURL(fileToLoad);
      setEditInvoice({ ...editInvoice, [e.target.name]: e.target.value });
    }
  };

  const handleEditSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!editInvoice.title)
      return setLocalError({ ...localError, title: 'You need a title' });
    if (!editInvoice.storeName)
      return setLocalError({
        ...localError,
        storeName: 'You must have a store name',
      });
    if (!editInvoice.warrantyFinalDate)
      return setLocalError({
        ...localError,
        warrantyFinalDate: 'Please choose the final date',
      });
    if (!editInvoice.document) {
      setEditInvoice({ ...editInvoice, [document]: data.invoice.document });
      // return setLocalError({
      //   ...localError,
      //   document: 'Please insert the invoice pdf',
      // });
    }
    // console.log(editInvoice);
    // console.log(uploadedFile);

    // Changes layout for the spiner while waiting for the request
    setLocalLoading(true);

    updateInvoice({
      variables: {
        id,
        title: editInvoice.title,
        storeName: editInvoice.storeName,
        storeUrl: editInvoice.storeUrl,
        document: uploadedFile.file,
        warrantyFinalDate: editInvoice.warrantyFinalDate,
      },
    }).then(({ data }) => {
      if (data.updateInvoice.code === '200') {
        setEditInvoice({
          title: '',
          storeName: '',
          storeUrl: '',
          document: '',
          warrantyFinalDate: '',
        });

        setUploadedFile({ file: '', fileName: '' });
        setEditForm(false);
        setLocalLoading(false);

        history.push(`/invoice/${id}`);
      } else {
        console.log('Error creating invoice', data.updateInvoice.message);
      }
    });
  };

  if (
    localError.title !== '' ||
    localError.storeName !== '' ||
    localError.warrantyFinalDate !== '' ||
    localError.document !== ''
  ) {
    setTimeout(() => {
      setLocalError({
        title: '',
        storeName: '',
        storeUrl: '',
        document: '',
        warrantyFinalDate: '',
      });
    }, 3500);
  }

  return (
    <div className="mt-5 mb-3 row">
      {localLoading && <Spinner />}
      {!localLoading && !editForm && (
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

              <i
                className="fas fa-pencil-alt fa-2x ml-4"
                onClick={activateEdit}
              ></i>
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
      {/* If it is to edit */}
      {!localLoading && editForm && (
        <>
          <div className="col-6">
            <p>
              <h4 className="inline-block undeline">Title</h4>
              <h4 className="inline-block">:</h4>{' '}
              <input
                type="text"
                className="inline-block form-control"
                value={editInvoice.title}
                placeholder="Identify invoice"
                name="title"
                onChange={onChange}
              />
              {localError.title && (
                <small className="form-text text-danger">
                  {localError.title}
                </small>
              )}
            </p>
            <p>
              <h4 className="inline-block undeline">Store Name</h4>
              <h4 className="inline-block">:</h4>{' '}
              <input
                type="text"
                className="inline-block form-control"
                value={editInvoice.storeName}
                placeholder="Invoice's store name"
                name="storeName"
                onChange={onChange}
              />
              {localError.storeName && (
                <small className="form-text text-danger">
                  {localError.storeName}
                </small>
              )}
            </p>
            <p>
              <h4 className="inline-block undeline">Store URL</h4>
              <h4 className="inline-block">:</h4>{' '}
              <input
                type="text"
                className="inline-block form-control"
                value={editInvoice.storeUrl}
                placeholder="Store's website"
                name="storeUrl"
                onChange={onChange}
              />
            </p>
            <p>
              <h4 className="inline-block undeline">Warranty Final Date</h4>
              <h4 className="inline-block">:</h4>{' '}
              <input
                type="date"
                className="inline-block form-control"
                value={editInvoice.warrantyFinalDate}
                name="warrantyFinalDate"
                onChange={onChange}
              />
              {localError.warrantyFinalDate && (
                <small className="form-text text-danger">
                  {localError.warrantyFinalDate}
                </small>
              )}
            </p>

            <div className="mt-5">
              <button
                className="btn btn-primary"
                onClick={() => setEditForm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary ml-4"
                onClick={handleEditSubmit}
              >
                Edit
              </button>
            </div>
          </div>

          <div className="col-6 text-center">
            <p>
              <input
                type="file"
                name="document"
                value={editInvoice.document}
                onChange={onChangeFile}
              />
              {localError.document && (
                <small className="form-text text-danger">
                  {localError.document}
                </small>
              )}
            </p>
            {!editInvoice.document ? (
              <Pdf preview={false} previewSize={800} selectedFile={document} />
            ) : (
              <Pdf
                preview={false}
                previewSize={800}
                selectedFile={uploadedFile.file}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Invoice;
