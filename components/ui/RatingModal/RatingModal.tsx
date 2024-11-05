import { useState } from 'react';
import { Modal, Button, Stack, Group, Rating, Text, Box, Alert } from '@mantine/core';
import {
  IconPerfume,
  IconClock,
  IconWind,
  IconBottle,
  IconCash,
  IconPackage,
  IconAlertCircle,
} from '@tabler/icons-react';
import $api from '@/components/api/axiosInstance';

interface RatingModalProps {
  opened: boolean;
  onClose: () => void;
  perfumeId: string;
  onRate: (ratings: Ratings) => void;
}

interface Ratings {
  smell: number;
  longevity: number;
  sillage: number;
  bottle: number;
  priceValue: number;
}

const RatingModal: React.FC<RatingModalProps> = ({ opened, onClose, perfumeId, onRate }) => {
  const [smellRating, setSmellRating] = useState(0);
  const [longevityRating, setLongevityRating] = useState(0);
  const [sillageRating, setSillageRating] = useState(0);
  const [bottleRating, setBottleRating] = useState(0);
  const [priceValueRating, setPriceValueRating] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    const storedUser = localStorage.getItem('user');
    const userId = storedUser ? JSON.parse(storedUser)._id : null;

    if (!userId) {
      alert('Не удалось найти пользователя');
      return;
    }

    const ratings: Ratings & { userId: string } = {
      smell: smellRating,
      longevity: longevityRating,
      sillage: sillageRating,
      bottle: bottleRating,
      priceValue: priceValueRating,
      userId,
    };

    try {
      const response = await $api.post(`/perfumes/perfumes/${perfumeId}/rating`, ratings);
      onRate(ratings); // Вызываем onRate с переданными оценками
      onClose(); // Закрываем модальное окно
    } catch (error: any) {
      if (error.response?.data?.message === 'Вы уже оценили этот парфюм') {
        setErrorMessage('Вы уже оценили этот парфюм');
      } else {
        setErrorMessage(error.response?.data?.message || 'Ошибка при отправке оценки');
      }
    }
  };

  const renderIconInCircle = (IconComponent: any, color: string) => (
    <Box
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IconComponent size={24} color="white" />
    </Box>
  );

  return (
    <Modal radius={16} opened={opened} onClose={onClose} title="Оценить парфюм">
      <Stack>
        {errorMessage && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Ошибка"
            color="red"
            withCloseButton
            onClose={() => setErrorMessage(null)}
          >
            {errorMessage}
          </Alert>
        )}

        <Group>
          {renderIconInCircle(IconPerfume, '#FF6B6B')}
          <Text>Запах</Text>
          <Rating value={smellRating} onChange={setSmellRating} />
        </Group>

        <Group>
          {renderIconInCircle(IconClock, '#1E90FF')}
          <Text>Стойкость</Text>
          <Rating value={longevityRating} onChange={setLongevityRating} />
        </Group>

        <Group>
          {renderIconInCircle(IconWind, '#48C774')}
          <Text>Шлейф</Text>
          <Rating value={sillageRating} onChange={setSillageRating} />
        </Group>

        <Group>
          {renderIconInCircle(IconPackage, '#FFD700')}
          <Text>Упаковка</Text>
          <Rating value={bottleRating} onChange={setBottleRating} />
        </Group>

        <Group>
          {renderIconInCircle(IconCash, '#FF8C00')}
          <Text>Цена и качество</Text>
          <Rating value={priceValueRating} onChange={setPriceValueRating} />
        </Group>

        <Group w="100%" mt="md" justify="center">
          <Button w="100%" radius={9} onClick={handleSubmit}>
            Отправить
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default RatingModal;
