
import { Search } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

interface HeaderProps {
  onSearch: (term: string) => void;
  doctors: Array<{ name: string; specialty: string[] }>;
  searchTerm: string;
}

const Header: React.FC<HeaderProps> = ({ onSearch, doctors, searchTerm }) => {
  const [inputValue, setInputValue] = useState(searchTerm || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim().length > 0) {
      // Generate suggestions from doctor names and specialties
      const allSuggestions: string[] = [];
      
      // Add doctor names
      doctors.forEach(doctor => {
        if (doctor.name.toLowerCase().includes(value.toLowerCase())) {
          allSuggestions.push(doctor.name);
        }
      });
      
      // Add specialties
      doctors.forEach(doctor => {
        doctor.specialty.forEach(spec => {
          if (spec.toLowerCase().includes(value.toLowerCase()) && !allSuggestions.includes(spec)) {
            allSuggestions.push(spec);
          }
        });
      });
      
      setSuggestions(Array.from(new Set(allSuggestions)).slice(0, 3));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch(inputValue);
      setShowSuggestions(false);
    }
  };

  return (
    <header className="bg-primary shadow-md py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">
            DocScope
          </h1>
          <div className="relative w-full md:w-1/2 lg:w-1/3">
            <div className="relative">
              <input
                ref={inputRef}
                data-testid="autocomplete-input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Search doctors or specialties..."
                className="w-full pl-10 pr-4 py-2 rounded-full border-2 border-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10"
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    data-testid="suggestion-item"
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
