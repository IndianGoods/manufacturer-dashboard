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
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-300 relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-gray-900" />
          </button>
          {/* User menu */}
          <Dropdown
            align="right"
            trigger={
              <button className="flex items-center space-x-3 text-sm">
                <div className="hidden sm:flex sm:flex-col sm:items-end">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
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
            <Dropdown.Item onClick={() => navigate("/dashboard/settings")}>
              Settings
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => navigate("/dashboard/settings/profile")}
            >
              Profile
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
