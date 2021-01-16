import { useContext, useEffect } from 'react';
import Invoices from './invoices/Invoices';

import UserContext from '../../context/user/userContext';
import { RouteComponentProps } from 'react-router-dom';

// Needs to be here to properly extend and get the history props
interface HomeProps extends RouteComponentProps {
  filter: string;
}

const invoices = [
  {
    id: 1,
    title: 'Computador',
    storeName: 'Fnac Portugal',
    storeUrl: 'www.fnac.pt',
    document: 'D:/docs/fatura1',
    warrantyFinalDate: '21/12/2021',
  },
  {
    id: 2,
    title: 'Fones',
    storeName: 'Worten',
    storeUrl: 'www.worten.pt',
    document: 'D:/docs/fatura2',
    warrantyFinalDate: '12/07/2022',
  },
  {
    id: 3,
    title: 'Iphone X',
    storeName: 'Vodafone',
    storeUrl: 'www.vodafone.pt',
    document: 'D:/docs/fatura3',
    warrantyFinalDate: '16/01/2024',
  },
  {
    id: 4,
    title: 'Microsoft HoloLens',
    storeName: 'Amazon ES',
    storeUrl: 'www.amazon.es',
    document: 'D:/docs/fatura4',
    warrantyFinalDate: '25 05 2024',
  },
];

const Home: React.FC<HomeProps> = ({ filter, history }) => {
  const userContext: any = useContext(UserContext);
  const { isAuthenticated } = userContext;

  useEffect(() => {
    if (!isAuthenticated) {
      history.push('/login');
    }

    // eslint-disable-next-line
  }, [isAuthenticated, history]);

  if (filter) {
    // This is to filter the order that appears inthe invoices, "most recent" or "date to end"
    console.log(filter);
  }

  return (
    <div className="container">
      <Invoices invoices={invoices} />
    </div>
  );
};

export default Home;
