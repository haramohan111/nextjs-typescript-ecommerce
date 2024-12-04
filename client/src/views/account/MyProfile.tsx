"use client"
import React, { useEffect, useState } from "react";
import ProfileForm from "../../components/account/ProfileForm";
import ChangePasswordForm from "../../components/account/ChangePasswordForm";
import SettingForm from "../../components/account/SettingForm";
import CardListForm from "../../components/account/CardListForm";

interface ProfileValues {
  // Define the shape of ProfileValues based on your form
}

interface PasswordValues {
  // Define the shape of PasswordValues based on your form
}

const MyProfileView: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    // Fetch user ID from middleware's custom header
    const userIdFromHeader = document.cookie
      .split('; ')
      .find((row) => row.startsWith('x-user-id='))
      ?.split('=')[1];
      console.log("login")
      console.log(userIdFromHeader)
    if (userIdFromHeader) {
      setUserId(userIdFromHeader);
    }
  }, []);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const onSubmitProfile = async (values: ProfileValues) => {
    alert(JSON.stringify(values));
  };

  const onSubmitChangePassword = async (values: PasswordValues) => {
    alert(JSON.stringify(values));
  };

  const onImageChange = async (obj: File | null) => {
    if (obj) {
      const val = await getBase64(obj);
      setImagePreview(val as string);
    } else {
      setImagePreview("");
    }
  };

  const getBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="container-fluid my-3">
      <div className="row">
        <div className="col-md-4">
          {/* <ProfileForm
            onSubmit={onSubmitProfile}
            onImageChange={onImageChange}
            imagePreview={imagePreview}
          /> */}
        </div>
        <div className="col-md-8">
          <ChangePasswordForm onSubmit={onSubmitChangePassword} />
          <br />
          <SettingForm />
          <br />
          <CardListForm />
        </div>
      </div>
    </div>
  );
};

export default MyProfileView;
