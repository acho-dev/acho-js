export interface Resource {
  type: string;
  datasetId: string;
  tableId: string[];
  selection: string;
}

export interface IGetTableDataResp {
  data: Record<string, any>[];
  schema: {
    fields: Record<string, string>[];
  };
  paging: {
    page: number;
    pageSize: number;
    pageTotal: number;
  };
}
