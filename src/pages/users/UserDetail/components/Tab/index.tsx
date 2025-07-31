import S from './style.module.css';
import { tabs } from './constant';

interface TabsProps {
  activeTabId: string;
  onTabChange: (id: string) => void;
}

const Tabs = ({ activeTabId, onTabChange }: TabsProps) => {
  const handleClick = (id: string) => () => {
    onTabChange(id);
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
