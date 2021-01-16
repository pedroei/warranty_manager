import React, { FormEvent, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import UserContext from '../../context/user/userContext';

// Needs to be here to properly extend and get the history props
interface NavBarProps {
  appName: string;
}

const Navbar: React.FC<NavBarProps> = ({ appName }) => {
  const userContext: any = useContext(UserContext);

  const { isAuthenticated, user, logout } = userContext;

  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    setActiveLink(window.location.pathname);
    // eslint-disable-next-line
  }, [window.location.pathname]);

  // Search submit
  // const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   console.log('Tried to search');
  // };

  const authLinks = (
    <>
      <li className={`nav-item ${activeLink === '/' && 'active'}`}>
        <Link className="nav-link" to="/" onClick={() => setActiveLink('/')}>
          Invoices
          <span className="sr-only">(current)</span>
        </Link>
      </li>
      <li className={`nav-item ${activeLink === '/addinvoice' && 'active'}`}>
        <Link
          className="nav-link"
          to="/addinvoice"
          onClick={() => setActiveLink('/addinvoice')}
        >
          Add Invoice
        </Link>
      </li>
      {/* Add invoice */}
    </>
  );

  const guestLinks = (
    <>
      <li className={`nav-item ${activeLink === '/login' && 'active'}`}>
        <Link
          className="nav-link"
          to="/login"
          onClick={() => setActiveLink('/login')}
        >
          Login
        </Link>
      </li>
      <li className={`nav-item ${activeLink === '/register' && 'active'}`}>
        <Link
          className="nav-link"
          to="/register"
          onClick={() => setActiveLink('/register')}
        >
          Register
        </Link>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        {appName}
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor02"
        aria-controls="navbarColor02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor02">
        <ul className="navbar-nav mr-auto">
          {isAuthenticated ? authLinks : guestLinks}
        </ul>
        {isAuthenticated && user.name && (
          <>
            <span className="navbar-text mr-5 text-white">
              Hello, {user.name}!
            </span>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => logout()}>
                  Logout
                </a>
              </li>
            </ul>
          </>
        )}
        {/* {isAuthenticated && (
          <form className="form-inline my-2 my-lg-0">
            <input
              className="form-control mr-sm-2"
              type="text"
              placeholder="Search"
            />
            <button
              className="btn btn-secondary my-2 my-sm-0"
              type="submit"
              onClick={handleSubmit}
            >
              Search
            </button>
          </form>
        )} */}
      </div>
    </nav>
  );
};

export default Navbar;
