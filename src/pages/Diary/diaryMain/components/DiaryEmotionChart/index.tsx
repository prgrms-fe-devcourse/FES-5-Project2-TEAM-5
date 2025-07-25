import { useRef, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);
import Emotion1 from '/src/assets/icon_joy.svg';
import Emotion2 from '/src/assets/icon_sad.svg';
import Emotion3 from '/src/assets/icon_anger.svg';
import Emotion4 from '/src/assets/icon_anxiety.svg';
import Emotion5 from '/src/assets/icon_surprise.svg';
import Emotion6 from '/src/assets/icon_peace.svg';
import Emotion7 from '/src/assets/icon_expect.svg';

const emotionImages = [Emotion1, Emotion2, Emotion3, Emotion4, Emotion5, Emotion6, Emotion7];
const emotionLabels = ['행복', '기대', '슬픔', '분노', '불안', '놀람', '평온'];

interface Props {
  data: number[];
}

function DiaryEmotionChart({ data }: Props) {
  const chartRef = useRef<any>(null);
  const [loadedEmotionImages, setLoadedEmotionImages] = useState<HTMLImageElement[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const images: HTMLImageElement[] = [];
      for (const src of emotionImages) {
        const img = new Image();
        img.src = src;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
        images.push(img);
      }
      setLoadedEmotionImages(images);
    };

    loadImages();
  }, []);

  const chartData = {
    labels: emotionLabels,
    datasets: [
      {
        label: '감정',
        data: data,
        backgroundColor: '#A7C584',
        barThickness: 30,
        borderRadius: 8,
        hoverBackgroundColor: '#6b8a47',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {},
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          display: false,
        },
        afterFit: function (scale: any) {
          scale.height = 60;
        },
      },
      y: {
        min: 0,
        max: 100,
        beginAtZero: true,
        grid: {
          borderDash: [4, 4],
          color: '#f0f0f0',
          drawBorder: true,
        },
        ticks: {
          stepSize: 25,
          font: {
            size: 14,
            family: 'Urbanist',
          },
          color: '#999999',
        },
      },
    },
  };

  // 커스텀 플러그인: x축 이미지 라벨
  const imagePlugin = {
    id: 'xImageLabel',
    afterDraw: (chart: any) => {
      const { ctx, chartArea, scales } = chart;
      if (loadedEmotionImages.length === emotionImages.length) {
        scales.x.ticks.forEach((_: any, idx: number) => {
          const x = scales.x.getPixelForTick(idx);
          const y = chartArea.bottom + 10;

          ctx.drawImage(loadedEmotionImages[idx], x - 21, y, 42, 46);
        });
      }
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '50%' }}>
      {loadedEmotionImages.length === emotionImages.length ? (
        <Bar ref={chartRef} data={chartData} options={chartOptions} plugins={[imagePlugin]} />
      ) : (
        <div>이미지 로딩 중...</div>
      )}
    </div>
  );
}

export default DiaryEmotionChart;
