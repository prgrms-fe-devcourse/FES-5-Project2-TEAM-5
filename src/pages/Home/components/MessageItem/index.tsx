import type { Tables } from '@/shared/api/supabase/types';
import molly from '../../assets/molly_profile.svg';
import S from './style.module.css';
import defaultProfile from '@/assets/defaultProfile.svg';
import { extractTimeOnly } from '@/shared/utils/formatDate';

interface Props {
  message: Tables<'chat_messages'>;
  userProfileUrl?: string | null;
}

const MessageItem = ({ message, userProfileUrl }: Props) => {
  const { role, content, created_at } = message;

  if (role === 'model') {
    return <AiChat content={content} created_at={created_at} />;
  }

  return <UserChat content={content} created_at={created_at} profileUrl={userProfileUrl} />;
};
export default MessageItem;

const AiChat = ({ content, created_at }: { content: string; created_at: string }) => {
  return (
    <div className={S.modalContainer}>
      <img className={S.profileImage} src={molly} alt="몰리 캐릭터" />
      <p className={S.modelMessage}>{content}</p>
      <span className={S.messageTile}>{extractTimeOnly(created_at)}</span>
    </div>
  );
};

const UserChat = ({
  content,
  profileUrl,
  created_at,
}: {
  content: string;
  created_at: string;
  profileUrl?: string | null;
}) => {
  return (
    <div className={S.userContainer}>
      <span className={S.messageTile}>{extractTimeOnly(created_at)}</span>
      <p className={S.userMessage}>{content}</p>
      <img
        className={S.profileImage}
        src={profileUrl ? profileUrl : defaultProfile}
        alt="유저 프로필"
      />
    </div>
  );
};
