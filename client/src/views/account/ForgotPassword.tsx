import React, { lazy, Component } from "react";
const ForgotPasswordForm = lazy(() =>
  import("../../components/account/ForgotPasswordForm")
);

interface ForgotPasswordViewProps {}

interface ForgotPasswordViewState {}

class ForgotPasswordView extends Component<ForgotPasswordViewProps, ForgotPasswordViewState> {
  onSubmit = async (values: any) => {
    alert(JSON.stringify(values));
  };

  render() {
    return (
      <div className="container my-3">
        <div className="row justify-content-md-center ">
          <div className="col-md-4 p-3 border">
            <h4 className="text-center">Forgot Password</h4>
            <ForgotPasswordForm onSubmit={this.onSubmit} />
          </div>
        </div>
      </div>
    );
  }
}

export default ForgotPasswordView;
