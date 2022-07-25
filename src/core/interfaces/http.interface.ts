// import { Dictionary } from 'lodash';

export interface PaginationQuery {
  itemsPerPage: number;
  pageNumber: number;
  // limit: number;
  // page: number;
  // s: Dictionary<string>; // sort
  // f: Dictionary<string>; // filter
}

// export interface PaginationResponse<T> {
//   results: T[];
//   total: number; // total items
//   pages: number; // total pages

//   page: number; // current page
//   limit: number; // page limit
// }
