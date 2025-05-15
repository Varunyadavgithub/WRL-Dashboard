import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaIndustry,
  FaClipboardCheck,
  FaTruckMoving,
  FaSlidersH,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
  FaClipboardList,
} from "react-icons/fa";

const Sidebar = ({ isSidebarExpanded, toggleSidebar }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    production: false,
    quality: false,
    dispatch: false,
    settings: false,
    planing: false,
  });

  const location = useLocation();

  const toggleMenu = (menu) => {
    setExpandedMenus((prevState) => {
      const isCurrentlyExpanded = prevState[menu];
      return {
        production: false,
        quality: false,
        dispatch: false,
        settings: false,
        planing: false,
        [menu]: !isCurrentlyExpanded,
      };
    });
  };

  const isActive = (path) =>
    location.pathname === path ? "bg-blue-500 text-white" : "text-gray-300";

  return (
    <aside
      className={`fixed h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out ${
        isSidebarExpanded ? "w-64" : "w-16"
      } p-4 shadow-xl flex flex-col justify-between`}
    >
      <div>
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
          {/* Production */}
          <li>
            <div
              className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-700 transition"
              onClick={() => toggleMenu("production")}
            >
              <div className="flex items-center">
                <FaIndustry className="mr-3" />
                {isSidebarExpanded && (
                  <span className="font-semibold">Production</span>
                )}
              </div>
              {isSidebarExpanded &&
                (expandedMenus.production ? (
                  <FaChevronUp />
                ) : (
                  <FaChevronDown />
                ))}
            </div>
            {isSidebarExpanded && expandedMenus.production && (
              <ul className="ml-6 mt-2 space-y-2">
                <li>
                  <Link
                    to="/production/overview"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/production/overview"
                    )}`}
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                  >
                    Production Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/production/component-traceability-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/production/component-traceability-report"
                    )}`}
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}
                  >
                    Component Traceability Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/production/hourly-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/production/hourly-report"
                    )}`}
                  >
                    Hourly Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/production/line-hourly-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/production/line-hourly-report"
                    )}`}
                  >
                    Line Hourly Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/production/consolidated-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/production/consolidated-report"
                    )}`}
                  >
                    Consolidated Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/production/stop-loss-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/production/stop-loss-report"
                    )}`}
                  >
                    Stop Loss Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/production/stage-history-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/production/stage-history-report"
                    )}`}
                  >
                    Stage History Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/production/model-name-update"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/production/model-name-update"
                    )}`}
                  >
                    Model Name Update
                  </Link>
                </li>
                <li>
                  <Link
                    to="/production/total-production"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/production/total-production"
                    )}`}
                  >
                    Total Production
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Quality */}
          <li>
            <div
              className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-700 transition"
              onClick={() => toggleMenu("quality")}
            >
              <div className="flex items-center">
                <FaClipboardCheck className="mr-3" />
                {isSidebarExpanded && (
                  <span className="font-semibold">Quality</span>
                )}
              </div>
              {isSidebarExpanded &&
                (expandedMenus.quality ? <FaChevronUp /> : <FaChevronDown />)}
            </div>
            {isSidebarExpanded && expandedMenus.quality && (
              <ul className="ml-6 mt-2 space-y-2">
                <li>
                  <Link
                    to="/quality/rework-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/quality/rework-report"
                    )}`}
                  >
                    Rework Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quality/brazing-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/quality/brazing-report"
                    )}`}
                  >
                    Brazing Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quality/gas-charging-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/quality/gas-charging-report"
                    )}`}
                  >
                    Gas Charging Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quality/est-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/quality/est-report"
                    )}`}
                  >
                    EST Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quality/mft-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/quality/mft-report"
                    )}`}
                  >
                    MFT Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quality/fpa"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/quality/fpa"
                    )}`}
                  >
                    FPA
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quality/fpa-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/quality/fpa-report"
                    )}`}
                  >
                    FPA Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quality/dispatch-hold"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/quality/dispatch-hold"
                    )}`}
                  >
                    Dispatch Hold
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quality/hold-cabinate-details"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/quality/hold-cabinate-details"
                    )}`}
                  >
                    Hold Cabinate Details
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Dispatch */}
          <li>
            <div
              className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-700 transition"
              onClick={() => toggleMenu("dispatch")}
            >
              <div className="flex items-center">
                <FaTruckMoving className="mr-3" />
                {isSidebarExpanded && (
                  <span className="font-semibold">Dispatch</span>
                )}
              </div>
              {isSidebarExpanded &&
                (expandedMenus.dispatch ? <FaChevronUp /> : <FaChevronDown />)}
            </div>
            {isSidebarExpanded && expandedMenus.dispatch && (
              <ul className="ml-6 mt-2 space-y-2">
                <li>
                  <Link
                    to="/dispatch/dispatch-performance-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/dispatch/dispatch-performance-report"
                    )}`}
                  >
                    Dispatch Performance Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dispatch/dispatch-report"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/dispatch/dispatch-report"
                    )}`}
                  >
                    Dispatch Report
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dispatch/fg-casting"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/dispatch/fg-casting"
                    )}`}
                  >
                    FG Casting
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dispatch/gate-entry"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/dispatch/gate-entry"
                    )}`}
                  >
                    Gate Entry
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dispatch/error-log"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/dispatch/error-log"
                    )}`}
                  >
                    Error Log
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Settings */}
          <li>
            <div
              className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-700 transition"
              onClick={() => toggleMenu("settings")}
            >
              <div className="flex items-center">
                <FaSlidersH className="mr-3" />
                {isSidebarExpanded && (
                  <span className="font-semibold">Settings</span>
                )}
              </div>
              {isSidebarExpanded &&
                (expandedMenus.settings ? <FaChevronUp /> : <FaChevronDown />)}
            </div>
            {isSidebarExpanded && expandedMenus.settings && (
              <ul className="ml-6 mt-2 space-y-2">
                <li>
                  <Link
                    to="/settings/general"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/settings/general"
                    )}`}
                  >
                    General
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings/security"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/settings/security"
                    )}`}
                  >
                    Security
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Planing */}
          <li>
            <div
              className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-700 transition"
              onClick={() => toggleMenu("planing")}
            >
              <div className="flex items-center">
                <FaClipboardList className="mr-3" />
                {isSidebarExpanded && (
                  <span className="font-semibold">Planing</span>
                )}
              </div>
              {isSidebarExpanded &&
                (expandedMenus.planing ? <FaChevronUp /> : <FaChevronDown />)}
            </div>
            {isSidebarExpanded && expandedMenus.planing && (
              <ul className="ml-6 mt-2 space-y-2">
                <li>
                  <Link
                    to="/planing/production-planing"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/planing/production-planing"
                    )}`}
                  >
                    Production Planing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/planing/5-days-planing"
                    className={`block p-2 rounded-lg hover:bg-gray-700 transition ${isActive(
                      "/planing/5-days-planing"
                    )}`}
                  >
                    5 Days Planing
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
