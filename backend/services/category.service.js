const db = require('../db/pool');

exports.getCategories = async () => {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      name
    FROM categories
    ORDER BY name ASC
    `
  );

  return rows;
};
