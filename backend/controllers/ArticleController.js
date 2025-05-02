import Article from '../models/ArticleModel.js';
import "regenerator-runtime/runtime.js";

export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll();
    return res.success('Berhasil mengambil data artikel', articles);
  } catch (error) {
    return res.fail('Gagal mengambil data artikel', error.message, 500);
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findByPk(id);
    if (!article) {
      return res.fail('Artikel tidak ditemukan', null, 404);
    }
    return res.success('Berhasil mengambil data artikel', article);
  } catch (error) {
    return res.fail('Gagal mengambil artikel', error.message, 500);
  }
};
