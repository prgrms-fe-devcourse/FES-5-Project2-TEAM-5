import { useEffect, useState } from 'react';
import S from './style.module.css';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Props {
  value: number;
  currentPlantLevel: number;
}

const SUPABASE_STORAGE_URL =
  'https://ttqedeydfvolnyrivpvg.supabase.co/storage/v1/object/public/assets';

const plantLevels = [
  { threshold: 0, imageUrl: `${SUPABASE_STORAGE_URL}/plant_grow_level1.svg` }, // 0% ~ 29%
  { threshold: 30, imageUrl: `${SUPABASE_STORAGE_URL}/plant_grow_level2.svg` }, // 30% ~ 59%
  { threshold: 60, imageUrl: `${SUPABASE_STORAGE_URL}/plant_grow_level3.svg` }, // 60% ~ 89%
  { threshold: 90, imageUrl: `${SUPABASE_STORAGE_URL}/plant_grow_level4.svg` }, // 90% 이상
];

const DiaryPlant = ({ value }: Props) => {
  const getPlantImage = () => {
    for (let i = plantLevels.length - 1; i >= 0; i--) {
      if (value >= plantLevels[i].threshold) {
        return plantLevels[i].imageUrl;
      }
    }
    return plantLevels[0].imageUrl; // 기본값
  };

  const currentPlantImage = getPlantImage();
  const [displayedValue, setDisplayedValue] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: DOMHighResTimeStamp) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const nextValue = Math.round(progress * value);
      setDisplayedValue(nextValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return (
    <div className={S.plantWrap}>
      <CircularProgressbarWithChildren
        value={displayedValue}
        styles={buildStyles({
          rotation: 0,
          strokeLinecap: 'round',
          pathTransitionDuration: 0.5,
          pathColor: `#F6C915`,
          trailColor: '#EAE3C0',
          backgroundColor: '#F6C915',
        })}
      >
        <img src={currentPlantImage} alt="감정 식물 성장" />
        <strong className={S.percent}>{displayedValue}%</strong>{' '}
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default DiaryPlant;
