'use client';

import { Header } from '@/components/Header/Header';
import RichText from '@/components/ui/RichText/RichText';
import { useState, useRef } from 'react';
import {
  Container,
  TextInput,
  Textarea,
  Card,
  Box,
  Text,
  Button,
  Notification,
  Image,
  rem,
  Group,
  Modal,
} from '@mantine/core';
import { IconX, IconCheck, IconUpload } from '@tabler/icons-react';
import $api from '@/components/api/axiosInstance';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { FooterLinks } from '@/components/ui/Footer/Footer';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    color: string;
    icon: React.ReactNode;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !content) {
      setNotification({ message: 'Пожалуйста, заполните все поля.', color: 'red', icon: xIcon });
      return;
    }

    if (!captchaToken) {
      setNotification({ message: 'Пожалуйста, подтвердите капчу.', color: 'red', icon: xIcon });
      return;
    }

    setLoading(true);

    try {
      const storedUser = localStorage.getItem('user');

      if (storedUser) {
        const user = JSON.parse(storedUser);

        const response = await $api.post('/article/requests', {
          title,
          description,
          content,
          coverImage,
          captchaToken,
          userId: user._id,
        });

        setNotification({
          message: response.data.message || 'Статья успешно отправлена!',
          color: 'teal',
          icon: checkIcon,
        });
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();

        // Открываем модальное окно после успешной отправки
        setIsModalOpen(true);
      } else {
        setNotification({ message: 'Пользователь не найден.', color: 'red', icon: xIcon });
      }
    } catch (error) {
      console.error('Ошибка при отправке статьи:', error);
      setNotification({ message: 'Ошибка при отправке статьи.', color: 'red', icon: xIcon });
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCaptchaVerification = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <>
      <head>
        <title>Создать статью | Parfumetrika</title>
        <meta name="description" content="Создать статью,Parfumetrika" />
      </head>
      <Header />
      <Container fluid maw="1440px" style={{ margin: '60px auto 0 auto' }} mt="20">
        {/* Notification */}
        {notification && (
          <Notification
            icon={notification.icon}
            color={notification.color}
            title={notification.color === 'red' ? 'Ошибка' : 'Успех'}
            mb="lg"
            radius="14"
          >
            {notification.message}
          </Notification>
        )}

        {/* Card wraps the content */}
        <Card shadow="sm" padding="lg" radius="16">
          <Box mb="lg">
            <Text size="lg" weight={500} mb="md">
              Создать Новую Статью
            </Text>

            <TextInput
              label="Заголовок"
              placeholder="Введите заголовок"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
              mb="md"
            />

            <Textarea
              label="Описание"
              placeholder="Введите описание статьи"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              required
              mb="md"
              minRows={3}
            />

            {/* Загрузка обложки */}
            <Text size="sm" mb="xs">
              Обложка статьи
            </Text>
            <Button
              variant="outline"
              leftSection={<IconUpload size={16} />}
              onClick={handleButtonClick}
              radius="md"
              fullWidth
              mb="md"
            >
              Загрузить обложку
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />

            {coverImage && (
              <Group position="center">
                <Image
                  src={coverImage}
                  alt="Обложка статьи"
                  radius="md"
                  height={200}
                  width={320}
                  fit="cover"
                  mb="md"
                />
              </Group>
            )}
          </Box>

          <Text style={{ fontSize: '14px', fontWeight: 500 }} mb="xs">
            Статья
          </Text>
          <RichText setContent={setContent} />
          <Group mb="lg" mt="20">
            <HCaptcha
              sitekey="c4923d66-7fe4-436e-bf08-068675b075d4"
              onVerify={handleCaptchaVerification}
              ref={captchaRef}
            />
          </Group>
          <Button
            fullWidth
            mt="md"
            radius="md"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading || !captchaToken}
          >
            Отправить статью
          </Button>
        </Card>

        {/* Modal window for success message */}
        <Modal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Статья успешно отправлена!"
          centered
          radius="md"
          padding="lg"
        >
          <Text align="center" color="teal" size="md" mb="lg">
            Ваша статья была успешно отправлена и будет рассмотрена в ближайшее время.
          </Text>
          <Button
            onClick={() => {
              setIsModalOpen(false);
              router.push('/');
            }}
            fullWidth
            radius="md"
          >
            Понятно
          </Button>
        </Modal>
      </Container>
      <FooterLinks />
    </>
  );
}
