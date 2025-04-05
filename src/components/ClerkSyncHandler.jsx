// src/components/ClerkSyncHandler.jsx
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ClerkSyncHandler = () => {
  const { user, isSignedIn } = useUser();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const syncClerkUser = async () => {
      if (isSignedIn && user) {
        const email = user?.emailAddresses?.[0]?.emailAddress;
        const name = user?.fullName || user?.username || "Clerk User";

        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/clerk-auth`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name }),
          });

          const data = await res.json();
          console.log("✅ Synced Clerk User", data);

          if (res.ok) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/dashboard");
          } else {
            alertify.error(data.message || "Login failed.");
          }
        } catch (err) {
          console.error("❌ Clerk sync error:", err);
        }
      }
    };

    syncClerkUser();
  }, [isSignedIn, user]);

  return null;
};

export default ClerkSyncHandler;
