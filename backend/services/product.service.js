const db = require('../db/pool');

exports.createProduct = async ({ name, description, quantity, categoryIds }) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [productResult] = await conn.execute(
      `INSERT INTO products (name, description, quantity)
       VALUES (?, ?, ?)`,
      [name, description, quantity]
    );

    const productId = productResult.insertId;

    if (Array.isArray(categoryIds) && categoryIds.length) {
      const values = categoryIds.map(id => [productId, id]);
      await conn.query(
        `INSERT INTO product_categories (product_id, category_id)
         VALUES ?`,
        [values]
      );
    }

    await conn.commit();
    return { id: productId, name, description, quantity };
  } catch (err) {
    await conn.rollback();

    if (err.code === 'ER_DUP_ENTRY') {
      err.status = 400;
      err.message = 'Product name must be unique';
    }

    throw err;
  } finally {
    conn.release();
  }
};

exports.listProducts = async (query) => {
  let {
    page = 1,
    limit = 10,
    search = '',
    categoryIds
  } = query;

  page = Number(page);
  limit = Number(limit);
  const offset = (page - 1) * limit;

  // Normalize categoryIds
  if (typeof categoryIds === 'string') {
    categoryIds = [categoryIds];
  }

  const where = [];
  const whereParams = [];

  where.push('p.status = 1'); // always active only

  if (search) {
    where.push('p.name LIKE ?');
    whereParams.push(`%${search}%`);
  }

  if (Array.isArray(categoryIds) && categoryIds.length) {
    where.push(`
      p.id IN (
        SELECT product_id
        FROM product_categories
        WHERE category_id IN (${categoryIds.map(() => '?').join(',')})
      )
    `);
    whereParams.push(...categoryIds);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  /** DATA QUERY */
  const [rows] = await db.execute(
    `
    SELECT
      p.id,
      p.name,
      p.description,
      p.quantity,
      p.created_at,
      GROUP_CONCAT(c.name) AS categories
    FROM products p
    LEFT JOIN product_categories pc ON pc.product_id = p.id
    LEFT JOIN categories c ON c.id = pc.category_id
    ${whereClause}
    GROUP BY p.id
    ORDER BY p.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
    `,
    whereParams
  );

  /** COUNT QUERY */
  const [[{ total }]] = await db.execute(
    `
    SELECT COUNT(DISTINCT p.id) AS total
    FROM products p
    LEFT JOIN product_categories pc ON pc.product_id = p.id
    ${whereClause}
    `,
    whereParams
  );

  return {
    data: rows.map(r => ({
      ...r,
      categories: r.categories ? r.categories.split(',') : []
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};


exports.deleteProduct = async (id) => {
  const [result] = await db.execute(
    `
    UPDATE products
    SET status = 0
    WHERE id = ? AND status = 1
    `,
    [id]
  );

  if (!result.affectedRows) {
    const err = new Error('Product not found or already inactive');
    err.status = 404;
    throw err;
  }
};
