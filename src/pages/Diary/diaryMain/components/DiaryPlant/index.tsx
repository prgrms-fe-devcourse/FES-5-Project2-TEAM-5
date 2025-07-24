import { useEffect, useState } from 'react';
import S from './style.module.css';
import { buildStyles, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlantLevel01 from '../../../assets/plant_grow_level1.svg';

interface Props {
  target: number;
}

function DiaryPlant({ target }: Props) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      setValue((prev) => {
        if (prev < target) {
          const next = Math.min(prev + 1, target);
          if (next !== target) animationFrame = requestAnimationFrame(animate);
          return next;
        } else if (prev > target) {
          const next = Math.max(prev - 1, target);
          if (next !== target) animationFrame = requestAnimationFrame(animate);
          return next;
        }
        return prev;
      });
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target]);

  return (
    <div className={S.plantWrap}>
      <CircularProgressbarWithChildren
        value={value}
        styles={buildStyles({
          rotation: 0,
          strokeLinecap: 'round',
          pathTransitionDuration: 0.5,
          pathColor: `#F6C915`,
          trailColor: '#EAE3C0',
          backgroundColor: '#F6C915',
        })}
      >
        <img src={PlantLevel01} alt="감정 식물 성장" />
        <strong className={S.percent}>{value}%</strong>
      </CircularProgressbarWithChildren>
    </div>
  );
}

export default DiaryPlant;
