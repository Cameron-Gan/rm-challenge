// Subset of types taken from https://www.npmjs.com/package/openelectricity

export type NetworkCode = "NEM" | "WEM" | "AU";
export type NetworkRegion = "NSW1" | "SA1" | "QLD1" | "VIC1" | "TAS1" | "WEM";
export type UnitStatusType = "committed" | "operating" | "retired";
// "battery_discharging" and "interconnector" have been removed here since it was taken out in the BE
export type UnitFueltechType = "battery_charging" | "bioenergy_biogas" | "bioenergy_biomass" | "coal_black" | "coal_brown" | "distillate" | "gas_ccgt" | "gas_ocgt" | "gas_recip" | "gas_steam" | "gas_wcmg" | "hydro" | "pumps" | "solar_rooftop" | "solar_thermal" | "solar_utility" | "nuclear" | "wind" | "wind_offshore" ;
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

