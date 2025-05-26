import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaIndustry,
  FaClipboardCheck,
  FaTruckMoving,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
  FaClipboardList,
} from "react-icons/fa";

// Define menu configurations
const MENU_CONFIG = [
  {
    key: "production",
    icon: FaIndustry,
    label: "Production",
    items: [
      { path: "/production/overview", label: "Production Report" },
      {
        path: "/production/component-traceability-report",
        label: "Component Traceability Report",
      },
      { path: "/production/hourly-report", label: "Hourly Report" },
      { path: "/production/line-hourly-report", label: "Line Hourly Report" },
      {
        path: "/production/stage-history-report",
        label: "Stage History Report",
      },
      { path: "/production/model-name-update", label: "Model Name Update" },
      { path: "/production/total-production", label: "Total Production" },
    ],
  },
  {
    key: "quality",
    icon: FaClipboardCheck,
    label: "Quality",
    items: [
      { path: "/quality/rework-report", label: "Rework Report" },
      { path: "/quality/brazing-report", label: "Brazing Report" },
      { path: "/quality/gas-charging-report", label: "Gas Charging Report" },
      { path: "/quality/est-report", label: "EST Report" },
      { path: "/quality/mft-report", label: "MFT Report" },
      { path: "/quality/fpa", label: "FPA" },
      { path: "/quality/fpa-report", label: "FPA Report" },
      { path: "/quality/dispatch-hold", label: "Dispatch Hold" },
      { path: "/quality/hold-cabinate-details", label: "Hold Cabinet Details" },
    ],
  },
  {
    key: "dispatch",
    icon: FaTruckMoving,
    label: "Dispatch",
    items: [
      {
        path: "/dispatch/dispatch-performance-report",
        label: "Dispatch Performance Report",
      },
      { path: "/dispatch/dispatch-report", label: "Dispatch Report" },
      { path: "/dispatch/fg-casting", label: "FG Casting" },
      { path: "/dispatch/gate-entry", label: "Gate Entry" },
      { path: "/dispatch/error-log", label: "Error Log" },
    ],
  },
  {
    key: "planing",
    icon: FaClipboardList,
    label: "Planing",
    items: [
      { path: "/planing/production-planing", label: "Production Planing" },
      { path: "/planing/5-days-planing", label: "5 Days Planing" },
    ],
  },
];

const Sidebar = ({ isSidebarExpanded, toggleSidebar }) => {
  const [expandedMenus, setExpandedMenus] = useState(
    MENU_CONFIG.reduce((acc, menu) => ({ ...acc, [menu.key]: false }), {})
  );

  const location = useLocation();

  const toggleMenu = (menu) => {
    setExpandedMenus((prevState) => {
      // Create a new state object with all menus collapsed
      const newState = Object.keys(prevState).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {}
      );

      // Toggle the selected menu
      newState[menu] = !prevState[menu];
      return newState;
    });
  };

  const isActive = (path) =>
    location.pathname === path ? "bg-blue-500 text-white" : "text-gray-300";

  const renderMenuItems = (menu) => {
    return (
      <ul className="ml-6 mt-2 space-y-2">
        {menu.items.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                item.path
              )}`}
              onClick={() => window.scrollTo(0, 0)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const renderMenuSection = (menu) => {
    const MenuIcon = menu.icon;

    return (
      <li key={menu.key}>
        <div
          className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-700 transition"
          onClick={() => toggleMenu(menu.key)}
        >
          <div className="flex items-center">
            <MenuIcon className="mr-3" />
            {isSidebarExpanded && (
              <span className="font-semibold">{menu.label}</span>
            )}
          </div>
          {isSidebarExpanded &&
            (expandedMenus[menu.key] ? <FaChevronUp /> : <FaChevronDown />)}
        </div>
        {isSidebarExpanded && expandedMenus[menu.key] && renderMenuItems(menu)}
      </li>
    );
  };

  return (
    <aside
      className={`fixed h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out ${
        isSidebarExpanded ? "w-64" : "w-16"
      } p-4 shadow-xl flex flex-col justify-between`}
    >
      <div>
        {/* Title */}
        <div className="flex justify-between mb-4">
          {isSidebarExpanded ? (
            <>
              <h1 className="text-2xl font-playfair">Dashboard</h1>
              <button
                className="text-gray-300 hover:text-white focus:outline-none text-2xl cursor-pointer"
                onClick={toggleSidebar}
              >
                {isSidebarExpanded ? <FaTimes /> : <FaBars />}
              </button>
            </>
          ) : (
            <button
              className="text-gray-300 hover:text-white focus:outline-none text-2xl cursor-pointer"
              onClick={toggleSidebar}
            >
              {isSidebarExpanded ? <FaTimes /> : <FaBars />}
            </button>
          )}
        </div>

        <ul className="space-y-4 overflow-y-auto overflow-x-hidden max-h-full">
          {MENU_CONFIG.map(renderMenuSection)}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
