import express from 'express';
import { ingestGitHubProfile } from '../controllers/githubController.js';

const router = express.Router();

// GET /api/github/:username
router.get('/:username', ingestGitHubProfile);

export default router;
