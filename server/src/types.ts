// these types are taken from https://www.npmjs.com/package/openelectricity

/**
 * Type definitions for OpenElectricity API
 */
/**
 * RecordTable implementation for OpenElectricity API
 * Provides a simple interface for navigating record-style data like facilities
 */
/**
 * OpenElectricity API Client
 *
 * A TypeScript client for the OpenElectricity API v4.
 * Provides access to electricity network data and metrics.
 */
export interface IFacilityEnergy {
    facility_code: string;
    network_code: NetworkCode;
    energy: number;
    interval: string;
    start: string;
    end: string;
}
export interface IFacilityRecord extends IRecord {
    facility_code: string;
    facility_name: string;
    facility_network: string;
    facility_region: string;
    facility_description: string | null;
    unit_code: string;
    unit_fueltech: string | null;
    unit_status: string | null;
    unit_capacity: number | null;
    unit_emissions_factor: number | null;
    unit_first_seen: string | null;
    unit_last_seen: string | null;
    unit_dispatch_type: string;
    [key: string]: string | number | boolean | null;
}
export declare class OpenElectricityError extends Error {
    response?: IAPIErrorResponse | undefined;
    constructor(message: string, response?: IAPIErrorResponse | undefined);
}
export declare class NoDataFound extends Error {
    constructor(message: string);
}
export interface IRecord {
    [key: string]: string | number | boolean | null;
}
export declare class RecordTable<T extends IRecord = IRecord> {
    private records;
    private columnNames;
    constructor(records: T[]);
    /**
     * Get all records
     */
    getRecords(): T[];
    /**
     * Get available column names
     */
    getColumns(): string[];
    /**
     * Get a subset of columns
     */
    select(columns: string[]): RecordTable<T>;
    /**
     * Filter records based on a condition
     */
    filter(condition: (record: T) => boolean): RecordTable<T>;
    /**
     * Sort records by specified columns
     */
    sortBy(columns: string[], ascending?: boolean): RecordTable<T>;
    /**
     * Get unique values in a column
     */
    unique(column: string): (string | number | boolean | null)[];
    /**
     * Get a slice of records
     */
    slice(start?: number, end?: number): RecordTable<T>;
    /**
     * Convert to array format
     */
    toArray(): T[];
    /**
     * Convert to JSON string with pretty formatting
     */
    toString(): string;
}
/**
 * DataTable implementation for OpenElectricity API
 * Provides a pandas/polars-like interface for time series data
 */
export interface IDataTableRow {
    interval: Date;
    [key: string]: Date | string | number | boolean | null;
}
export interface IDescribeResult {
    count: number;
    mean: number;
    std: number;
    min: number;
    q25: number;
    median: number;
    q75: number;
    max: number;
}
export declare class DataTable {
    private rows;
    private groupings;
    private metrics;
    private cache;
    private rowsMap;
    constructor(rows: IDataTableRow[], groupings: string[], metrics: Map<string, string>);
    /**
     * Create a DataTable from NetworkTimeSeries responses
     */
    static fromNetworkTimeSeries(data: INetworkTimeSeries[]): DataTable;
    private createRowMap;
    private createRowKey;
    private createColumnIndexes;
    /**
     * Get a row by its unique key
     * Used internally for efficient row lookups
     */
    private getRowByKey;
    /**
     * Update or add a row by its key
     * Used internally for merging data
     */
    private setRowByKey;
    /**
     * Get all rows in the table
     */
    getRows(): IDataTableRow[];
    /**
     * Get available grouping columns
     */
    getGroupings(): string[];
    /**
     * Get the metrics and their units
     */
    getMetrics(): Map<string, string>;
    /**
     * Get the latest timestamp in the data
     */
    getLatestTimestamp(): number;
    /**
     * Filter rows based on a condition
     */
    filter(condition: (row: IDataTableRow) => boolean): DataTable;
    private tryIndexFilter;
    /**
     * Select specific columns
     */
    select(columns: string[]): DataTable;
    /**
     * Group by specified columns and aggregate values
     */
    groupBy(columns: string[], aggregation?: "sum" | "mean"): DataTable;
    /**
     * Sort rows by specified columns
     */
    sortBy(columns: string[], ascending?: boolean): DataTable;
    /**
     * Convert to console-friendly format
     */
    toConsole(): Record<string, unknown>[];
    /**
     * Generate summary statistics for numeric columns
     */
    describe(): Record<string, IDescribeResult>;
}
/**
 * Create a DataTable from NetworkTimeSeries responses
 */
