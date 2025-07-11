import {Hono} from "hono";
import { IAPIResponse, IFacility, UnitDispatchType, UnitFueltechType, UnitStatusType } from "./types";

interface Env {
    OPEN_ELECTRICITY_API_TOKEN: string;
}

export const app = new Hono<{ Bindings: Env }>();

interface FacilityUnit {
    facility_code: string;
    facility_name: string;
    network_region: string;
    unit_code: string;
    fueltech_id: UnitFueltechType | null;
    status_id: UnitStatusType | null;
    capacity_registered: number | null;
    emissions_factor_co2: number | null;
    data_first_seen: string | null;
    data_last_seen: string | null;
    dispatch_type: UnitDispatchType;
}

class FacilityDataManager {
    private facilityUnits: FacilityUnit[] = [];
    private lastFetch: number = 0;
    private ttl: number;

    constructor(ttl: number = 5 * 60 * 60 * 1000 * 1000) {
        this.ttl = ttl
    }

    async fetchFacilities(token: string): Promise<FacilityUnit[] | {error: string, status: number}> {
        const now = Date.now();

        // simple cache so we don't go to the third party every time
        if (
            (this.facilityUnits.length) &&
            (now - this.lastFetch) < this.ttl
        ) {
            return this.facilityUnits;
        }
        const res = await fetch("https://api.openelectricity.org.au/v4/facilities", {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        if (!res.ok) {
            return { error: await res.text(), status: res.status};
        }
        const facilities: IAPIResponse<IFacility[]> = await res.json();
        if (!facilities.data) {
            return []
        }

        this.facilityUnits = facilities.data.flatMap((facility) => 
            facility.units.map((unit) => ({
                facility_name: facility.name,
                facility_code: facility.code,
                network_region: facility.network_region,
                unit_code: unit.code,
                fueltech_id: unit.fueltech_id,
                status_id: unit.status_id,
                capacity_registered: unit.capacity_registered,
                emissions_factor_co2: unit.emissions_factor_co2,
                data_first_seen: unit.data_first_seen ,
                data_last_seen: unit.data_last_seen,
                dispatch_type: unit.dispatch_type,
            })
            )
        )

        // remove battery_discharging duplicates since they have the same capacity
        this.facilityUnits = this.facilityUnits.filter((facility_unit) => 
            facility_unit.fueltech_id !== 'battery_discharging'
        )
        
        this.lastFetch = Date.now()
        return this.facilityUnits;
    }
}

let facilityDataManager = new FacilityDataManager()

app.get("/api/facilities", async (c) => {
    /* send a request below to openelectricity.org.au to retrieve facilities */
    const facilities = await facilityDataManager.fetchFacilities(c.env.OPEN_ELECTRICITY_API_TOKEN)
    return c.json(facilities)
});


export default app;
