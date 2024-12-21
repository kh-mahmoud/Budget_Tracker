'use client'

import React from 'react';
import { Input } from '../ui/input';
import useDebounce from '@/hooks/useDebouncer';



const SearchBar = () => {
  const [search, setSearch] = React.useState('');
  useDebounce(search, 100);

  return (
    <div className="w-[90%]">
      <Input
        type="text"
        placeholder="Search Project Title"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        className="custom_input"
      />
    </div>
  );
};

export default SearchBar;
