// app/page.tsx
"use client";
import SignInView from '@/views/account/SignIn';
type Props = {
  children: React.ReactNode;
};

export default function SigninPage({ children }: Props) {
  return (

    <>
      <SignInView />
    </>

  );
}
