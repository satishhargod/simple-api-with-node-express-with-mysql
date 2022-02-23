
const customPagination = (data, page, limit, total_records) => {
  const paginat_data = {
    results: data,
    page: page,
    limit: limit,
    totalPages: Math.ceil(total_records / limit),
    totalResults: total_records
  }
  return paginat_data;
};

// const paginate = (query, { page, limit }) => {
//   const offset = (page-1) * limit;
//   //const limit = limit;

//   console.log(offset, page, limit);

//   return {
//     ...query,
//     offset:3,
//     limit,
//   };
// };

const paginate = (records, page, limit) => {
  const { count: totalItems, rows: data } = records;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, data, totalPages, currentPage };
};

const getPagination = (page, size) => {
  const limit = size;
  const offset = page ? (page-1) * limit : 0;
  return { limit, offset };
};

module.exports = {
  customPagination,
  paginate,
  getPagination
}
