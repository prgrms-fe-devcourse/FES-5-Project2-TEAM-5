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
    path: '/analysis/select-diary',
    label: '감성분석',
  },
  {
    name: 'Community Diary',
    path: '/community',
    label: '커뮤니티 일기장',
  },
  {
    name: 'User List',
    path: '/users',
    label: '유저 리스트',
  },
];
