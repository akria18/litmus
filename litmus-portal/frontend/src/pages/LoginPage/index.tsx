import { Button, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InputField from '../../components/InputField';
import config from '../../config';
import useActions from '../../redux/actions';
import * as UserActions from '../../redux/actions/user';
import { history } from '../../redux/configureStore';
import { validateStartEmptySpacing } from '../../utils/validate';
import useStyles from './styles';

interface authData {
  username: string;
  password: string;
}

const LoginPage = () => {
  const { t } = useTranslation();
  const user = useActions(UserActions);
  const classes = useStyles();
  const [authData, setAuthData] = useState<authData>({
    username: '',
    password: '',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    fetch(`${config.auth.url}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authData),
    })
      .then((response) => response.json())
      .then((data) => {
        if ('error' in data) {
          console.error(data);
        } else {
          user.setUserDetails(data.access_token);
          history.push('/');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className={classes.rootContainer}>
      <div className={classes.mainDiv}>
        <div className={classes.box}>
          <img src="icons/LitmusLogo.png" alt="litmus logo" />
          <Typography variant="h2" className={classes.heading}>
            {t('login.heading')} <strong>Litmus!</strong>
          </Typography>
          <Typography className={classes.description} gutterBottom>
            {t('login.subHeading1')}
            <img
              src="icons/kubernetes.png"
              alt="Kubernetes"
              className={classes.descImg}
            />
            {t('login.subHeading2')}
            <br />
          </Typography>
          <Typography className={classes.description}>
            {t('login.subHeading3')}
          </Typography>
          <form id="login-form" autoComplete="on" onSubmit={handleSubmit}>
            <div className={classes.inputDiv}>
              <InputField
                label="Username"
                value={authData.username}
                helperText={
                  validateStartEmptySpacing(authData.username)
                    ? 'Should not start with an empty space'
                    : ''
                }
                validationError={validateStartEmptySpacing(authData.username)}
                data-cy="inputEmail"
                required
                handleChange={(e) =>
                  setAuthData({
                    username: e.target.value,
                    password: authData.password,
                  })
                }
              />
              <InputField
                label="Password"
                type="password"
                required
                value={authData.password}
                // helperText={
                //   validatePassword(authData.password)
                //     ? 'Should be >= 6 & contain 1 alphanumeric character and a number'
                //     : ''
                // }
                // validationError={validatePassword(authData.password)}
                validationError={false}
                data-cy="inputPassword"
                handleChange={(e) =>
                  setAuthData({
                    username: authData.username,
                    password: e.target.value,
                  })
                }
              />
            </div>
            <Typography className={classes.forgotPasssword}>
              <Link
                to="/reset"
                className={classes.linkForgotPass}
                data-cy="forgotPassword"
              >
                {t('login.passwordForgot')}
              </Link>
            </Typography>
            <div className={classes.loginDiv}>
              <Button
                type="submit"
                className={classes.submitButton}
                data-cy="loginButton"
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>

      <div className={classes.imageDiv}>
        <img
          src="/icons/login.svg"
          alt="Login screen"
          className={classes.loginImage}
        />
      </div>
    </div>
  );
};

export default LoginPage;
