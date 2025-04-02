import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const useIsAdminRoute = () => {
  const { menu } = useAuth();
  const location = useLocation();
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    const allPaths = extractPaths(menu);
    setIsAdminRoute(allPaths.includes(location.pathname));
  }, [location.pathname, menu]); // ✅ React when menu updates

  const extractPaths = (menuList) => {
    let paths = [];
    menuList.forEach((item) => {
      paths.push(item.href);
      if (item.subMenu?.length) {
        item.subMenu.forEach((sub) => paths.push(sub.href));
      }
    });
    return paths;
  };

  return isAdminRoute;
};

export default useIsAdminRoute;
