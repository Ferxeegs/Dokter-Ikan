'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Image from 'next/image';
import { Search, ChevronLeft, ChevronRight, Calendar, User, ExternalLink, Filter, X } from 'lucide-react';

// Define article data type to match the API response
interface Article {
  article_id: number;
  author: string;
  title: string;
  description: string;
  url: string;
  urltoimage: string; // Note the lowercase 'i' in urltoimage
  contents: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Article[];
}

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const articlesPerPage = 6;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Function to format dates
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  // Navigate to article detail page
  const navigateToArticle = (articleId: number) => {
    router.push(`/articles?id=${articleId}`);
  };

  // Fetch all articles on initial load
  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_BASE_URL}/articles`)
      .then((response) => response.json())
      .then((responseData: ApiResponse) => {
        if (responseData.success) {
          setArticles(responseData.data);
          setFilteredArticles(responseData.data);
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Set(responseData.data.map(article => article.category))
          ).sort();
          setCategories(uniqueCategories);
          
          setCurrentPage(1);
        }
      })
      .catch((error) => console.error("Error fetching articles:", error))
      .finally(() => setIsLoading(false));
  }, [API_BASE_URL]);

  // Apply filters when search query or category changes
  useEffect(() => {
    let results = articles;
    
    // Apply search filter (by title)
    if (searchQuery) {
      results = results.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory) {
      results = results.filter(article => 
        article.category === selectedCategory
      );
    }
    
    setFilteredArticles(results);
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, articles]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(""); // Toggle off if already selected
    } else {
      setSelectedCategory(category);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
  };

  // Calculate indices for pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col">
      <Navbar />

      <div className="w-full bg-gradient-to-r from-blue-100 to-blue-50 py-8 border-b border-blue-200 shadow-sm">
        <div className="container mx-auto px-4">
          <h1 className="text-xl md:text-3xl font-bold text-blue-800 text-center mb-2">
            Artikel Dokterikan
          </h1>
          <p className="text-blue-600 text-sm md:text-base text-center max-w-2xl mx-auto">
            Informasi seputar dunia perikanan dan kesehatan ikan
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 mb-8">
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <form onSubmit={handleSearch} className="w-full md:w-2/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari artikel berdasarkan judul..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 rounded-lg bg-blue-50 border border-blue-200 text-gray-700 focus:border-blue-400 focus:ring-0 focus:outline-none transition duration-300"
                />
                <Search className="absolute left-3 top-2.5 text-blue-400" size={18} />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </form>
            
            <div className="w-full md:w-auto flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition duration-200"
              >
                <Filter size={16} />
                <span>Filter</span>
                <span className="text-xs bg-blue-200 text-blue-800 rounded-full px-2 py-0.5">
                  {selectedCategory ? '1' : '0'}
                </span>
              </button>
              
              {(selectedCategory) && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 text-sm text-blue-600 hover:text-blue-800 transition duration-200"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          
          {/* Category Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-blue-100">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Filter berdasarkan kategori:</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1.5 text-xs rounded-full transition duration-200 ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            Menampilkan {filteredArticles.length} artikel{selectedCategory ? ` dalam kategori "${selectedCategory}"` : ''}
            {searchQuery ? ` dengan kata kunci "${searchQuery}"` : ''}
          </p>
          <div className="text-sm text-gray-600">
            Halaman {currentPage} dari {totalPages || 1}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-blue-100">
            <p className="text-lg text-blue-700 mb-3">Tidak ada artikel ditemukan.</p>
            <p className="text-gray-600">Coba kata kunci lain atau ubah filter yang digunakan.</p>
            <button 
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition duration-200"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentArticles.map((article) => (
                <div 
                  key={article.article_id} 
                  className="bg-white rounded-lg overflow-hidden shadow-sm border border-blue-50 hover:shadow-md transition duration-300 cursor-pointer"
                  onClick={() => navigateToArticle(article.article_id)}
                >
                  <div className="relative w-full h-52">
                    <Image
                      src={article.urltoimage || "/images/placeholder.jpg"}
                      alt={article.title}
                      layout="fill"
                      objectFit="cover"
                      className="transition duration-300 hover:opacity-90"
                      unoptimized={true}
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <span className="inline-block px-3 py-1 bg-blue-500 bg-opacity-80 text-white text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-semibold mb-2.5 text-gray-800 line-clamp-2 hover:text-blue-700 transition duration-200">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        <span>{formatDate(article.createdAt)}</span>
                        <span className="mx-2">•</span>
                        <User size={12} className="mr-1" />
                        <span className="truncate max-w-[120px]">{article.author}</span>
                      </div>
                      
                      <div 
                        className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-800 transition duration-300"
                      >
                        Baca
                        <ExternalLink size={14} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="inline-flex items-center rounded-lg bg-white shadow-sm border border-blue-100 overflow-hidden">
                  <button
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:text-blue-300 border-r border-blue-100"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    // Show limited page numbers for better UX
                    if (
                      i + 1 === 1 ||
                      i + 1 === totalPages ||
                      (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-9 h-9 flex items-center justify-center mx-0.5 text-sm ${
                            currentPage === i + 1
                              ? "bg-blue-100 text-blue-700 font-medium"
                              : "text-gray-700 hover:bg-blue-50"
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    } else if (i + 1 === currentPage - 2 || i + 1 === currentPage + 2) {
                      return (
                        <span key={i} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2.5 text-blue-600 hover:bg-blue-50 disabled:opacity-40 disabled:hover:bg-transparent disabled:text-blue-300 border-l border-blue-100"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}