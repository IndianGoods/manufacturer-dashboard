import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { logout } from "../../store/slices/authSlice";
import Dropdown from "../ui/Dropdown";
import Button from "../ui/Button";

const Header = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Search query:", searchQuery);
  };

  return (
    <header
      className="bg-gray-900 shadow-sm border-b border-gray-900 w-full"
      style={{ height: "4rem", minHeight: "4rem" }}
    >
      <div
        className="flex items-center justify-between h-16 px-6 w-full"
        style={{ height: "4rem", minHeight: "4rem" }}
      >
        {/* Logo, Search Centered, Right Side */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Logo */}
          <div className="flex items-center mr-6">
            {/* <img src="/vite.svg" alt="Logo" className="h-7 w-7" /> */}
            <h1 className="text-white text-2xl font-bold">
              Indian<span className="text-red-500">Goods</span>
            </h1>
          </div>
          {/* Search Centered */}
          <div className="flex-1 flex justify-center">
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products, orders, customers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </form>
          </div>
        </div>
        {/* Right side */}
        <div className="flex items-center space-x-4 relative">
          {/* Notifications */}
          <button
            className="p-2 text-gray-400 hover:text-gray-300 relative"
            onClick={() => {
              setShowNotifications((prev) => !prev);
              if (!showNotifications) setShowUserMenu(false);
            }}
            aria-label="Show notifications"
          >
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-gray-900" />
          </button>
          {/* Notification Panel */}
          {showNotifications && (
            <div
              className="absolute right-40 top-16 z-50 w-96 bg-white rounded-xl shadow-2xl border border-gray-200"
              style={{ minWidth: 380 }}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-medium text-base">Alerts</span>
                <div className="flex items-center gap-2">
                  <button
                    className="text-xs font-medium text-primary-600 hover:underline px-2 py-1 rounded focus:outline-none"
                    onClick={() => {
                      /* TODO: implement mark all as read logic */
                    }}
                  >
                    Mark all as read
                  </button>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowNotifications(false)}
                    aria-label="Close notifications"
                  >
                    &#10005;
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                {/* Example notifications, replace with dynamic data */}
                <div className="px-4 py-3 flex gap-3 items-start">
                  <span className="mt-1 block h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <div className="font-medium text-xs text-gray-900">
                      Point of Sale &bull; Sunday at 11:30 AM
                    </div>
                    <div className="font-medium text-sm text-gray-800">
                      Your free trial of POS Pro has ended
                    </div>
                    <div className="text-gray-500 text-xs">
                      Select a POS subscription to continue selling in person.
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 flex gap-3 items-start">
                  <span className="mt-1 block h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <div className="font-medium text-xs text-gray-900">
                      Point of Sale &bull; Thursday at 4:31 PM
                    </div>
                    <div className="font-medium text-sm text-gray-800">
                      Your free trial of POS Pro ends in 3 days
                    </div>
                    <div className="text-gray-500 text-xs">
                      Your account will automatically switch to POS Lite.
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 flex gap-3 items-start">
                  <span className="mt-1 block h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <div className="font-medium text-xs text-gray-900">
                      Billing &bull; Wednesday at 4:28 PM
                    </div>
                    <div className="font-medium text-sm text-gray-800">
                      Let us know if you’ve registered for a tax number
                    </div>
                    <div className="text-gray-500 text-xs">
                      Update your billing settings if you have a tax number for
                      your business.
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 flex gap-3 items-start">
                  <span className="mt-1 block h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <div className="font-medium text-xs text-gray-900">
                      Settings &bull; Wednesday at 4:28 PM
                    </div>
                    <div className="font-medium text-sm text-gray-800">
                      Privacy settings are automated
                    </div>
                    <div className="text-gray-500 text-xs">
                      Privacy settings are configured and will stay in sync with
                      the latest recommendations as you set up your store. See
                      updates in the store activity log.
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 text-center text-gray-500 text-xs border-t">
                No more alerts
              </div>
            </div>
          )}
          {/* User menu - only one dropdown open at a time */}
          <div className="relative">
            <Dropdown
              align="right"
              open={showUserMenu}
              onOpenChange={(open) => {
                setShowUserMenu(open);
                if (open) setShowNotifications(false);
              }}
              offset={16}
              trigger={
                <button
                  className="flex items-center space-x-3 text-sm"
                  onClick={() => {
                    setShowUserMenu((prev) => !prev);
                    if (!showUserMenu) setShowNotifications(false);
                  }}
                >
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    <p className="text-sm font-medium text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-300">{user?.email}</p>
                  </div>
                  {user?.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  )}
                </button>
              }
            >
              <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
