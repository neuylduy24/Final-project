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
    fetch("http://localhost:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setGenres(data));

    fetch("http://localhost:8080/api/authors")
      .then((res) => res.json())
      .then((data) => setAuthors(data));
  }, []);

  const toggleSelection = (item, list, setList) => {
    setList((prev) => (prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Chọn sở thích của bạn</h2>
      <p className="text-sm text-gray-600 mb-6">Chọn thể loại và tác giả yêu thích để chúng tôi gợi ý truyện phù hợp.</p>
      
      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Thể loại yêu thích</h3>
          <div className="grid grid-cols-2 gap-2">
            {genres.map((genre) => (
              <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox checked={selectedGenres.includes(genre)} onCheckedChange={() => toggleSelection(genre, selectedGenres, setSelectedGenres)} />
                <span>{genre}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Tác giả yêu thích</h3>
          <div className="grid grid-cols-2 gap-2">
            {authors.map((author) => (
              <label key={author} className="flex items-center space-x-2 cursor-pointer">
                <Checkbox checked={selectedAuthors.includes(author)} onCheckedChange={() => toggleSelection(author, selectedAuthors, setSelectedAuthors)} />
                <span>{author}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between mt-4">
        <Button variant="outline" onClick={() => onComplete(null)}>Bỏ qua</Button>
        <Button onClick={() => onComplete({ genres: selectedGenres, authors: selectedAuthors })}>
          Hoàn thành
        </Button>
      </div>
    </motion.div>
  );
}