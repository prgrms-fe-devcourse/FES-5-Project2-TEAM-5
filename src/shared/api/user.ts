import type { User } from '@supabase/supabase-js';
import supabase from './supabase/client';
import { getPublicUrl } from './supabase/getPublicUrl';
import type { Tables } from './supabase/types';

/**
 * 유저 테이블에 유저 생성
 */
export const createNewUser = async (params: {
  id: string;
  name: string;
  email: string;
  profile_image: string | null;
}): Promise<void> => {
  const { error } = await supabase.from('users').insert(params);

  if (error) {
    throw new Error('회원가입에 실패했습니다.');
  }
};

/**
 * 유저 프로필 사진 업로드
 */
export const uploadProfileImage = async ({
  file,
  userId,
}: {
  file: File;
  userId: string;
}): Promise<string> => {
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}.${timestamp}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('profile')
    .upload(filePath, file, { cacheControl: '0', upsert: true });

  const publicUrl = getPublicUrl({ bucket: 'profile', filePath });

  if (error || !data) {
    throw new Error('이미지 업로드에 실패하였습니다.');
  }

  return publicUrl;
};

/**
 * 유저 닉네임 변경
 */
export const uploadUserNickname = async ({
  nickname,
  id,
}: {
  nickname: string;
  id: string;
}): Promise<Tables<'users'>> => {
  const { data, error } = await supabase
    .from('users')
    .update({ name: nickname })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error('닉네임 변경에 실패했습니다.');
  }
  return data;
};

/**
 * 유저 프로필 저장
 */
export const updateProfileImage = async ({
  url,
  id,
}: {
  url: string | null;
  id: string;
}): Promise<Tables<'users'>> => {
  const { data, error: updateError } = await supabase
    .from('users')
    .update({ profile_image: url })
    .eq('id', id)
    .select()
    .single();

  if (updateError) {
    throw new Error('프로필 업데이트를 실패했습니다.');
  }
  return data;
};

/**
 * 유저 프로필 삭제
 */
export const removeProfileImage = async (filePath: string) => {
  const { error: storageError } = await supabase.storage.from('profile').remove([filePath]);

  if (storageError) {
    throw new Error('스토리지 프로필 이미지 삭제 실패했습니다.');
  }
};

/**
 * 유저정보 조회
 */
export const getUserDataById = async (id: string) => {
  const { data, error } = await supabase.from('users').select().eq('id', id).maybeSingle();
  if (error) {
    throw new Error('사용자 정보 로드 실패');
  }
  return data;
};

/**
 * 전체 유저정보 조회
 */
export const getAllUser = async () => {
  const { data, error } = await supabase.from('users').select('*');

  if (error) {
    throw new Error(`전체 유저 정보 조회 실패: ${error}}`);
  }
  return data;
};

/**
 * 전체 유저정보 조회 (검색 포함)
 */
export const getAllUserData = async (page: number = 1, limit: number = 20, search?: string) => {
  const offset = (page - 1) * limit;

  let query = supabase.from('users').select('*');

  if (search?.trim()) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    throw new Error(`전체 유저 정보 조회 실패: ${error.message}`);
  }

  return data || [];
};

/**
 * 소셜 로그인 시 사용자 프로필을 생성하거나 업데이트
 * 사용자가 처음 로그인하면 DB에 프로필을 생성
 */
export const insertUserProfileOnLogin = async (user: User): Promise<void> => {
  const { data: existingProfile, error: selectError } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (selectError) {
    throw new Error('사용자 프로필 조회 중 에러 발생');
  }

  if (existingProfile) {
    return;
  }

  const { full_name, name, avatar_url } = user.user_metadata;

  const { error: insertError } = await supabase.from('users').upsert({
    id: user.id,
    name: name || full_name,
    email: user.email,
    profile_image: avatar_url,
  });

  if (insertError) {
    throw new Error('사용자 프로필 생성 중 오류 발생');
  }
};
