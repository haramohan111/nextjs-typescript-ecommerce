"use client"
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { compose } from "redux";
import renderFormGroupField from "../../helpers/renderFormGroupField";
import { required, maxLength20, minLength8 } from "../../helpers/validation";
import { ReactComponent as IconShieldLock } from "bootstrap-icons/icons/shield-lock.svg";

// Define the shape of the form values
interface ChangePasswordFormValues {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

// Define the props for the ChangePasswordForm component
interface ChangePasswordFormProps {
  onSubmit: (values: ChangePasswordFormValues) => void; // onSubmit is required
}

// Combined props for the form
type CombinedProps = InjectedFormProps<ChangePasswordFormValues, ChangePasswordFormProps> & ChangePasswordFormProps;

// Define the ChangePasswordForm component
const ChangePasswordForm: React.FC<CombinedProps> = ({
  handleSubmit,
  submitting,
  onSubmit,
  submitFailed,
}) => {
  return (
    <div className="card border-info">
      <h6 className="card-header bg-info text-white">
        <i className="bi bi-key"></i> Change Password
      </h6>
      <div className="card-body">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`needs-validation ${submitFailed ? "was-validated" : ""}`}
          noValidate
        >
          <Field
            name="currentPassword"
            type="password"
            label="Current Password"
            component={renderFormGroupField}
            placeholder="******"
            icon={IconShieldLock}
            validate={[required, maxLength20, minLength8]}
            required={true}
            maxLength={20}
            minLength={8}
            className="mb-3"
          />
          <Field
            name="password"
            type="password"
            label="New Password"
            component={renderFormGroupField}
            placeholder="******"
            icon={IconShieldLock}
            validate={[required, maxLength20, minLength8]}
            required={true}
            maxLength={20}
            minLength={8}
            className="mb-3"
          />
          <Field
            name="confirmPassword"
            type="password"
            label="Confirm New Password"
            component={renderFormGroupField}
            placeholder="******"
            icon={IconShieldLock}
            validate={[required, maxLength20, minLength8]}
            required={true}
            maxLength={20}
            minLength={8}
            className="mb-3"
          />
          <button
            type="submit"
            className="btn btn-info d-flex"
            disabled={submitting}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

// Use reduxForm and ensure to pass the props correctly
export default compose(
  reduxForm<ChangePasswordFormValues, ChangePasswordFormProps>({
    form: "changepassword",
  })
)(ChangePasswordForm);
