import S from './style.module.css';
import { useState } from 'react';
import { IoArrowUpCircleOutline, IoLockOpenOutline } from 'react-icons/io5';
import diaryImage from '../assets/@diary_detail_img.png';
import { BsChat } from 'react-icons/bs';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import Emotion7 from '/src/assets/icon_expect.svg';
import DiaryWeather from '@/shared/components/DiaryWeather';

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  profileImage?: string;
}

interface DiaryEntry {
  id: number;
  title: string;
  content: string;
  image?: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  hashtags: string[];
  timestamp: string;
}

const DiaryDetailPage = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([
    {
      id: 1,
      title: '오늘은 날씨가 선선해서 기분이 좋아 😊',
      content: `아니, 진짜 오늘 날씨 무슨 일이야? 날씨 요정님이 나 몰래 특급 선물이라도 준 건가? 🎁 
아침에 눈 뜨자마자부터 뭔가 달라.
평소엔 이불 뻥 차고 일어나기 싫어서 버티는데, 오늘은 뭔가 상쾌함 그 자체! 베란다 창문 살짝 열어뒀었는데, 선선한 바람이 솔솔 불어오는데 진짜 에어컨 켤 필요 1도 없음. 🌬️ 
진짜 딱 이맘때만 느낄 수 있는 그 '꿉꿉하지 않은 맑고 시원한 바람' 있잖아? 그거임. 이거 완전 기분 자동으로 좋아지는 날씨 조합 아니냐고. 
아 진짜 집에만 있기 너무 아까운 날씨인 거 알지? 원래 점심 먹고 나른해서 바로 침대에 눕눕 각인데, 오늘은 갑자기 활기 넘쳐서 청소도 싹 다 하고 환기도 시키고 아주 난리났음. 
창문 활짝 열어놓고 있으니까 햇살도 포근하게 들어오고, 바람 소리도 사각사각 거리는 게 막 ASMR 같고 너무 좋잖아. 🎧
이런 날은 진짜 별거 안 해도 행복 수치 폭발함. 괜히 기획 아이디어도 막 샘솟고, 지금 하는 개발 프로젝트도 술술 풀릴 것 같은 막연한 자신감 생기고? 💪 
어제 좀 막혀서 머리 싸매던 코드도 오늘은 막 천재처럼 해결할 수 있을 것 같은 느낌이 드네! 역시 코딩도 날씨 운이 따르는 거였어! ㅋㅋㅋ 
감정 일기 플랫폼에 넣을 캐릭터들한테도 선선한 바람 불어주는 애니메이션 넣어주고 싶다 막 이래. 🌱

저녁엔 이 완벽한 날씨를 그냥 보낼 수 없지! 집콕하면서 맛있는 거 시켜 먹는 게 최고긴 한데... 음, 잠시 고민 좀 해봐야겠다. 
선선한 바람 맞으면서 밤 산책이라도 나가야 하나? 아님 분위기 좋은 카페 테라스에 앉아서 따뜻한 라떼 한 잔 마시면서 작업 좀 할까?
 아니면 집에서 캔들 켜놓고 재즈 틀어놓고 여유 부릴까? 행복한 고민이다 진짜. 😍
진짜 이대로 시간이 멈췄으면 좋겠어. ㅠㅠ 맨날 이런 날씨만 계속되면 좋겠는데, 왜 여름은 순식간에 지나가고 다시 찌는 듯한 더위가 올까?
 후... 미래는 잠시 접어두고 오늘 이 완벽한 순간을 최대한 즐겨야겠어! 🫶 

이 기분 그대로 밤까지 쭉 이어서 숙면해야지! 굿밤 예약이다 진짜! 💖`,
      image: diaryImage,
      likes: 2,
      isLiked: false,
      comments: [
        {
          id: 1,
          author: '프롱프롱이',
          content: '저도 오늘 기분이 너무 좋네요~~ :)',
          timestamp: '2025.07.18',
          profileImage: Emotion7,
        },
        {
          id: 2,
          author: '프랑이',
          content: '날씨가 정말 선선해졌어요! 어디 놀러가기 딱 좋은 날씨네요!',
          timestamp: '2025.07.18',
          profileImage: '',
        },
      ],
      hashtags: ['날씨', '씨앗일기', '감정일기'],
      timestamp: '2025.07.18',
    },
  ]);

  const [newComment, setNewComment] = useState('');

  const handleLike = (id: number) => {
    setDiaries((prev) =>
      prev.map((diary) =>
        diary.id === id
          ? {
              ...diary,
              likes: diary.isLiked ? diary.likes - 1 : diary.likes + 1,
              isLiked: !diary.isLiked,
            }
          : diary,
      ),
    );
  };

  const handleAddComment = (diaryId: number) => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: Date.now(),
      author: '나',
      content: newComment,
      timestamp: new Date()
        .toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\.\s/g, '.')
        .slice(0, -1),
    };

    setDiaries((prev) =>
      prev.map((diary) =>
        diary.id === diaryId ? { ...diary, comments: [...diary.comments, newCommentObj] } : diary,
      ),
    );
    setNewComment('');
  };

  return (
    <main className={S.container}>
      <DiaryWeather />
      <div className={S.inner}>
        {diaries.map((diary) => (
          <div key={diary.id} className="">
            <div className={S.titleArea}>
              <span className={S.date}>{diary.timestamp}</span>
              <h3>
                {diary.title}
                <ul>
                  <li>
                    <img src="/src/assets/icon_expect.svg" alt="기대" />
                    기대
                  </li>
                  <li className={S.publicOrNot}>
                    <IoLockOpenOutline />
                    공개
                  </li>
                </ul>
              </h3>
            </div>

            <p className={S.content}>{diary.content}</p>

            {diary.image && (
              <figure className={S.diaryImage}>
                <img src={diary.image} alt="" />
                <figcaption className="sr-only">일기장 이미지</figcaption>
              </figure>
            )}

            {/* Hashtags */}
            <div className={S.hashtag}>
              {diary.hashtags.map((tag, index) => (
                <span key={index}>#{tag}</span>
              ))}
            </div>

            {/* 댓글 영역 */}
            <section className={S.commnetArea}>
              <h4 className="sr-only">댓글 영역</h4>
              <div className={S.commentHead}>
                <span>
                  <BsChat size={20} />
                  댓글 {diary.comments.length}
                </span>
                <span onClick={() => handleLike(diary.id)}>
                  {diary.isLiked ? (
                    <IoMdHeart size={24} color="#f66" />
                  ) : (
                    <IoMdHeartEmpty size={24} />
                  )}
                  {diary.likes}
                </span>
              </div>

              <div className={S.commentBox}>
                {/* 댓글 내용 */}
                <div className={S.commnetItem}>
                  {diary.comments.map((comment) => (
                    <div key={comment.id}>
                      <div className={S.profileImage}>
                        {comment.profileImage ? (
                          <img src={comment.profileImage} alt={`${comment.author}의 프로필`} />
                        ) : (
                          <span>{comment.author.charAt(0)}</span>
                        )}
                      </div>
                      <div className={S.commentInfo}>
                        <div className={S.userInfo}>
                          <span>{comment.author}</span>
                          <span className={S.createDate}>{comment.timestamp}</span>
                        </div>
                        <p className={S.commnetContent}>{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 댓글 입력창 */}
                <div className={S.commentPrompt}>
                  <input
                    type="text"
                    className={S.customInput}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="응원과 공감의 글을 보내 주세요"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment(diary.id)}
                  />
                  <button onClick={() => handleAddComment(diary.id)} className={S.commentBtn}>
                    <IoArrowUpCircleOutline size={24} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        ))}

        {/* 버튼 */}
        <div className={S.buttonGroup}>
          <button type="button" className={S.bgGrayBtn}>
            목록으로
          </button>
          <button type="submit" className={S.lineBtn}>
            삭제
          </button>
          <button type="submit" className={S.bgPrimaryBtn}>
            수정
          </button>
        </div>
      </div>
    </main>
  );
};

export default DiaryDetailPage;
