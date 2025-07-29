import { PATHS } from '@/shared/constants/path';

interface MenuList {
  name: string;
  path: string;
  label: string;
  requireAuth: boolean;
}

export const MENU_LIST: MenuList[] = [
  {
    name: 'Diary',
    path: '/diary',
    label: '일기장',
    requireAuth: true,
  },
  {
    name: 'Emotional Analysis',
    path: '/analysis/select-diary',
    label: '감성분석',
    requireAuth: true,
  },
  {
    name: 'Community Diary',
    path: '/community',
    label: '커뮤니티 일기장',
    requireAuth: true,
  },
  {
    name: 'User List',
    path: '/users',
    label: '유저 리스트',
    requireAuth: true,
  },
  {
    name: 'About',
    path: PATHS.ABOUT,
    label: '어바웃',
    requireAuth: false,
  },
];
