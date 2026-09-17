import { ENV } from '../utils/env';
import { LOGIN_ERRORS } from '../pages/LoginPage';

export interface Credentials {
  email: string;
  password: string;
}

export const USERS = {
  admin: {
    email: ENV.adminEmail,
    password: ENV.adminPassword,
  },
  wrongPassword: {
    email: ENV.adminEmail,
    password: 'WrongPassword!123',
  },
  unknownAccount: {
    email: 'not.a.real.user@example.com',
    password: 'Whatever!123',
  },
} satisfies Record<string, Credentials>;

export interface InvalidLoginCase {
  title: string;
  credentials: Credentials;
  /** Message the application is expected to render for this input. */
  expectedError: string;
}

/** Data set driving the negative login tests. */
export const INVALID_LOGIN_CASES: InvalidLoginCase[] = [
  {
    title: 'wrong password for a valid email',
    credentials: USERS.wrongPassword,
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
  {
    title: 'email that does not exist',
    credentials: USERS.unknownAccount,
    expectedError: LOGIN_ERRORS.invalidCredentials,
  },
  {
    title: 'password that is only whitespace',
    credentials: { email: ENV.adminEmail, password: '   ' },
    // The server trims the value, so it is reported as an empty field.
    expectedError: LOGIN_ERRORS.passwordRequired,
  },
  {
    title: 'empty password',
    credentials: { email: ENV.adminEmail, password: '' },
    expectedError: LOGIN_ERRORS.passwordRequired,
  },
  {
    title: 'empty email',
    credentials: { email: '', password: ENV.adminPassword },
    expectedError: LOGIN_ERRORS.emailRequired,
  },
];
