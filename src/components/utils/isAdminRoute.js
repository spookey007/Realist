export const isAdminRoute = (menu, pathname) => {
    if (!Array.isArray(menu)) return false;
    const allPaths = menu.map((m) => m.href);
    return allPaths.includes(pathname);
  };
  