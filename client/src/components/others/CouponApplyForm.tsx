import React from "react";
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { compose } from "redux";
import renderFormField from "../../helpers/renderFormField";
import { required } from "../../helpers/validation";

// Props interface for the form
interface CouponApplyFormProps {
  onSubmit: (values: { coupon: string }) => void; // Declare onSubmit as a required prop
}

// Combine form props with the additional onSubmit prop
type Props = CouponApplyFormProps & InjectedFormProps<{ coupon: string }, CouponApplyFormProps>;

const CouponApplyForm: React.FC<Props> = ({
  handleSubmit,
  submitting,
  onSubmit,
  submitFailed,
  change
}) => {

  const handleAutoFillCoupon = (couponCode: string) => {
    change("coupon", couponCode); // Use change method to autofill coupon field
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`needs-validation ${submitFailed ? "was-validated" : ""}`}
      noValidate
    >
      <Field
        name="coupon"
        type="text"
        label="Have a coupon?"
        component={renderFormField}
        placeholder="Coupon code"
        validate={[required]}
      />
              <button
          type="button"
          className="btn btn-sm btn-secondary mt-3 ms-2"
          onClick={() => handleAutoFillCoupon("winter20")} // On click, autofill the coupon field with "winter20"
        >
          Winter20
        </button>
      <button
        type="submit"
        className="btn btn-sm btn-primary mt-3 float-end"
        disabled={submitting}
      >
        Apply
      </button>
    </form>
  );
};

export default compose(
  reduxForm<{ coupon: string }, CouponApplyFormProps>({
    form: "couponApplyForm", // Ensure form name is consistent
  })
)(CouponApplyForm);
