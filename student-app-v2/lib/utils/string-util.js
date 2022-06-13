const slugify = require('slugify');

module.exports = {
  slugifyString: str => {
    return slugify(str, {
      replacement: '-',
      lower: true,
      trim: true
    })
  }
};
