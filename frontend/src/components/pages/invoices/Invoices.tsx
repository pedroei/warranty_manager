import Pdf from '../pdf/Pdf';

const Invoices: React.FC<InvoicesProps> = ({ invoices }) => {
  return (
    <div className="mt-5">
      <h1>All Invoices</h1>
      <div className="list-group mt-4">
        {invoices &&
          invoices.map((invoice) => (
            <a
              key={invoice.id}
              href="/#"
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
            >
              <div>
                <h3>{invoice.title}</h3>
                <h5>{invoice.storeName}</h5>
                <span>{invoice.warrantyFinalDate}</span>
              </div>
              {/* <img src="http://via.placeholder.com/100x100" alt="" /> */}
              <Pdf
                preview={true}
                previewSize={100}
                selectedFile={invoice.document}
              />
            </a>
          ))}
      </div>
    </div>
  );
};

export default Invoices;
