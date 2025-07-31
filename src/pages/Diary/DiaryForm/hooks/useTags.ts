import { useState } from 'react';

export const useTags = (initialTags: string[] = []) => {
  const [tagInput, setTagInput] = useState<string>(
    initialTags.length > 0 ? initialTags.join(' ') : '',
  );
  const [tags, setTags] = useState<string[]>(initialTags);

  const handleTagInputChange = (value: string) => {
    setTagInput(value);

    const parsedTags = value
      .split(' ')
      .map((tag) => tag.trim())
      .filter((tag) => tag.startsWith('#') && tag.length > 1);

    setTags(parsedTags);
  };

  return {
    tagInput,
    tags,
    setTagInput,
    setTags,
    handleTagInputChange,
  };
};
