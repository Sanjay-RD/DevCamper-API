const advancedResult = (model, populate) => async (req, res, next) => {
  let query;

  let reqQuery = { ...req.query };

  let removeField = ["select", "sort", "limit", "page"];

  removeField.forEach((param) => delete reqQuery[param]);

  // console.log(reqQuery);

  let queryStr = JSON.stringify(reqQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  query = model.find(JSON.parse(queryStr));

  if (req.query.select) {
    let field = req.query.select.split(",").join(" ");
    query = query.select(field);
  }

  if (req.query.sort) {
    const field = req.query.sort.split(",").join(" ");
    query = query.sort(field);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  // console.log(typeof page);
  // console.log(typeof limit);
  // console.log(`start index = ${startIndex}`);
  // console.log(`end index = ${endIndex}`);
  // console.log(`total = ${total}`);

  if (populate) {
    query = query.populate(populate);
  }

  query = query.skip(startIndex).limit(limit);

  // executing query
  const result = await query;

  // create pagination object
  pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.previous = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResult = {
    success: true,
    count: result.length,
    pagination,
    data: result,
  };

  next();
};

module.exports = advancedResult;
