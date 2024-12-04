// app/page.tsx
"use client";
import SignUpView from '@/views/account/SignUp';
type Props = {
  children: React.ReactNode;
};

export default function SigninPage({ children }: Props) {
  return (

    <>
      <SignUpView />
    </>

  );
}
