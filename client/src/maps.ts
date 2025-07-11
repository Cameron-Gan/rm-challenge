import type {
  NetworkRegion,
  UnitFueltechType,
  UnitStatusType,
} from "./types";

// ChatGTP suggestion
export const FUELTECH_LABELS: Record<UnitFueltechType, string> = {
  battery_charging: "Battery",
//   battery_discharging: "Battery Discharging", Removed duplicated battery charging battery discharging in the BE
  bioenergy_biogas: "Bioenergy (Biogas)",
  bioenergy_biomass: "Bioenergy (Biomass)",
  coal_black: "Black Coal",
  coal_brown: "Brown Coal",
  distillate: "Distillate",
  gas_ccgt: "Gas (CCGT)",
  gas_ocgt: "Gas (OCGT)",
  gas_recip: "Gas (Reciprocating)",
  gas_steam: "Gas (Steam)",
  gas_wcmg: "Gas (WCMG)",
  hydro: "Hydro",
  pumps: "Pumped Hydro",
  solar_rooftop: "Solar (Rooftop)",
  solar_thermal: "Solar Thermal",
  solar_utility: "Solar (Utility)",
  nuclear: "Nuclear",
  wind: "Wind (Onshore)",
  wind_offshore: "Wind (Offshore)",
};
// end suggestion

export const STATE_LABELS: Record<NetworkRegion, string> = {
  NSW1: "NSW",
  SA1: "SA",
  QLD1: "QLD",
  VIC1: "VIC",
  TAS1: "TAS",
  WEM: "WA",
};

export const STATUS_LABELS: Record<UnitStatusType, string> = {
  committed: "Committed",
  operating: "Operating",
  retired: "Retired",
};
