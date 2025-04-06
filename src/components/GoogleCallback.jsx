import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useLoader } from "../context/LoaderContext";
import { useAuth as useAppAuth } from "../context/AuthContext";

export default function GoogleCallback() {
  const { isLoaded, getToken } = useAuth();
  const { isSignedIn, user } = useUser();
  const { setIsLoading } = useLoader();
  const { setUser } = useAppAuth();
  const navigate = useNavigate();
  const hasSynced = useRef(false); // 🧠 prevents double run

  useEffect(() => {
    setIsLoading(true);
    const syncUser = async () => {
      if (hasSynced.current) return; // ✅ prevent re-sync
      if (!isLoaded || !isSignedIn || !user) return;

      hasSynced.current = true; // ✅ lock it

    //   console.log("Clerk Loaded:", isLoaded);
    //   console.log("Signed In:", isSignedIn);
    //   console.log("User:", user);

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
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("authToken", data.token);
          navigate("/dashboard");
          setIsLoading(false);
        } else {
          alert("Failed to sync user.");
        }
      } catch (err) {
        console.error("❌ Sync error:", err);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  return <div className="p-8 text-white">Finishing Google login...</div>;
}
