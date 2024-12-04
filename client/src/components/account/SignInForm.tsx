'use client'
import React from "react";

// import { signIn } from "next-auth/react";
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { compose } from "redux";
import Link from 'next/link';
import renderFormGroupField from "../../helpers/renderFormGroupField";
import {

  maxLength20,
  minLength8,

} from "../../helpers/validation";
import { ReactComponent as IconPhone } from "bootstrap-icons/icons/phone.svg";
import { ReactComponent as IconShieldLock } from "bootstrap-icons/icons/shield-lock.svg";
import { required, maxLengthMobileNo, minLengthMobileNo, digit, isEmail, isMobileNumber } from '@/helpers/validators';

// Define form values type
interface SignInFormValues {
  mobileNo: string;
  password: string;
}

// Define component props type
interface SignInFormProps {
  onSubmit: (values: SignInFormValues) => void;
  status?: "idle" | "loading" | "success" | "failed"; // Add status prop type
  uerror?:any
}

// Combined props type
type CombinedProps = InjectedFormProps<SignInFormValues, SignInFormProps> & SignInFormProps;

const SignInForm: React.FC<CombinedProps> = ({
  handleSubmit,
  submitting,
  onSubmit,
  submitFailed,
  status,
  uerror
}) => {

  // Custom Validator for Mobile Number or Email
const mobileOrEmailValidator = (value: string) => {
  if (!value) return undefined;  // If no value, just return undefined (required validation will handle it)
  
  if (isEmail(value)) {
    // Email validation (you can adjust the regex or use a library like 'validator')
    return isEmail(value) ? undefined : 'Invalid email';
  }

  if (isMobileNumber(value)) {
    // Mobile number validation
    return digit(value) && minLengthMobileNo(value) && maxLengthMobileNo(value) 
      ? undefined
      : 'Invalid mobile number';
  }

  return 'Invalid input: Must be a valid email or mobile number';
};
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`needs-validation ${submitFailed ? "was-validated" : ""}`}
      noValidate
    >
      <Field
        name="mobileNo"
        type="text"
        label="Mobile no"
        component={renderFormGroupField}
        placeholder="Enter mobile number or email"
        icon={IconPhone}
        validate={[required]}
        required={true}
        max="999999999999999"
        min="9999"
        className="mb-3"
      />
      <Field
        name="password"
        type="password"
        label="Your password"
        component={renderFormGroupField}
        placeholder="******"
        icon={IconShieldLock}
        validate={[required, maxLength20, minLength8]}
        required={true}
        maxLength="20"
        minLength="8"
        className="mb-3"
      />
      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary mb-3"
          disabled={submitting}
        >
                {status === 'loading' ? 'Log In...' : 'Log In'}
        </button>
        {status === 'failed' && <p style={{ color: 'red' }}>Error: {uerror?uerror:''}</p>}
      </div>
      <Link className="float-start" href="/account/signup" title="Sign Up">
        Create your account
      </Link>
      <Link
        className="float-end"
        href="/account/forgotpassword"
        title="Forgot Password"
      >
        Forgot password?
      </Link>
      <div className="clearfix"></div>
      <hr />
      <div className="row">
        <div className="col- text-center">
          <p className="text-muted small">Or you can join with</p>
        </div>
        <div className="col- text-center">
          <Link href="/" className="btn btn-light text-white bg-twitter me-3">
            <i className="bi bi-twitter-x" />
          </Link>
          <Link href="/" className="btn btn-light text-white me-3 bg-facebook">
            <i className="bi bi-facebook mx-1" />
          </Link>
          <Link href="/" className="btn btn-light text-white me-3 bg-google">
            <i className="bi bi-google mx-1" />
          </Link>
          {/* <button onClick={() => signIn('google')}>Sign in with Google</button> */}
        </div>
      </div>
    </form>
  );
};

export default compose(
  reduxForm<SignInFormValues, SignInFormProps>({
    form: "signin",
  })
)(SignInForm);
