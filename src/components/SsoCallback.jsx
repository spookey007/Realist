// src/pages/sso-callback.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useLoader } from "../context/LoaderContext";

const SsoCallback = () => {
  const { handleRedirectCallback } = useClerk(); // ✅ CORRECTED
  const navigate = useNavigate();
  const { setIsLoading } = useLoader();

  useEffect(() => {
    setIsLoading(true);
    const handleSSO = async () => {
      try {
        console.log("🔄 Handling SSO redirect...");
        await handleRedirectCallback(); // Clerk finalizes the login
        // navigate("/google-callback"); // ✅ Redirect after success
      } catch (err) {
        setIsLoading(false);
        navigate("/");
        console.error("❌ SSO Callback Error:", err);
      }
    };

    handleSSO();
  }, [handleRedirectCallback, navigate]);
};

export default SsoCallback;
