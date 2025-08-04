import type { TabType } from '../../utils/type';
import { tabs } from './constants';
import S from './style.module.css';

interface Props {
  activeTab: TabType;
  onTabChange: React.Dispatch<React.SetStateAction<TabType>>;
}

const TabNav = ({ activeTab, onTabChange }: Props) => {
  const handleKeyDown =
    (id: TabType) =>
    (e: React.KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onTabChange(id);
      }
    };

  return (
    <nav className={S.navTab} aria-label="프로필 탭">
      <ul className={S.tab} role="tablist">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            tabIndex={0}
            className={activeTab === tab.id ? S.isActive : ''}
            role="tab"
            onClick={() => onTabChange(tab.id)}
            onKeyDown={handleKeyDown(tab.id)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default TabNav;