export declare function createDataTable(data: INetworkTimeSeries[]): DataTable;
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
export interface IUnit {
    code: string;
    fueltech_id: UnitFueltechType | null;
    status_id: UnitStatusType | null;
    capacity_registered: number | null;
    emissions_factor_co2: number | null;
    data_first_seen: string | null;
    data_last_seen: string | null;
    dispatch_type: UnitDispatchType;
}
export interface IFacility {
    code: string;
    name: string;
    network_id: string;
    network_region: string;
    description: string | null;
    units: IUnit[];
}
export interface IAPIErrorResponse {
    version: string;
    response_status: "ERROR";
    error: string;
    success: false;
}
export interface IAPIResponse<T> {
    version: string;
    created_at: string;
    success: boolean;
    error: string | null;
    data: T;
    total_records?: number;
}
export interface ITimeSeriesResult {
    name: string;
    date_start: string;
    date_end: string;
    columns: Record<string, string | boolean>;
    data: [string, number | null][];
}
export interface INetworkTimeSeries {
    network_code: string;
    metric: Metric;
    unit: string;
    interval: DataInterval;
    start: string;
    end: string;
    groupings: DataPrimaryGrouping[] | DataSecondaryGrouping[];
    results: ITimeSeriesResult[];
    network_timezone_offset: string;
}
export interface IFacilityDataRow {
    time: string;
    value: number;
    facility_code: string;
    facility_name: string;
    facility_network: string;
    facility_region: string;
    unit_code: string;
    unit_fueltech: UnitFueltechType | null;
    unit_status: UnitStatusType | null;
    unit_capacity: number | null;
    unit_emissions_factor: number | null;
    unit_first_seen: string | null;
    unit_last_seen: string | null;
    unit_dispatch_type: UnitDispatchType;
}
export interface IFacilityDataSeries {
    name: string;
    date_start: string;
    date_end: string;
    columns: Record<string, string>;
    data: [string, number][];
}
export interface IFacilityTimeSeriesParams {
    interval?: DataInterval;
    dateStart?: string;
    dateEnd?: string;
}
export interface IMarketTimeSeriesParams extends IFacilityTimeSeriesParams {
    primaryGrouping?: DataPrimaryGrouping;
    network_region?: string;
}
export interface INetworkTimeSeriesParams extends IMarketTimeSeriesParams {
    secondaryGrouping?: DataSecondaryGrouping[];
    fueltech?: UnitFueltechType[];
    fueltech_group?: UnitFueltechGroupType[];
}
export interface IFacilityParams {
    status_id?: UnitStatusType[];
    fueltech_id?: UnitFueltechType[];
    network_id?: NetworkCode | NetworkCode[];
    network_region?: string;
}
export interface ITimeSeriesResponse {
    response: IAPIResponse<INetworkTimeSeries[]>;
    datatable?: DataTable;
}
export interface IEmptyFacilityResponse {
    response: {
        version: string;
        created_at: string;
        success: true;
        error: null;
        data: [];
    };
    table: RecordTable<IFacilityRecord>;
}
export interface IFacilityResponse {
    response: IAPIResponse<IFacility[]>;
    table: RecordTable<IFacilityRecord>;
}
export type FacilityResponse = IFacilityResponse | IEmptyFacilityResponse;
export type UserPlan = "BASIC" | "PRO" | "ENTERPRISE";
export interface IUserMeta {
    remaining: number;
}
export interface IUser {
    id: string;
    full_name: string;
    email: string;
    owner_id: string;
    plan: UserPlan;
    meta: IUserMeta;
}
