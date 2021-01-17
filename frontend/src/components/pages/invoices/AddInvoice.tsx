import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import UserContext from '../../../context/user/userContext';

const AddInvoice: React.FC<RouteComponentProps> = ({ history }) => {
  const userContext: any = useContext(UserContext);
  const { isAuthenticated } = userContext;

  const [newInvoice, setNewInvoice] = useState({
    title: '',
    storeName: '',
    storeUrl: '',
    document: '',
    warrantyFinalDate: '',
  });

  const [localError, setLocalError] = useState({
    title: '',
    storeName: '',
    storeUrl: '',
    document: '',
    warrantyFinalDate: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }

    // eslint-disable-next-line
  }, [isAuthenticated, history]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewInvoice({ ...newInvoice, [e.target.name]: e.target.value });

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

    console.log(newInvoice);
    setNewInvoice({
      title: '',
      storeName: '',
      storeUrl: '',
      document: '',
      warrantyFinalDate: '',
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

          <div className="form-group">
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
          <div className="form-group">
            <label htmlFor="document">Invoice PDF</label>
            <input
              type="file"
              className="form-control-file"
              id="document"
              name="document"
              value={newInvoice.document}
              onChange={onChange}
            />
            {localError.document && (
              <small className="form-text text-danger">
                {localError.document}
              </small>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default AddInvoice;
