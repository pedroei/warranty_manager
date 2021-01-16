import { Fragment } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import AddInvoice from './components/pages/AddInvoice';
import Login from './components/pages/Login';
import Register from './components/pages/Register';

//Context
import UserState from './context/user/UserState';

// App name
const appName = 'Warranty Manager';

const App: React.FC = () => {
  return (
    <UserState>
      <Router>
        <Fragment>
          <Navbar appName={appName} />
          <div className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/addinvoice" component={AddInvoice} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
            </Switch>
          </div>
        </Fragment>
      </Router>
    </UserState>
  );
};

export default App;