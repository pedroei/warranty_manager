import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import UserContext from '../../context/user/userContext';

const Register: React.FC<RouteComponentProps> = (props) => {
  const userContext: any = useContext(UserContext);

  const { register, isAuthenticated, error, clearErrors, auth } = userContext;

  useEffect(() => {
    auth();
    if (localStorage.token || isAuthenticated) {
      props.history.push('/');
    }

    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [localError, setLocalError] = useState({
    name: '',
    email: '',
    password: '',
  });

  if (localStorage.token || isAuthenticated) return null;

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setNewUser({ ...newUser, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!newUser.name)
      return setLocalError({ ...localError, name: 'You need a name' });
    if (!newUser.email)
      return setLocalError({ ...localError, email: 'You must have a email' });
    if (!newUser.password)
      return setLocalError({
        ...localError,
        password: 'Please choose a password',
      });

    register(newUser);
  };

  if (error) {
    setTimeout(() => {
      clearErrors();
    }, 3500);
  }

  if (
    localError.name !== '' ||
    localError.email !== '' ||
    localError.password !== ''
  ) {
    setTimeout(() => {
      setLocalError({
        name: '',
        email: '',
        password: '',
      });
    }, 3500);
  }

  return (
    <>
      <div className="row justify-content-center">
        <form className="mt-5 p-5 bg-color-gray width-60">
          <fieldset className="container">
            <legend>Register</legend>
            <div className="form-group">
              <label htmlFor="registerName">Name</label>
              <input
                type="text"
                className="form-control"
                id="registerName"
                placeholder="Name"
                name="name"
                value={newUser.name}
                onChange={onChange}
              />
              {localError.name ? (
                <small className="form-text text-danger">
                  {localError.name}
                </small>
              ) : (
                <small className="form-text text-muted">
                  Tell us your name.
                </small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="registerEmail">Email address</label>
              <input
                type="email"
                className="form-control"
                id="registerEmail"
                placeholder="Enter email"
                name="email"
                value={newUser.email}
                onChange={onChange}
              />
              {localError.email ? (
                <small className="form-text text-danger">
                  {localError.email}
                </small>
              ) : error && error.toLowerCase().includes('email') ? (
                <small className="form-text text-danger">{error}</small>
              ) : (
                <small className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="registerPassword">Password</label>
              <input
                type="password"
                className="form-control"
                id="registerPassword"
                placeholder="Password"
                name="password"
                value={newUser.password}
                onChange={onChange}
                autoComplete="off"
              />
              {localError.password ? (
                <small className="form-text text-danger">
                  {localError.password}
                </small>
              ) : error && error.toLowerCase().includes('password') ? (
                <small className="form-text text-danger">{error}</small>
              ) : (
                <small className="form-text text-muted">
                  Don't share your password with anyone.
                </small>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default Register;
