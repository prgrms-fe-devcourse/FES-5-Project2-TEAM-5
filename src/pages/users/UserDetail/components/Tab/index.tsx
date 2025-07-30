import { useState } from 'react';
import S from './style.module.css';
import { tabs } from './constant';

interface TabsProps {
  onTabChange?: (id: string) => void;
}

const Tabs = ({ onTabChange }: TabsProps) => {
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id || '');

  const handleClick = (id: string) => () => {
    setActiveTabId(id);
    if (onTabChange) onTabChange(id);
  };

  return (
    <section className={S.tab}>
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`${S.tabButtons} ${activeTabId === id ? S.activeTabButton : ''}`}
          onClick={handleClick(id)}
        >
          {label}
        </button>
      ))}
    </section>
  );
};

export default Tabs;
