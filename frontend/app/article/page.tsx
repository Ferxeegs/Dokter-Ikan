'use client'

import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Image from 'next/image';

// Definisikan tipe data untuk artikel
interface Article {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("technology");
  const articlesPerPage = 6;
  const apiKey = "2d5751fb84064528b4c406836900355b";

  useEffect(() => {
    fetch(`https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ok") {
          setArticles(data.articles);
          setCurrentPage(1);
        }
      })
      .catch((error) => console.error("Error fetching articles:", error));
  }, [searchQuery]);

  // Hitung indeks awal dan akhir untuk pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen flex flex-col">
      <Navbar />

      <main className="container mx-auto p-4 sm:p-6 flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-0">Discover the Latest Tech Trends</h1>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border text-gray-700 border-gray-400 rounded-lg shadow-sm w-full sm:w-auto"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {currentArticles.map((article, index) => (
            <div key={index} className="bg-white p-4 sm:p-6 shadow-2xl rounded-2xl transform transition duration-300 hover:scale-105 hover:shadow-xl">
              <div className="relative w-full h-40 sm:h-56">
                <Image
                  src={article.urlToImage || "https://via.placeholder.com/300"}
                  alt={article.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                  unoptimized={true}
                />
              </div>
              <h2 className="text-lg sm:text-2xl font-bold mt-4 text-gray-800">{article.title}</h2>
              <p className="text-sm sm:text-base text-gray-700 mt-3">{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold hover:text-indigo-800 mt-3 inline-block">Read more →</a>
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-center mt-6 space-x-4 items-center">
          <button
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg disabled:opacity-50"
          >
            Back
          </button>
          <span className="text-gray-900 font-semibold">Page {currentPage}</span>
          <button
            onClick={() => handlePageChange(indexOfLastArticle < articles.length ? currentPage + 1 : currentPage)}
            disabled={indexOfLastArticle >= articles.length}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}