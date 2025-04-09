import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../context/LoaderContext";
import { useAuth as useAppAuth } from "../context/AuthContext";

export default function useClerkAuthHome() {
  const { isLoaded, getToken } = useAuth();
  const { isSignedIn, user } = useUser();
  const { setIsLoading } = useLoader();
  const { login } = useAppAuth();
  const navigate = useNavigate();
  const hasSynced = useRef(false); // 🧠 prevents double run

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isSignedIn || !user) return;
      if (hasSynced.current) return;
      hasSynced.current = true;

      setIsLoading(true);

      console.log("🔄 Clerk Loaded:", isLoaded);
      console.log("🔄 Signed In:", isSignedIn);
      console.log("🔄 User:", user);

      const token = await getToken();
      const email = user?.emailAddresses?.[0]?.emailAddress;
      const name = user?.fullName || user?.username || "Google User";

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/clerk-auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email, name }),
        });

        const data = await res.json();
        if (res.ok) {
          login(data.user, data.token);
          setIsLoading(false);
          navigate("/dashboard");
        } else {
          alert("Failed to sync user.");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("❌ Clerk sync error:", err);
        setIsLoading(false);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user]);
}
