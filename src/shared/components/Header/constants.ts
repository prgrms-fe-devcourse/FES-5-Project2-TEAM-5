interface MenuList {
  name: string;
  path: string;
  label: string;
}

export const MENU_LIST: MenuList[] = [
  {
    name: 'Diary',
    path: '/diary',
    label: '일기장',
  },
  {
    name: 'Emotional Analysis',
    path: '/analysis',
    label: '감성분석',
  },
  {
    name: 'Community Diary',
    path: '/community',
    label: '커뮤니티 일기장',
  },
  {
    name: 'Subscriber List',
    path: '/subscriber',
    label: '유저 리스트',
  },
];
