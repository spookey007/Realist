return (
  <div className={`fixed inset-y-0 left-0 z-30 w-56 md:w-64 bg-gray-800 text-white transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="flex flex-col h-full">
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between p-1.5 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center space-x-1.5">
          <img src="/logo.png" alt="Logo" className="h-6 w-6 md:h-8 md:w-8" />
          <span className="text-xs md:text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Realist</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-0.5 rounded-md hover:bg-gray-700 focus:outline-none transition-colors duration-200"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-1">
        <ul className="space-y-0.5">
          {menu.map((item, index) => (
            <li key={index}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(index)}
                    className="flex items-center justify-between w-full px-2 py-1.5 text-xs md:text-sm hover:bg-gray-700/80 active:bg-gray-700 rounded-md transition-all duration-200 group"
                  >
                    <div className="flex items-center space-x-1.5">
                      {item.icon && <span className="text-gray-400 text-xs md:text-sm group-hover:text-blue-400 transition-colors duration-200">{item.icon}</span>}
                      <span className="group-hover:text-blue-400 transition-colors duration-200">{item.label}</span>
                    </div>
                    <svg
                      className={`w-3 h-3 md:w-4 md:h-4 transform transition-all duration-200 ${openSubmenus[index] ? 'rotate-180 text-blue-400' : 'text-gray-400'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openSubmenus[index] && (
                    <ul className="pl-2 mt-0.5 space-y-0.5">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subItem.path}
                            className="flex items-center px-2 py-1 text-[10px] md:text-xs text-gray-300 hover:bg-gray-700/80 active:bg-gray-700 rounded-md transition-all duration-200 group"
                          >
                            {subItem.icon && <span className="mr-1.5 text-gray-400 text-[10px] md:text-xs group-hover:text-blue-400 transition-colors duration-200">{subItem.icon}</span>}
                            <span className="group-hover:text-blue-400 transition-colors duration-200">{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center px-2 py-1.5 text-xs md:text-sm hover:bg-gray-700/80 active:bg-gray-700 rounded-md transition-all duration-200 group"
                >
                  {item.icon && <span className="mr-1.5 text-gray-400 text-xs md:text-sm group-hover:text-blue-400 transition-colors duration-200">{item.icon}</span>}
                  <span className="group-hover:text-blue-400 transition-colors duration-200">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-1.5 border-t border-gray-700 bg-gray-900">
        <div className="flex items-center space-x-1.5">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
            <span className="text-[10px] md:text-xs font-medium text-white">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] md:text-xs font-medium truncate text-white">{user?.name || 'User'}</p>
            <p className="text-[10px] md:text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const renderMobileSidebar = () => (
  <div className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300">
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out">
      <div className="flex flex-col h-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-gray-900">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Realist</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-700 focus:outline-none transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-1">
            {menu.map((item, index) => (
              <li key={index}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(index)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-gray-700/80 active:bg-gray-700 rounded-md transition-all duration-200 group"
                    >
                      <div className="flex items-center space-x-2">
                        {item.icon && <span className="text-gray-400 group-hover:text-blue-400 transition-colors duration-200">{item.icon}</span>}
                        <span className="group-hover:text-blue-400 transition-colors duration-200">{item.label}</span>
                      </div>
                      <svg
                        className={`w-4 h-4 transform transition-all duration-200 ${openSubmenus[index] ? 'rotate-180 text-blue-400' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openSubmenus[index] && (
                      <ul className="pl-4 mt-1 space-y-1">
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className="flex items-center px-3 py-2 text-xs text-gray-300 hover:bg-gray-700/80 active:bg-gray-700 rounded-md transition-all duration-200 group"
                            >
                              {subItem.icon && <span className="mr-2 text-gray-400 group-hover:text-blue-400 transition-colors duration-200">{subItem.icon}</span>}
                              <span className="group-hover:text-blue-400 transition-colors duration-200">{subItem.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className="flex items-center px-3 py-2 text-sm hover:bg-gray-700/80 active:bg-gray-700 rounded-md transition-all duration-200 group"
                  >
                    {item.icon && <span className="mr-2 text-gray-400 group-hover:text-blue-400 transition-colors duration-200">{item.icon}</span>}
                    <span className="group-hover:text-blue-400 transition-colors duration-200">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile User Profile */}
        <div className="p-3 border-t border-gray-700 bg-gray-900">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-xs font-medium text-white">{user?.name?.charAt(0) || 'U'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
); 