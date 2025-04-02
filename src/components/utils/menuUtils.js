// utils/menuUtils.js
export const extractAdminPaths = (menu) =>
    Array.isArray(menu)
      ? menu.map((item) => item.href).filter(Boolean)
      : [];
  