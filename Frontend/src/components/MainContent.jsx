import { Routes, Route } from "react-router-dom";

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

function MainContent() {
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
        <Route
          path="/production/model-name-update"
          element={<ModelNameUpdate />}
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
        <Route path="/quality/fpa" element={<FPA />} />
        <Route path="/quality/fpa-report" element={<FPAReports />} />
        <Route path="/quality/dispatch-hold" element={<DispatchHold />} />
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
        <Route path="/dispatch/fg-casting" element={<FGCasting />} />
        <Route path="/dispatch/gate-entry" element={<GateEntry />} />
        <Route path="/dispatch/error-log" element={<ErrorLog />} />

        {/* Planing */}
        <Route
          path="/planing/production-planing"
          element={<ProductionPlaning />}
        />
        <Route path="/planing/5-days-planing" element={<FiveDaysPlaning />} />
      </Routes>
    </div>
  );
}

export default MainContent;
