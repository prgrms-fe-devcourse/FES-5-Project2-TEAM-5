import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '@/styles/custom.css';
import CalendarImg from '../../../assets/calendar_img.svg';
import DiaryCompleted from '../../../assets/diary_completed.svg';
import DiaryEmpty from '../../../assets/diary_empty.svg';
import { useCallback } from 'react';
import { toastUtils } from '@/shared/components/Toast';
import { getLocalDateString, isFutureDate } from '@/shared/utils/dateUtils';

type DiaryEntry = {
  created_at: string;
};

type Props = {
  userId: string | null;
  date: Date | null;
  onDateChange: (date: Date) => void;
  entries: DiaryEntry[];
};

const DiaryCalendar = ({ userId, date, onDateChange, entries }: Props) => {
  const todayStr = getLocalDateString(new Date());

  // 날짜 클릭 핸들러 (미래 날짜 방지)
  const handleDateClick = useCallback(
    (clickedDate: Date) => {
      if (isFutureDate(clickedDate)) {
        toastUtils.error({
          title: '선택 불가',
          message: '미래 날짜는 선택할 수 없습니다.',
        });
        return;
      }
      onDateChange(clickedDate);
    },
    [isFutureDate, onDateChange],
  );

  const tileDisabled = useCallback(
    ({ date: tileDate, view }: { date: Date; view: string }) => {
      if (view !== 'month') return false;
      return isFutureDate(tileDate);
    },
    [isFutureDate],
  );

  const tileClassName = useCallback(
    ({ date: tileDate, view }: { date: Date; view: string }) => {
      if (view !== 'month') return null;

      const classes = [];
      const tileDateStr = getLocalDateString(tileDate);

      // 미래 날짜 스타일
      if (isFutureDate(tileDate)) {
        classes.push('future-date');
      }

      // 선택된 날짜 스타일
      if (date && getLocalDateString(tileDate) === getLocalDateString(date)) {
        classes.push('selected-date');
      }

      // 일기 작성 여부에 따른 스타일 추가
      if (tileDateStr <= todayStr) {
        const hasEntry = entries.some((e) => {
          const entryDate = new Date(e.created_at);
          const entryDateStr = getLocalDateString(entryDate);
          return entryDateStr === tileDateStr;
        });

        classes.push(hasEntry ? 'has-diary-entry' : 'no-diary-entry');
      }

      return classes.length > 0 ? classes.join(' ') : null;
    },
    [isFutureDate, date, getLocalDateString, entries, todayStr],
  );

  const getTileContent = useCallback(
    ({ date: tileDate, view }: { date: Date; view: string }) => {
      if (view !== 'month') return null;

      const tileDateStr = getLocalDateString(tileDate);

      // 미래 날짜는 아이콘 표시하지 않음
      if (tileDateStr > todayStr) return null;

      const hasEntry = entries.some((e) => {
        const entryDate = new Date(e.created_at);
        const entryDateStr = getLocalDateString(entryDate);
        return entryDateStr === tileDateStr;
      });

      return (
        <div className="icon-bg" aria-hidden="true">
          <img
            src={hasEntry ? DiaryCompleted : DiaryEmpty}
            alt={hasEntry ? '일기 작성' : '일기 미작성'}
          />
        </div>
      );
    },
    [entries, todayStr, getLocalDateString],
  );

  return (
    <>
      <figure>
        <img src={CalendarImg} alt="" />
        <figcaption className="sr-only"></figcaption>
      </figure>
      <Calendar
        locale="en"
        next2Label={null}
        prev2Label={null}
        minDetail="year"
        calendarType="gregory"
        tileContent={getTileContent}
        tileDisabled={tileDisabled}
        tileClassName={tileClassName}
        value={date || new Date()}
        onClickDay={handleDateClick}
      />
    </>
  );
};

export default DiaryCalendar;
