import { SignIn } from "@clerk/clerk-react";

const ClerkLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn
        path="/sign-in"
        routing="path"
        redirectUrl="/"
      />
    </div>
  );
};

export default ClerkLogin;
