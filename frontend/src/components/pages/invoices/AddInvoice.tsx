import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import UserContext from '../../../context/user/userContext';

import { useMutation, gql } from '@apollo/client';

import Pdf from '../pdf/Pdf';
import Spinner from '../../layout/Spinner';

const ADD_INVOICE_MUTATION = gql`
  mutation AddInvoice(
    $title: String!
    $storeName: String!
    $storeUrl: String
    $document: String!
    $warrantyFinalDate: String!
    $userID: ID!
  ) {
    addInvoice(
      title: $title
      storeName: $storeName
      storeUrl: $storeUrl
      document: $document
      warrantyFinalDate: $warrantyFinalDate
      userID: $userID
    ) {
      code
      success
      message
      invoice {
        id
        user {
          id
        }
      }
    }
  }
`;

const AddInvoice: React.FC<RouteComponentProps> = ({ history }) => {
  const userContext: any = useContext(UserContext);
  const { isAuthenticated, user, auth } = userContext;

  const [newInvoice, setNewInvoice] = useState({
    title: '',
    storeName: '',
    storeUrl: '',
    document: '',
    warrantyFinalDate: '',
  });

  const [uploadedFile, setUploadedFile] = useState({ file: '', fileName: '' });

  const [localError, setLocalError] = useState({
    title: '',
    storeName: '',
    storeUrl: '',
    document: '',
    warrantyFinalDate: '',
  });

  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    auth();
    if (!localStorage.token && !isAuthenticated) {
      history.push('/login');
    }

    // eslint-disable-next-line
  }, [isAuthenticated, history]);

  const [addInvoice] = useMutation(ADD_INVOICE_MUTATION);

  if (!isAuthenticated) return null;

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewInvoice({ ...newInvoice, [e.target.name]: e.target.value });

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
      setNewInvoice({ ...newInvoice, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.preventDefault();
    if (!newInvoice.title)
      return setLocalError({ ...localError, title: 'You need a title' });
    if (!newInvoice.storeName)
      return setLocalError({
        ...localError,
        storeName: 'You must have a store name',
      });
    if (!newInvoice.warrantyFinalDate)
      return setLocalError({
        ...localError,
        warrantyFinalDate: 'Please choose the final date',
      });
    if (!newInvoice.document)
      return setLocalError({
        ...localError,
        document: 'Please insert the invoice pdf',
      });

    // console.log(newInvoice);
    // console.log(uploadedFile);

    // Changes layout for the spiner while waiting for the request
    setLocalLoading(true);

    addInvoice({
      variables: {
        title: newInvoice.title,
        storeName: newInvoice.storeName,
        storeUrl: newInvoice.storeUrl,
        document: uploadedFile.file,
        warrantyFinalDate: newInvoice.warrantyFinalDate,
        userID: user.id,
      },
    }).then(({ data }) => {
      if (data.addInvoice.code === '200') {
        setNewInvoice({
          title: '',
          storeName: '',
          storeUrl: '',
          document: '',
          warrantyFinalDate: '',
        });
        history.push('/');
      } else {
        console.log('Error creating invoice', data.addInvoice.message);
      }
    });
    // console.log(new Date(newInvoice.warrantyFinalDate));
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
    <div className="container mt-5">
      {localLoading && <Spinner />}
      {!localLoading && (
        <>
          <h1>Add a new invoice</h1>
          <form className="mt-4">
            <fieldset>
              <div className="row">
                <div className="form-group col-4">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="Identify invoice"
                    name="title"
                    value={newInvoice.title}
                    onChange={onChange}
                  />
                  {localError.title && (
                    <small className="form-text text-danger">
                      {localError.title}
                    </small>
                  )}
                </div>
                <div className="form-group col-4">
                  <label htmlFor="storeName">Store Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="storeName"
                    placeholder="Invoice's store name"
                    name="storeName"
                    value={newInvoice.storeName}
                    onChange={onChange}
                  />
                  {localError.storeName && (
                    <small className="form-text text-danger">
                      {localError.storeName}
                    </small>
                  )}
                </div>
                <div className="form-group col-4">
                  <label htmlFor="storeUrl">Store URL</label>
                  <input
                    type="text"
                    className="form-control"
                    id="storeUrl"
                    placeholder="Store's website"
                    name="storeUrl"
                    value={newInvoice.storeUrl}
                    onChange={onChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-6">
                  <label htmlFor="warrantyFinalDate">Warranty end date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="warrantyFinalDate"
                    name="warrantyFinalDate"
                    value={newInvoice.warrantyFinalDate}
                    onChange={onChange}
                  />
                  {localError.warrantyFinalDate && (
                    <small className="form-text text-danger">
                      {localError.warrantyFinalDate}
                    </small>
                  )}
                </div>
                <div className="form-group col-6">
                  <label htmlFor="document">Invoice PDF</label>
                  <input
                    type="file"
                    className="form-control-file"
                    id="document"
                    name="document"
                    value={newInvoice.document}
                    onChange={onChangeFile}
                  />
                  {localError.document && (
                    <small className="form-text text-danger">
                      {localError.document}
                    </small>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary mt-2 mb-2"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </fieldset>
          </form>
          <div className="row justify-content-center mb-4">
            <Pdf
              preview={true}
              previewSize={700}
              selectedFile={uploadedFile.file}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AddInvoice;
