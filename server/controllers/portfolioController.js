import { Portfolio } from '../models/Portfolio.js';
import mongoose from 'mongoose';
import { validateCreatePortfolio } from '../validators/portfolioValidator.js';

// In-memory cache fallback in case MongoDB service is not started on host machine
const inMemoryPortfolios = new Map();

export const getPortfolios = async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = userId ? { userId } : {};

    if (mongoose.connection.readyState === 1) {
      const portfolios = await Portfolio.find(filter).sort({ updatedAt: -1 }).limit(30);
      return res.status(200).json({ success: true, count: portfolios.length, data: portfolios });
    } else {
      let list = Array.from(inMemoryPortfolios.values());
      if (userId) {
        list = list.filter(p => p.userId === userId);
      }
      return res.status(200).json({ success: true, count: list.length, data: list, fallback: true });
    }
  } catch (error) {
    console.error('[Get Portfolios Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPortfolio = async (req, res) => {
  const { id } = req.params;

  try {
    let portfolio = null;

    if (mongoose.connection.readyState === 1) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        portfolio = await Portfolio.findById(id);
      }
      if (!portfolio) {
        portfolio = await Portfolio.findOne({ slug: id.toLowerCase() });
      }
    } else {
      portfolio = inMemoryPortfolios.get(id) || 
        Array.from(inMemoryPortfolios.values()).find(p => p.slug === id.toLowerCase());
    }

    if (!portfolio) {
      return res.status(404).json({ success: false, message: `Portfolio '${id}' not found` });
    }

    return res.status(200).json({ success: true, data: portfolio });
  } catch (error) {
    console.error('[Get Portfolio Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createPortfolio = async (req, res) => {
  try {
    const validation = validateCreatePortfolio(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors.join(' ')
      });
    }

    const data = validation.sanitizedData;

    if (mongoose.connection.readyState === 1) {
      // Check if slug already exists
      const existing = await Portfolio.findOne({ slug: data.slug });
      if (existing) {
        data.slug = `${data.slug}-${Math.floor(Math.random() * 1000)}`;
      }

      const newPortfolio = await Portfolio.create(data);
      return res.status(201).json({ success: true, data: newPortfolio, message: 'Portfolio saved successfully to MongoDB!' });
    } else {
      const fallbackId = `mem_${Date.now()}`;
      const savedObj = { ...data, _id: fallbackId, createdAt: new Date(), updatedAt: new Date() };
      inMemoryPortfolios.set(fallbackId, savedObj);
      return res.status(201).json({ success: true, data: savedObj, fallback: true, message: 'Portfolio saved to memory storage!' });
    }
  } catch (error) {
    console.error('[Create Portfolio Error]:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePortfolio = async (req, res) => {
  const { id } = req.params;
  try {
    const data = req.body;

    if (mongoose.connection.readyState === 1) {
      let updated = null;
      if (mongoose.Types.ObjectId.isValid(id)) {
        updated = await Portfolio.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      }
      if (!updated) {
        updated = await Portfolio.findOneAndUpdate({ slug: id.toLowerCase() }, data, { new: true, runValidators: true });
      }

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Portfolio not found' });
      }
      return res.status(200).json({ success: true, data: updated, message: 'Portfolio updated in MongoDB!' });
    } else {
      const existing = inMemoryPortfolios.get(id);
      if (existing) {
        const merged = { ...existing, ...data, updatedAt: new Date() };
        inMemoryPortfolios.set(id, merged);
        return res.status(200).json({ success: true, data: merged });
      }
      return res.status(404).json({ success: false, message: 'Portfolio not found in memory' });
    }
  } catch (error) {
    console.error('[Update Portfolio Error]:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePortfolio = async (req, res) => {
  const { id } = req.params;
  try {
    if (mongoose.connection.readyState === 1) {
      await Portfolio.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Portfolio deleted from MongoDB' });
    } else {
      inMemoryPortfolios.delete(id);
      return res.status(200).json({ success: true, message: 'Portfolio removed from memory' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
