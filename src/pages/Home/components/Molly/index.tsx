import { useRive } from '@rive-app/react-canvas';
import { memo } from 'react';

const Molly = () => {
  const { RiveComponent } = useRive({
    src: '/home/molly.riv',
    stateMachines: 'State Machine 1',
    autoplay: true,
  });

  return (
    <div style={{ width: '500px', height: '500px', paddingTop: '50px' }}>
      <RiveComponent />
    </div>
  );
};
export default memo(Molly);
