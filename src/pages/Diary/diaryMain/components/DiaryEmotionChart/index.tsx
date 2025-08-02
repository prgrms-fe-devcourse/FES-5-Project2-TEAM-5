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

  const prevDataRef = useRef(data);
  const prevLabelsRef = useRef(emotionLabels);

  // 화면 크기 감지
  useEffect(() => {
    const checkIsTablet = () => {
      setIsTablet(window.innerWidth < 980);
    };
    checkIsTablet();
    window.addEventListener('resize', checkIsTablet);
    return () => window.removeEventListener('resize', checkIsTablet);
  }, []);

  // 데이터 변경 감지
  const isDataChanged =
    JSON.stringify(prevDataRef.current) !== JSON.stringify(data) ||
    JSON.stringify(prevLabelsRef.current) !== JSON.stringify(emotionLabels);

  // 이전 값 업데이트
  useEffect(() => {
    prevDataRef.current = data;
    prevLabelsRef.current = emotionLabels;
  }, [data, emotionLabels]);

  useEffect(() => {
    const loadImages = async () => {
      if (emotionImages.length === 0) {
        setLoadedEmotionImages([]);
        setIsInitialLoading(false);
        return;
      }

      try {
        // 병렬로 모든 이미지 로딩
        const imagePromises = emotionImages.map((src) => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`이미지 로드 실패: ${src}`));
            img.src = src;
          });
        });

        const loadedImages = await Promise.all(imagePromises);
        setLoadedEmotionImages(loadedImages);
      } catch (error) {
        console.error('이미지 로딩 실패:', error);
        setLoadedEmotionImages([]);
      } finally {
        setIsInitialLoading(false);
      }
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
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
    transitions: {
      active: {
        animation: {
          duration: 400,
        },
      },
    },
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
      chartRef.current.update('active');
    }
  }, [isTablet, data, emotionLabels]);

  useEffect(() => {
    if (chartRef.current && loadedEmotionImages.length > 0) {
      chartRef.current.update('none');
    }
  }, [loadedEmotionImages]);

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

  // 반응형 변경인지 데이터 변경인지 구분
  const shouldUseKey = !isDataChanged;

  return (
    <div>
      <Bar
        key={shouldUseKey ? (isTablet ? 'tablet' : 'desktop') : undefined}
        ref={chartRef}
        data={chartData}
        options={chartOptions}
        plugins={[imagePlugin]}
      />
    </div>
  );
};

export default DiaryEmotionChart;
