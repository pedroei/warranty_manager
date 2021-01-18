import { Link } from 'react-router-dom';
import Pdf from '../pdf/Pdf';

const Invoices: React.FC<InvoicesProps> = ({ invoices }) => {
  let invoicesReverseOrder = invoices.map((invoice) => invoice).reverse();
  return (
    <div className="mt-5">
      {invoices.length > 0 ? (
        <h1>All Invoices</h1>
      ) : (
        <h1>No Invoices to display</h1>
      )}
      <div className="list-group mt-4">
        {invoices &&
          invoicesReverseOrder.map((invoice) => (
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
  );
};

export default Invoices;
