import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import UserContext from '../../context/user/userContext';

const Login: React.FC<RouteComponentProps> = (props) => {
  const userContext: any = useContext(UserContext);

  const { login, isAuthenticated, error, clearErrors } = userContext;

  useEffect(() => {
    if (isAuthenticated) {
      props.history.push('/');
    }

    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const [userLogin, setUserLogin] = useState({
    email: '',
    password: '',
  });

  if (isAuthenticated) return null;

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUserLogin({ ...userLogin, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    login(userLogin);
  };

  if (error) {
    setTimeout(() => {
      clearErrors();
    }, 3500);
  }

  return (
    <>
      <div className="row justify-content-center">
        <form className="bg-color-gray mt-5 p-5 width-60">
          {error && <h4 className="text-danger text-center">{error}</h4>}
          <fieldset className="container">
            <legend>Login</legend>

            <div className="form-group">
              <label htmlFor="loginEmail">Email address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                id="loginEmail"
                placeholder="Enter email"
                value={userLogin.email}
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                id="loginPassword"
                placeholder="Password"
                value={userLogin.password}
                onChange={onChange}
                autoComplete="off"
              />
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

export default Login;
