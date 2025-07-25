import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../../../../styles/custom.css';
import CalendarImg from '../../../assets/calendar_img.svg';

const DiaryCalender = () => {
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
      />
    </>
  );
};
export default DiaryCalender;
