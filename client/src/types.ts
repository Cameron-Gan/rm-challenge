export type NetworkCode = "NEM" | "WEM" | "AU";
export type DataInterval = "5m" | "1h" | "1d" | "7d" | "1M" | "3M" | "season" | "1y" | "fy";
export type DataPrimaryGrouping = "network" | "network_region";
export type DataSecondaryGrouping = "fueltech" | "fueltech_group" | "renewable";
export type DataMetric = "power" | "energy" | "emissions" | "market_value";
export type MarketMetric = "price" | "demand" | "demand_energy";
export type Metric = DataMetric | MarketMetric;
export type UnitStatusType = "committed" | "operating" | "retired";
export type UnitFueltechType = "battery_charging" | "battery_discharging" | "bioenergy_biogas" | "bioenergy_biomass" | "coal_black" | "coal_brown" | "distillate" | "gas_ccgt" | "gas_ocgt" | "gas_recip" | "gas_steam" | "gas_wcmg" | "hydro" | "pumps" | "solar_rooftop" | "solar_thermal" | "solar_utility" | "nuclear" | "wind" | "wind_offshore" | "interconnector";
export type UnitFueltechGroupType = "coal" | "gas" | "wind" | "solar" | "battery_charging" | "battery_discharging" | "hydro" | "distillate" | "bioenergy" | "pumps";
export type UnitDispatchType = "GENERATOR" | "LOAD" | "NETWORK" | "INTERCONNECTOR";
export interface Unit {
    code: string;
    fueltech_id: UnitFueltechType | null;
    status_id: UnitStatusType | null;
    capacity_registered: number | null;
    emissions_factor_co2: number | null;
    data_first_seen: string | null;
    data_last_seen: string | null;
    dispatch_type: UnitDispatchType;
}

export interface Facility {
    code: string;
    name: string;
    description: string;
    network_id: string;
    network_region: NetworkRegion;
    units: Unit[];
}
export type NetworkRegion = "NSW1" | "SA1" | "QLD1" | "VIC1" | "TAS1" | "WEM";

export interface FacilityUnit {
    facility_code: string;
    facility_name: string;
    network_region: NetworkRegion;
    unit_code: string;
    fueltech_id: UnitFueltechType;
    status_id: UnitStatusType;
    capacity_registered: number | null;
    emissions_factor_co2: number | null;
    data_first_seen: string | null;
    data_last_seen: string | null;
    dispatch_type: UnitDispatchType;
}

