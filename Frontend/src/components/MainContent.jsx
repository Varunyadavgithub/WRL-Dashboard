import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";

import ProductionOverview from "../pages/Production/Overview";
import ComponentTraceabilityReport from "../pages/Production/ComponentTraceabilityReport";
import HourlyReport from "../pages/Production/HourlyReport";
import LineHourlyReport from "../pages/Production/LineHourlyReport";
import StageHistoryReport from "../pages/Production/StageHistoryReport";
import ModelNameUpdate from "../pages/Production/ModelNameUpdate";
import TotalProduction from "../pages/Production/TotalProduction";

import ReworkReport from "../pages/Quality/ReworkReport";
import BrazingReport from "../pages/Quality/BrazingReport";
import GasChargingReport from "../pages/Quality/GasChargingReport";
import ESTReport from "../pages/Quality/ESTReport";
import MFTReport from "../pages/Quality/MFTReport";
import FPA from "../pages/Quality/FPA";
import FPAReports from "../pages/Quality/FPAReports";
import DispatchHold from "../pages/Quality/DispatchHold";
import HoldCabinateDetails from "../pages/Quality/HoldCabinateDetails";

import DispatchPerformanceReport from "../pages/Dispatch/DispatchPerformanceReport";
import DispatchReport from "../pages/Dispatch/DispatchReport";
import FGCasting from "../pages/Dispatch/FGCasting";
import GateEntry from "../pages/Dispatch/GateEntry";
import ErrorLog from "../pages/Dispatch/ErrorLog";

import ProductionPlaning from "../pages/Planing/ProductionPlaning";
import FiveDaysPlaning from "../pages/Planing/FiveDaysPlaning";
import { useSelector } from "react-redux";
import NotFound from "./common/NotFound";
import Unauthorized from "./common/Unauthorized";
import RoleBasedAccess from "./RoleBasedAccess";

function MainContent() {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="flex-1 p-4 min-h-screen overflow-auto">
      <Routes>
        <Route path="/" index element={<Home />} />

        {/* Production */}
        <Route path="/production/overview" element={<ProductionOverview />} />
        <Route
          path="/production/component-traceability-report"
          element={<ComponentTraceabilityReport />}
        />
        <Route path="/production/hourly-report" element={<HourlyReport />} />
        <Route
          path="/production/line-hourly-report"
          element={<LineHourlyReport />}
        />
        <Route
          path="/production/stage-history-report"
          element={<StageHistoryReport />}
        />
        {/* 🚫 Restricted Route: Only Logistic and Admin */}
        <Route
          path="/production/model-name-update"
          element={
            <RoleBasedAccess
              element={<ModelNameUpdate />}
              allowedRoles={["logistic"]}
            />
          }
        />
        <Route
          path="/production/total-production"
          element={<TotalProduction />}
        />

        {/* Quality */}
        <Route path="/quality/rework-report" element={<ReworkReport />} />
        <Route path="/quality/brazing-report" element={<BrazingReport />} />
        <Route
          path="/quality/gas-charging-report"
          element={<GasChargingReport />}
        />
        <Route path="/quality/est-report" element={<ESTReport />} />
        <Route path="/quality/mft-report" element={<MFTReport />} />
        {/* 🚫 Restricted Route: Only FPA, Quality Manager and Admin */}
        <Route
          path="/quality/fpa"
          element={
            <RoleBasedAccess
              element={<FPA />}
              allowedRoles={["FPA", "Quality Manager"]}
            />
          }
        />
        <Route path="/quality/fpa-report" element={<FPAReports />} />
        {/* 🚫 Restricted Route: Only FPA, Quality Manager and Admin */}
        <Route
          path="/quality/dispatch-hold"
          element={
            <RoleBasedAccess
              element={<DispatchHold />}
              allowedRoles={["Line Quality Engg.", "Quality Manager"]}
            />
          }
        />
        <Route
          path="/quality/hold-cabinate-details"
          element={<HoldCabinateDetails />}
        />

        {/* Dispatch */}
        <Route
          path="/dispatch/dispatch-performance-report"
          element={<DispatchPerformanceReport />}
        />
        <Route path="/dispatch/dispatch-report" element={<DispatchReport />} />
        <Route
          path="/dispatch/fg-casting"
          element={
            <RoleBasedAccess
              element={<FGCasting />}
              allowedRoles={["logistic"]}
            />
          }
        />
        <Route path="/dispatch/gate-entry" element={<GateEntry />} />
        <Route
          path="/dispatch/error-log"
          element={
            <RoleBasedAccess
              element={<ErrorLog />}
              allowedRoles={["logistic"]}
            />
          }
        />

        {/* Planing */}
        <Route
          path="/planing/production-planing"
          element={
            <RoleBasedAccess
              element={<ProductionPlaning />}
              allowedRoles={["Product Manager"]}
            />
          }
        />
        <Route path="/planing/5-days-planing" element={<FiveDaysPlaning />} />

        <Route path="*" element={<NotFound />} />
        <Route path="/not-authorized" element={<Unauthorized />} />
      </Routes>
    </div>
  );
}

export default MainContent;
