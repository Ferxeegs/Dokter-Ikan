import express from 'express';
import { getAllArticles, getArticleById } from '../controllers/ArticleController.js';

const router = express.Router();

router.get('/articles', getAllArticles);
router.get('/articles/:id', getArticleById);

export default router;
