import { useState } from 'react';

export function useToggleList(initial: number[] = []) {
  const [selected, setSelected] = useState<number[]>(initial);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      return updated.sort((a, b) => a - b); // 오름차순 정렬
    });
  };

  return { selected, toggle };
}