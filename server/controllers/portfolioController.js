import { Portfolio } from '../models/Portfolio.js';
import mongoose from 'mongoose';
import {
  validateCreatePortfolio,
  validateUpdatePortfolio,
  parseIdentifier
} from '../validators/portfolioValidator.js';

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
  const parsed = parseIdentifier(id);
  if (!parsed.isValid) {
    return res.status(404).json({ success: false, message: `Portfolio '${id}' not found` });
  }

  const { cleanId, isObjectId, isSlug } = parsed;

  try {
    let portfolio = null;

    if (mongoose.connection.readyState === 1) {
      if (isObjectId) {
        portfolio = await Portfolio.findById(cleanId);
      }
      if (!portfolio && isSlug) {
        portfolio = await Portfolio.findOne({ slug: cleanId.toLowerCase() });
      }
    } else {
      portfolio = inMemoryPortfolios.get(cleanId) || 
        Array.from(inMemoryPortfolios.values()).find(p => p.slug === cleanId.toLowerCase());
    }

    if (!portfolio) {
      return res.status(404).json({ success: false, message: `Portfolio '${cleanId}' not found` });
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
  const parsed = parseIdentifier(id);
  if (!parsed.isValid) {
    return res.status(404).json({ success: false, message: `Portfolio '${id}' not found` });
  }

  const { cleanId, isObjectId, isSlug } = parsed;

  const validation = validateUpdatePortfolio(req.body);
  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: validation.errors.join(' ')
    });
  }

  const data = validation.sanitizedData;

  try {
    if (mongoose.connection.readyState === 1) {
      let updated = null;
      if (isObjectId) {
        updated = await Portfolio.findByIdAndUpdate(cleanId, data, { new: true, runValidators: true });
      }
      if (!updated && isSlug) {
        updated = await Portfolio.findOneAndUpdate({ slug: cleanId.toLowerCase() }, data, { new: true, runValidators: true });
      }

      if (!updated) {
        return res.status(404).json({ success: false, message: `Portfolio '${cleanId}' not found` });
      }
      return res.status(200).json({ success: true, data: updated, message: 'Portfolio updated in MongoDB!' });
    } else {
      let key = null;
      let existing = null;

      if (inMemoryPortfolios.has(cleanId)) {
        key = cleanId;
        existing = inMemoryPortfolios.get(cleanId);
      } else {
        const entry = Array.from(inMemoryPortfolios.entries()).find(([_, p]) => p.slug === cleanId.toLowerCase());
        if (entry) {
          key = entry[0];
          existing = entry[1];
        }
      }

      if (existing) {
        // Prevent mutation of protected fields in memory
        const merged = {
          ...existing,
          ...data,
          _id: existing._id,
          createdAt: existing.createdAt,
          updatedAt: new Date()
        };
        inMemoryPortfolios.set(key, merged);
        return res.status(200).json({ success: true, data: merged });
      }
      return res.status(404).json({ success: false, message: `Portfolio '${cleanId}' not found in memory` });
    }
  } catch (error) {
    console.error('[Update Portfolio Error]:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePortfolio = async (req, res) => {
  const { id } = req.params;
  const parsed = parseIdentifier(id);
  if (!parsed.isValid) {
    return res.status(404).json({ success: false, message: `Portfolio '${id}' not found` });
  }

  const { cleanId, isObjectId, isSlug } = parsed;

  try {
    if (mongoose.connection.readyState === 1) {
      let deleted = null;
      if (isObjectId) {
        deleted = await Portfolio.findByIdAndDelete(cleanId);
      }
      if (!deleted && isSlug) {
        deleted = await Portfolio.findOneAndDelete({ slug: cleanId.toLowerCase() });
      }

      if (!deleted) {
        return res.status(404).json({ success: false, message: `Portfolio '${cleanId}' not found` });
      }
      return res.status(200).json({ success: true, message: 'Portfolio deleted successfully' });
    } else {
      if (inMemoryPortfolios.has(cleanId)) {
        inMemoryPortfolios.delete(cleanId);
        return res.status(200).json({ success: true, message: 'Portfolio removed from memory' });
      }

      const entry = Array.from(inMemoryPortfolios.entries()).find(([_, p]) => p.slug === cleanId.toLowerCase());
      if (entry) {
        inMemoryPortfolios.delete(entry[0]);
        return res.status(200).json({ success: true, message: 'Portfolio removed from memory' });
      }

      return res.status(404).json({ success: false, message: `Portfolio '${cleanId}' not found in memory` });
    }
  } catch (error) {
    console.error('[Delete Portfolio Error]:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
