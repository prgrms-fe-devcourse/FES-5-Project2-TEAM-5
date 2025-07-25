import { useId, useRef } from 'react';
import S from './style.module.css';
import defaultProfile from '../../assets/defaultProfile.svg';

const ChangeUserInfo = () => {
  const profileId = useId();
  const profileRef = useRef<HTMLInputElement | null>(null);

  const handleProfileClick = (e: React.PointerEvent<HTMLLabelElement>) => {
    e.preventDefault();
    profileRef?.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      profileRef?.current?.click();
    }
  };

  return (
    <section className={S.contents}>
      <h2 className="sr-only">정보 변경</h2>
      <div className={S.profileSection}>
        <label
          className={S.profileImage}
          role="button"
          tabIndex={0}
          id={profileId}
          onPointerDown={handleProfileClick}
          onKeyDown={handleKeyDown}
        >
          <img src={defaultProfile} alt="프로필" />
        </label>
        <input ref={profileRef} type="file" name="profile" id={profileId} hidden />
        <button className={S.profileButton}>프로필 변경</button>
      </div>
      <div className={S.infoSection}>
        <label className={S.inputLabel} htmlFor="">
          닉네임
        </label>
        <div className={S.inputSection}>
          <input className={S.nicknameInput} type="text" name="" id="" placeholder="닉네임 변경" />
          <button type="button">변경</button>
        </div>
        <hr />
        <label className={S.inputLabel} htmlFor="">
          현재 비밀번호
        </label>
        <div className={S.inputSection}>
          <input
            className={S.passwordInput}
            type="password"
            name=""
            id=""
            placeholder="현재 비밀번호"
          />
        </div>
        <label className={S.inputLabel} htmlFor="">
          새 비밀번호
        </label>
        <div className={S.inputSection}>
          <input
            className={S.passwordInput}
            type="password"
            name=""
            id=""
            placeholder="새 비밀번호"
          />
        </div>
        <label className={S.inputLabel} htmlFor="">
          현재 비밀번호 확인
        </label>
        <div className={S.inputSection}>
          <input
            className={S.passwordInput}
            type="password"
            name=""
            id=""
            placeholder="새 비밀번호 확인"
          />
          <button type="button">변경</button>
        </div>
      </div>
    </section>
  );
};
export default ChangeUserInfo;
