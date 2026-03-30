function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function paginate(query, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  return { query: `${query} LIMIT ? OFFSET ?`, params: [limit, offset] };
}

module.exports = { slugify, paginate };
