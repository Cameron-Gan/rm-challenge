// src/App.tsx
import { useEffect, useState } from "react";
import "./App.css";
import Paper from "@mui/material/Paper";
import { Stack, ToggleButton } from "@mui/material";
import type { FacilityUnit } from "./types";
import MultipleRegionSelect from "./components/RegionFilter";
import MultipleStatusSelect from "./components/StatusFilter";
import MultipleFuelTechSelect from "./components/FuelTechFilter";
import FacilitiesTable from "./components/FacilitiesTable";

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

  // fetch data from the BE
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

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!facilities.length) return <p>No data</p>;

  // Filter table based on state parameters
  const filtered = facilities.filter((facility) => {
    const inRegion =
      regions.length === 0 || regions.includes(facility.network_region);

    const inStatus =
      statuses.length === 0 || statuses.includes(facility.status_id);

    const inFuelTech =
      fueltechs.length === 0 || fueltechs.includes(facility.fueltech_id);

    return inRegion && inStatus && inFuelTech;
  });

  return (
    <>
      <h1>RenewMap code challenge</h1>
      <p className="read-the-docs">
        Explore Australia's past, current and future electricity generation
        fleet.
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
        >
          <MultipleRegionSelect regions={regions} onChange={setRegions} />
          <MultipleStatusSelect statuses={statuses} onChange={setStatuses} />
          <MultipleFuelTechSelect
            fueltechs={fueltechs}
            onChange={setFuelTechs}
          />
          <ToggleButton
            value={false}
            selected={fossilFuelsToggle}
            onChange={handleFossilFuelChange}
          >
            Fossil Fuels
          </ToggleButton>
        </Stack>
        <FacilitiesTable facilities={filtered} />
      </Paper>
    </>
  );
}

export default App;
