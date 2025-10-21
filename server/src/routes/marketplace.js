import { Router } from 'express';
import Product from '../models/Product.js';
import Firm from '../models/Firm.js';
import AssociateProfile from '../models/AssociateProfile.js';

const router = Router();

async function fetchCatalog(kind, query, { includeFirm = true, defaultLimit = 12 } = {}) {
  const {
    search,
    category,
    tag,
    style,
    city,
    country,
    firmId,
    firmSlug,
    minPrice,
    maxPrice,
    limit = defaultLimit,
    page = 1,
  } = query;

  const match = { status: 'published', kind };

  if (firmId) {
    match.firm = firmId;
  }
  if (firmSlug) {
    const firm = await Firm.findOne({ slug: firmSlug }).select('_id').lean();
    if (!firm) {
      return { items: [], meta: { total: 0, page: 1, pageSize: Number(limit) || defaultLimit, facets: {} } };
    }
    match.firm = firm._id;
  }

  if (category) match.categories = { $regex: new RegExp(category, 'i') };
  if (tag) match.tags = { $regex: new RegExp(tag, 'i') };
  if (style) match.style = { $regex: new RegExp(style, 'i') };
  if (city) match['location.city'] = { $regex: new RegExp(city, 'i') };
  if (country) match['location.country'] = { $regex: new RegExp(country, 'i') };
  if (search) match.$text = { $search: search };

  if (minPrice || maxPrice) {
    match['pricing.basePrice'] = {};
    if (minPrice) match['pricing.basePrice'].$gte = Number(minPrice);
    if (maxPrice) match['pricing.basePrice'].$lte = Number(maxPrice);
  }

  const limitNum = Math.min(Number(limit) || defaultLimit, 60);
  const pageNum = Math.max(Number(page) || 1, 1);
  const skip = (pageNum - 1) * limitNum;

  const queryExec = Product.find(match)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  if (includeFirm) {
    queryExec.populate('firm', 'name slug tagline coverImage rating category styles services');
  }

  const [items, total, facetsAgg] = await Promise.all([
    queryExec,
    Product.countDocuments(match),
    Product.aggregate([
      { $match: match },
      {
        $facet: {
          categories: [
            { $unwind: '$categories' },
            { $group: { _id: '$categories', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          tags: [
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 15 },
          ],
          styles: [
            { $match: { style: { $exists: true, $ne: null } } },
            { $group: { _id: '$style', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]),
  ]);

  const facetsDoc = facetsAgg[0] || {};

  return {
    items,
    meta: {
      total,
      page: pageNum,
      pageSize: limitNum,
      facets: {
        categories: facetsDoc.categories?.map((c) => ({ name: c._id, count: c.count })) || [],
        tags: facetsDoc.tags?.map((t) => ({ name: t._id, count: t.count })) || [],
        styles: facetsDoc.styles?.map((s) => ({ name: s._id, count: s.count })) || [],
      },
    },
  };
}

router.get('/studios', async (req, res) => {
  try {
    const response = await fetchCatalog('studio', req.query, { includeFirm: true, defaultLimit: 16 });
    res.json({ ok: true, ...response });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get('/materials', async (req, res) => {
  try {
    const response = await fetchCatalog('material', req.query, { includeFirm: true, defaultLimit: 24 });
    res.json({ ok: true, ...response });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get('/firms', async (req, res) => {
  try {
    const { search, style, category } = req.query;
    const match = { approved: true };
    if (search) {
      match.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { tagline: { $regex: new RegExp(search, 'i') } },
      ];
    }
    if (style) match.styles = { $regex: new RegExp(style, 'i') };
    if (category) match.category = { $regex: new RegExp(category, 'i') };

    const firms = await Firm.find(match)
      .populate('featuredStudios', 'title slug heroImage pricing priceSqft highlights')
      .lean();
    res.json({ ok: true, items: firms });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get('/associates', async (req, res) => {
  try {
    const { search, skill, software, timezone } = req.query;
    const match = {};
    if (search) {
      match.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { summary: { $regex: new RegExp(search, 'i') } },
      ];
    }
    if (skill) match.specialisations = { $regex: new RegExp(skill, 'i') };
    if (software) match.softwares = { $regex: new RegExp(software, 'i') };
    if (timezone) match.timezone = timezone;

    const associates = await AssociateProfile.find(match)
      .populate('user', 'email role')
      .lean();
    res.json({ ok: true, items: associates });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
