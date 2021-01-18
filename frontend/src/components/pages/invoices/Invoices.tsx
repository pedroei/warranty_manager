import { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pdf from '../pdf/Pdf';

const Invoices: React.FC<InvoicesProps> = ({ invoices }) => {
  const [invoicesOrdered, setInvoicesOrdered] = useState(invoices);

  const [
    warrantiesLessOneMonth,
    setWarrantiesLessOneMonth,
  ] = useState<Array<string> | null>([]);

  const invoicesReverseOrder = invoices.map((invoice) => invoice).reverse();

  useEffect(() => {
    setInvoicesOrdered(invoicesReverseOrder);
  }, [invoices]);

  const showAlerts = () => {
    if (warrantiesLessOneMonth) {
      invoices.forEach((i) => {
        const date = new Date(i.warrantyFinalDate);
        const todayDate = new Date();
        const missingTime = date.getTime() - todayDate.getTime();

        if (
          missingTime < 2678400 * 1000 &&
          !warrantiesLessOneMonth.includes(i.title)
        ) {
          console.log(i.title);
          setWarrantiesLessOneMonth([...warrantiesLessOneMonth, i.title]);
        }
      });
    }
  };
  showAlerts();
  if (warrantiesLessOneMonth && warrantiesLessOneMonth.length > 0) {
    setTimeout(() => {
      setWarrantiesLessOneMonth(null);
    }, 5000);
  }

  const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
    let invoiceNewOrder = invoices.map((invoice) => invoice);
    if (e.target.value === 'warrantyToEnd') {
      invoiceNewOrder = invoiceNewOrder.sort((a, b) => {
        let c = a.warrantyFinalDate.split('-').reverse().join('');
        let d = b.warrantyFinalDate.split('-').reverse().join('');

        return d.localeCompare(c);
      });
      setInvoicesOrdered(invoiceNewOrder);
      // console.log(invoicesOrdered);
    } else if (e.target.value === 'recent') {
      setInvoicesOrdered(invoicesReverseOrder);
      // console.log(invoicesOrdered);
    }
  };

  return (
    <>
      {warrantiesLessOneMonth &&
        warrantiesLessOneMonth.map((inv, idx) => (
          <div key={idx} className="alert alert-dismissible alert-warning mt-3">
            <button type="button" className="close" data-dismiss="alert">
              &times;
            </button>
            <strong>Attention!</strong> The warranty of the product{' '}
            <a href="#" className="alert-link">
              {inv}
            </a>{' '}
            is finishing
          </div>
        ))}
      <div className="mt-5">
        <div className="row pr-4">
          {invoices.length > 0 ? (
            <>
              <h1 className="col-4">All Invoices</h1>
              <form className="form-group col-3 offset-5">
                <select className="custom-select offset-1" onChange={onChange}>
                  <option value="recent">Most Recent</option>
                  <option value="warrantyToEnd">Ending Warranty</option>
                </select>
              </form>
            </>
          ) : (
            <h1>No Invoices to display</h1>
          )}
        </div>
        <div className="list-group mt-4">
          {invoices &&
            invoicesOrdered.map((invoice) => (
              <Link
                key={invoice.id}
                to={`/invoice/${invoice.id}`}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <div>
                  <h3>{invoice.title}</h3>
                  <h5>{invoice.storeName}</h5>
                  <span>{invoice.warrantyFinalDate}</span>
                </div>
                {/* <img src="http://via.placeholder.com/100x100" alt="" /> */}
                {/* Pdf Preview makes app slow but works well */}
                <Pdf
                  preview={true}
                  previewSize={100}
                  selectedFile={invoice.document}
                />
              </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default Invoices;
