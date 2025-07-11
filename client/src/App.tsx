import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";
import type { FacilityUnit } from "./types.ts";
import { FUELTECH_LABELS, STATE_LABELS, STATUS_LABELS } from "./maps.ts";
import MultipleStatusSelect from "./StatusFilter.tsx";
import MultipleRegionSelect from "./RegionFilter.tsx";

function App() {
  const [facilities, setFacilities] = useState<FacilityUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newRegions: string[]
  ) => {
    setRegions(newRegions);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/facilities");
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }
        const data: FacilityUnit[] = await res.json();
        setFacilities(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- 3.  Render states ---------- */

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!facilities.length) return <p>No data</p>;

  /* ---------- 4.  Render table ---------- */

  const filtered = facilities.filter((facility) => {
    const inRegion =
      regions.length === 0 || regions.includes(facility.network_region);

    const inStatus =
      statuses.length === 0 || statuses.includes(facility.status_id);

    return inRegion && inStatus;
  });

  const table_columns: GridColDef[] = [
    {
      field: "facility_name",
      headerName: "Facility Name",
      width: 200,
      filterable: false,
    },
    {
      field: "fueltech_id",
      headerName: "Fuel Tech",
      rowSpanValueGetter: (value, row) => {
        return row ? `${row.id}-${row.fueltech_id}` : value;
      },
      width: 200,
    },
    {
      field: "region",
      headerName: "State",
      rowSpanValueGetter: (value, row) => {
        return row ? `${row.id}-${row.region}` : value;
      },
      width: 200,
      filterable: false,
    },
    {
      field: "status",
      headerName: "Unit Status",
      rowSpanValueGetter: (value, row) => {
        return row ? `${row.id}-${row.status}` : value;
      },
      type: "singleSelect",
      valueOptions: ["Committed", "Operating", "Retired"],
      width: 200,
      filterable: false,
    },
    {
      field: "capacity",
      headerName: "Unit Capacity",
      rowSpanValueGetter: (value, row) => {
        return row ? `${row.id}-${row.capacity}` : value;
      },
      width: 200,
      filterable: false,
    },
  ];

  function renderData(data: FacilityUnit[]) {
    return data.map((facility) => ({
      id: facility.unit_code,
      facility_name: facility.facility_name,
      fueltech_id: facility.fueltech_id
        ? FUELTECH_LABELS[facility.fueltech_id]
        : "UNKNOWN",
      region: STATE_LABELS[facility.network_region],
      status: facility.status_id
        ? STATUS_LABELS[facility.status_id]
        : "UNKNOWN",
      capacity: facility.capacity_registered,
    }));
  }

  return (
    <>
      <h1>RenewMap code challenge</h1>
      <p className="read-the-docs">
        This is the starter repository for the code challenge provided to you by
        the interviewer.
      </p>
      <>
        <Paper>
          <MultipleRegionSelect regions={regions} onChange={setRegions} />
          <MultipleStatusSelect statuses={statuses} onChange={setStatuses} />
        </Paper>
      </>
      <>
        <Paper className="table">
          <DataGrid
            columns={table_columns}
            rows={renderData(filtered)}
            rowSpanning={true}
          ></DataGrid>
        </Paper>
      </>
    </>
  );
}

export default App;
