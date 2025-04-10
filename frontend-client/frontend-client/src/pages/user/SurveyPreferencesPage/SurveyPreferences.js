import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

export default function SurveyPreferences({ onComplete }) {
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  useEffect(() => {
    fetch("https://api.it-ebook.io.vn/api/categories")
      .then((res) => res.json())
      .then((data) => setGenres(data));

    fetch("https://api.it-ebook.io.vn/api/authors")
      .then((res) => res.json())
      .then((data) => setAuthors(data));
  }, []);

  const toggleSelection = (item, list, setList) => {
    setList((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <Card className="w-[90%] max-w-[500px] max-h-[90vh] overflow-auto bg-white rounded-lg shadow-xl">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-center mb-4">Chọn thể loại bạn yêu thích</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">Chọn thể loại và tác giả yêu thích để chúng tôi gợi ý truyện phù hợp.</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Thể loại</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {genres.map((genre) => (
                <div 
                  key={genre} 
                  onClick={() => toggleSelection(genre, selectedGenres, setSelectedGenres)}
                  className={`px-4 py-2 rounded-full border cursor-pointer transition-all duration-200 text-sm
                    ${selectedGenres.includes(genre) 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'}`}
                >
                  {genre}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-center">Tác giả</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {authors.map((author) => (
                <div 
                  key={author} 
                  onClick={() => toggleSelection(author, selectedAuthors, setSelectedAuthors)}
                  className={`px-4 py-2 rounded-full border cursor-pointer transition-all duration-200 text-sm
                    ${selectedAuthors.includes(author) 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'}`}
                >
                  {author}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => onComplete(null)}
              className="px-6 py-2 rounded-full border border-gray-300 hover:bg-gray-100"
            >
              Bỏ qua
            </Button>
            <Button 
              onClick={() => onComplete({ genres: selectedGenres, authors: selectedAuthors })}
              className="px-6 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Xác nhận
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}