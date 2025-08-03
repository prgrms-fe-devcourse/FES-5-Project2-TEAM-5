import { useState } from 'react';

export const useTags = (initialTags: string[] = []) => {
  const [tagInput, setTagInput] = useState<string>(
    initialTags.length > 0 ? initialTags.join(' ') : '',
  );
  const [tags, setTags] = useState<string[]>(initialTags);

  const parseTagInput = (value: string): string[] => {
    if (!value.trim()) return [];

    let parsedTags: string[] = [];

    if (value.includes('#')) {
      // # 기준으로 분리하되, 공백과 쉼표도 고려
      parsedTags = value
        .split(/[\s,]+/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .map((tag) => {
          return tag.startsWith('#') ? tag : `#${tag}`;
        })
        .filter((tag) => tag.length > 1);
    } else {
      parsedTags = value
        .split(/[\s,]+/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
        .map((tag) => `#${tag}`);
    }

    const uniqueTags = Array.from(new Set(parsedTags)).filter((tag) => {
      return tag.startsWith('#') && tag.slice(1).trim().length > 0;
    });

    return uniqueTags;
  };

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    const parsedTags = parseTagInput(value);
    setTags(parsedTags);
  };

  // 엔터나 쉼표 입력 시 태그 자동 완성
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();

      const currentValue = tagInput.trim();
      if (!currentValue) return;

      const parsedTags = parseTagInput(currentValue);

      if (parsedTags.length > 0) {
        setTags(parsedTags);
        setTagInput(parsedTags.join(' '));
      }
    }

    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    setTagInput(newTags.join(' '));
  };

  const addTag = (newTag: string) => {
    const formattedTag = newTag.startsWith('#') ? newTag : `#${newTag}`;
    if (formattedTag.length > 1 && !tags.includes(formattedTag)) {
      const newTags = [...tags, formattedTag];
      setTags(newTags);
      setTagInput(newTags.join(' '));
      return true;
    }
    return false;
  };

  return {
    tagInput,
    tags,
    setTagInput,
    setTags,
    handleTagInputChange,
    handleTagInputKeyDown,
    removeTag,
    addTag,
    parseTagInput,
  };
};
