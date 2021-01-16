const Invoices: React.FC<InvoicesProps> = ({ invoices }) => {
  return (
    <div className="mt-5">
      <h1>All Invoices</h1>
      <ul className="list-group mt-4">
        {invoices &&
          invoices.map((invoice) => (
            <li
              key={invoice.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h3>{invoice.title}</h3>
                <h5>{invoice.storeName}</h5>
                <span>{invoice.warrantyFinalDate}</span>
              </div>
              <img src="http://via.placeholder.com/100x100" alt="" />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Invoices;
