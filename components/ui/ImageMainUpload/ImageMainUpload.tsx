import { useState, useRef, useEffect } from 'react';
import { Modal, Button, Group, Image, Stack, Text } from '@mantine/core';
import $api from '@/components/api/axiosInstance';
import HCaptcha from '@hcaptcha/react-hcaptcha'; // Импорт HCaptcha

interface UploadPhotoModalProps {
  opened: boolean;
  onClose: () => void;
  onUpload: (base64Image: string) => void;
  perfumeId: string; // Добавим поле для передачи ID парфюма
}

const ImageMainUploadModal: React.FC<UploadPhotoModalProps> = ({
  opened,
  onClose,
  onUpload,
  perfumeId,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // ref для file input
  const [uploading, setUploading] = useState(false); // Состояние загрузки
  const [captchaToken, setCaptchaToken] = useState<string | null>(null); // Состояние для hCaptcha токена
  const [userId, setUserId] = useState<string | null>(null); // Состояние для userId

  // Извлекаем userId из localStorage при загрузке компонента
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser._id); // Предполагаем, что ID пользователя хранится в поле id
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string); // Base64 image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    if (userId) {
      // Проверяем наличие изображения, капчи и userId

      try {
        // Отправляем POST-запрос на сервер с изображением, ID парфюма, userId и токеном капчи
        await $api.post('main-image/requests', {
          perfumeId,
          userId, // Передаем ID пользователя
          image: selectedImage, // Массив base64 изображений
          captchaToken, // Добавляем токен капчи
        });

        onUpload(selectedImage); // Вызываем callback
        onClose(); // Закрыть модальное окно после загрузки
      } catch (error) {
        console.error('Ошибка при загрузке изображения', error);
      } finally {
        setUploading(false); // Окончание загрузки
      }
    } else {
      console.log('Пожалуйста, подтвердите капчу');
    }
  };

  const handleCaptchaVerification = (token: string | null) => {
    setCaptchaToken(token); // Сохраняем токен капчи
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Открыть диалоговое окно для выбора файла
    }
  };

  return (
    <Modal radius="16" opened={opened} onClose={onClose} title="Загрузить фото">
      <Stack>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }} // Скрыть стандартный input
        />
        <Button radius="9" onClick={handleClick} loading={uploading}>
          Выбрать файл
        </Button>
        {selectedImage && (
          <Image
            src={selectedImage}
            alt="Выбранное изображение"
            width={200}
            height={200}
            radius="md"
          />
        )}

        {/* hCaptcha компонент */}
        <HCaptcha
          sitekey="c4923d66-7fe4-436e-bf08-068675b075d4" // Замените на ваш сайт-ключ
          onVerify={handleCaptchaVerification} // Функция для обработки верификации
        />

        <Group justify="end">
          <Button
            radius="9"
            onClick={handleUpload}
            disabled={!selectedImage || !userId || uploading}
          >
            {uploading ? 'Загрузка...' : 'Отправить'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ImageMainUploadModal;
