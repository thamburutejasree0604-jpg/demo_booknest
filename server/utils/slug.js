// A util script to create unique slug in case of duplicate book titles

import slugify from 'slugify';
import bookModel from '../models/bookModel.js'; 

const generateSlug = async (title) => {
  let slug = slugify(title, { lower: true });
  const existingBook = await bookModel.findOne({ slug });

  if (existingBook) {
    let i = 1;
    while (await bookModel.findOne({ slug: `${slug}-${i}` })) {
      i++;
    }
    slug = `${slug}-${i}`;
  }

  return slug;
};

export default generateSlug;