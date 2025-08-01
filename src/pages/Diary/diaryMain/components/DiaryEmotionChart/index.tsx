import S from './style.module.css';
import { useRef, useEffect, useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  type TooltipItem,
  type Plugin,
} from 'chart.js';
import Spinner from '@/shared/components/Spinner';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title);

interface Props {
  data: number[];
  emotionLabels: string[];
  emotionImages: string[];
}

const DiaryEmotionChart = ({ data, emotionLabels, emotionImages }: Props) => {
  const chartRef = useRef<ChartJS<'bar'>>(null);
  const [loadedEmotionImages, setLoadedEmotionImages] = useState<HTMLImageElement[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTablet, setIsTablet] = useState(false);

  // 화면 크기 감지
  useEffect(() => {
    const checkIsTablet = () => {
      setIsTablet(window.innerWidth < 980);
    };
    checkIsTablet();
    window.addEventListener('resize', checkIsTablet);
    return () => window.removeEventListener('resize', checkIsTablet);
  }, []);

  useEffect(() => {
    const loadImages = async () => {
      if (emotionImages.length === 0) {
        setLoadedEmotionImages([]);
        setIsInitialLoading(false);
        return;
      }
      const images: HTMLImageElement[] = [];
      for (const src of emotionImages) {
        const img = new Image();
        img.src = src;
        try {
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error(`이미지 로드 실패: ${src}`));
          });
          images.push(img);
        } catch (error) {
          console.error(error);
        }
      }
      setLoadedEmotionImages(images);
      setIsInitialLoading(false);
    };
    loadImages();
  }, [emotionImages]);

  const chartData = {
    labels: emotionLabels,
    datasets: [
      {
        label: '감정',
        data: data,
        backgroundColor: '#A7C584',
        barThickness: isTablet ? 20 : 30,
        borderRadius: isTablet ? 4 : 8,
        hoverBackgroundColor: '#6b8a47',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<'bar'>) {
            return context.parsed.y + '%';
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
        afterFit: function (scale: any) {
          scale.height = isTablet ? 45 : 60;
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
          callback: function (value: string | number, index: number) {
            if (value === 0 && index === 0) return value + '%';
            return value;
          },
        },
      },
    },
  };

  const imagePlugin = useMemo<Plugin<'bar'>>(
    () => ({
      id: 'xImageLabel',
      afterDraw: (chart) => {
        const { ctx, chartArea, scales } = chart;
        if (loadedEmotionImages.length === 0) return;
        if (loadedEmotionImages.length === emotionLabels.length) {
          for (let idx = 0; idx < emotionLabels.length; idx++) {
            const x = scales.x.getPixelForTick(idx);
            const y = chartArea.bottom + 10;
            if (loadedEmotionImages[idx]) {
              if (isTablet) {
                ctx.drawImage(loadedEmotionImages[idx], x - 15, y, 30, 34);
              } else {
                ctx.drawImage(loadedEmotionImages[idx], x - 21, y, 40, 46);
              }
            }
          }
        }
      },
    }),
    [isTablet, loadedEmotionImages, emotionLabels],
  );

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update('none');
    }
  }, [isTablet, loadedEmotionImages, emotionLabels, data]);

  if (isInitialLoading && emotionImages.length > 0) {
    return (
      <div className={S.spinner_wrap}>
        <Spinner />
      </div>
    );
  }

  if (emotionImages.length === 0) {
    setLoadedEmotionImages([]);
    setIsInitialLoading(false);
    return null;
  }

  return (
    <div>
      <Bar
        key={isTablet ? 'tablet' : 'desktop'}
        ref={chartRef}
        data={chartData}
        options={chartOptions}
        plugins={[imagePlugin]}
      />
    </div>
  );
};

export default DiaryEmotionChart;
