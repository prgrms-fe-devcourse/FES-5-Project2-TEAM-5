import S from './style.module.css';
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
  type TooltipItem,
  Scale,
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
        ticks: {
          display: false,
        },
        afterFit: function (scale: Scale) {
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
          callback: function (value: string | number, index: number) {
            if (value === 0 && index === 0) {
              return value + '%';
            }
            return value;
          },
        },
      },
    },
  };

  const imagePlugin: Plugin<'bar'> = {
    id: 'xImageLabel',
    afterDraw: (chart: ChartJS<'bar'>) => {
      const { ctx, chartArea, scales } = chart;

      if (loadedEmotionImages.length === 0) return;

      if (loadedEmotionImages.length === emotionLabels.length) {
        scales.x.ticks.forEach((_, idx: number) => {
          const x = scales.x.getPixelForTick(idx);
          const y = chartArea.bottom + 10;
          if (loadedEmotionImages[idx]) {
            ctx.drawImage(loadedEmotionImages[idx], x - 21, y, 40, 46);
          }
        });
      }
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update();
    }
  }, [data, emotionLabels, loadedEmotionImages]);

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
    return;
  }

  return (
    <div style={{ width: '100%', height: '50%' }}>
      <Bar ref={chartRef} data={chartData} options={chartOptions} plugins={[imagePlugin]} />
    </div>
  );
};

export default DiaryEmotionChart;
