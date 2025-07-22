import React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import type { FacilityUnit } from "../types";
import { FUELTECH_LABELS, STATE_LABELS, STATUS_LABELS } from "../maps";
import { enAU as locale } from "date-fns/locale";
import { format } from "date-fns";

type Props = {
  facilities: FacilityUnit[];
};

const columns: GridColDef[] = [
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
    rowSpanValueGetter: (_value, row) => `${row.id}-${row.fueltech_id}`,
    width: 200,
  },
  {
    field: "region",
    headerName: "State",
    rowSpanValueGetter: (_value, row) => `${row.id}-${row.region}`,
    width: 100,
    filterable: false,
  },
  {
    field: "status",
    headerName: "Unit Status",
    rowSpanValueGetter: (_value, row) => `${row.id}-${row.status}`,
    width: 200,
    filterable: false,
  },
  {
    field: "data_first_seen",
    headerName: "Commencement Date",
    width: 200,
    valueFormatter: (value) =>
      value ? format(value as Date, "MM/dd/yyyy", { locale }) : "",
  },
  {
    field: "data_last_seen",
    headerName: "Last Updated",
    width: 200,
    valueFormatter: (value) =>
      value ? format(value as Date, "MM/dd/yyyy", { locale }) : "",
  },
  {
    field: "capacity",
    headerName: "Unit Capacity (MW)",
    rowSpanValueGetter: (_value, row) => `${row.id}-${row.capacity}`,
    width: 200,
    filterable: false,
  },
];

function prepareRows(data: FacilityUnit[]) {
  return data.map((f) => ({
    id: f.unit_code,
    facility_name: f.facility_name,
    fueltech_id: f.fueltech_id ? FUELTECH_LABELS[f.fueltech_id] : "UNKNOWN",
    region: STATE_LABELS[f.network_region],
    status: f.status_id ? STATUS_LABELS[f.status_id] : "UNKNOWN",
    capacity: f.capacity_registered,
    data_first_seen: f.data_first_seen ? new Date(f.data_first_seen) : null,
    data_last_seen: f.data_last_seen ? new Date(f.data_last_seen) : null,
  }));
}

export default function FacilitiesTable({ facilities }: Props) {
  return (
    <DataGrid
      columns={columns}
      rows={prepareRows(facilities)}
      rowSpanning={true}
    />
  );
}
