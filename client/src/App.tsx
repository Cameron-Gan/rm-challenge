import { useEffect, useState } from "react";
import "./App.css";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import type { FacilityUnit } from "./types.ts";
import { FUELTECH_LABELS, STATE_LABELS, STATUS_LABELS } from "./maps.ts";
import MultipleRegionSelect from "./RegionFilter.tsx";
import MultipleStatusSelect from "./statusFilter.tsx";
import MultipleFuelTechSelect from "./FuelTechFilter.tsx";
import { enAU as locale } from "date-fns/locale";
import { format } from "date-fns";
import { Stack, ToggleButton } from "@mui/material";

const FOSSIL_LIST = [
  "coal_black",
  "coal_brown",
  "gas_ccgt",
  "gas_ocgt",
  "gas_recip",
  "gas_steam",
  "gas_wcmg",
];

function App() {
  const [facilities, setFacilities] = useState<FacilityUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [fueltechs, setFuelTechs] = useState<string[]>([]);
  const [fossilFuelsToggle, setFossilFuels] = useState<boolean>(false);
  
  // https://mui.com/material-ui/react-toggle-button/#standalone-toggle-button
  const handleFossilFuelChange = () => {
    setFossilFuels((prev) => {
      const next = !prev;
      setFuelTechs(next ? FOSSIL_LIST : []);
      return next;
    });
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

    const inFuelTech =
      fueltechs.length === 0 || fueltechs.includes(facility.fueltech_id);

    return inRegion && inStatus && inFuelTech;
  });

  const table_columns: GridColDef[] = [
    {
      field: "facility_name",
      headerName: "Facility Name",
      headerClassName: "column-header",
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
      width: 100,
      filterable: false,
    },
    {
      field: "status",
      headerName: "Unit Status",
      rowSpanValueGetter: (value, row) => {
        return row ? `${row.id}-${row.status}` : value;
      },
      width: 200,
      filterable: false,
    },
    {
      field: "data_first_seen",
      valueFormatter: (value) => {
        if (value) {
          return format(value, "MM/dd/yyyy", { locale });
        }
        return "";
      },
      headerName: "Commencement Date",
      width: 200,
    },
    {
      field: "data_last_seen",
      valueFormatter: (value) => {
        if (value) {
          return format(value, "MM/dd/yyyy", { locale });
        }
        return "";
      },
      headerName: "Last Updated",
      width: 200,
    },
    {
      field: "capacity",
      headerName: "Unit Capacity (MW)",
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
      data_first_seen: facility.data_first_seen
        ? new Date(facility.data_first_seen)
        : null,
      data_last_seen: facility.data_last_seen
        ? new Date(facility.data_last_seen)
        : null,
    }));
  }

  return (
    <>
      <h1>RenewMap code challenge</h1>
      <p className="read-the-docs">
        This is the starter repository for the code challenge provided to you by
        the interviewer.
      </p>
      <Paper
        sx={{
          width: "100%",
          "& .column-header": {
            fontWeight: 1000,
          },
        }}
      >
        <Stack
          direction="row" // row instead of column
          spacing={2} // gap between items (theme spacing units)
          alignItems="center" // vertical alignment
          flexWrap="wrap" // allow wrapping on small screens
        >
          <MultipleRegionSelect regions={regions} onChange={setRegions} />
          <MultipleStatusSelect statuses={statuses} onChange={setStatuses} />
          <MultipleFuelTechSelect
            fueltechs={fueltechs}
            onChange={setFuelTechs}
          />
          <ToggleButton
            value="fossilFuels"
            selected={fossilFuelsToggle}
            onChange={handleFossilFuelChange}
          >
            Fossil Fuels
          </ToggleButton>
        </Stack>
        <DataGrid
          columns={table_columns}
          rows={renderData(filtered)}
          rowSpanning={true}
        ></DataGrid>
      </Paper>
    </>
  );
}

export default App;
