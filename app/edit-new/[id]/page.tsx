'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
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
} from '@mantine/core';
import { IconX, IconCheck, IconUpload } from '@tabler/icons-react';
import $api from '@/components/api/axiosInstance';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import RichText from '@/components/ui/RichText/RichText';
import { Header } from '@/components/Header/Header';
import { FooterLinks } from '@/components/ui/Footer/Footer';

export default function EditArticle() {
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const { id } = useParams();

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  useEffect(() => {
    const fetchArticleData = async () => {
      if (id) {
        try {
          const response = await $api.get(`/news/requests/id/${id}`);
          const { title, description, content, coverImage } = response.data;
          setTitle(title);
          setDescription(description);
          setContent(content);
          setCoverImage(coverImage);
        } catch (error) {
          console.error('Ошибка при получении статьи:', error);
        }
      }
    };

    fetchArticleData();
  }, [id]);

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

        const response = await $api.put(`/news/requests/${id}`, {
          title,
          description,
          content,
          coverImage,
          captchaToken,
          userId: user._id,
        });

        setNotification({
          message: response.data.message || 'Статья успешно обновлена!',
          color: 'teal',
          icon: checkIcon,
        });
        setCaptchaToken(null);
        captchaRef.current?.resetCaptcha();
      } else {
        setNotification({ message: 'Пользователь не найден.', color: 'red', icon: xIcon });
      }
    } catch (error) {
      console.error('Ошибка при обновлении статьи:', error);
      setNotification({ message: 'Ошибка при обновлении статьи.', color: 'red', icon: xIcon });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container fluid maw="1440px" style={{ margin: '60px auto 0 auto' }} mt="20">
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

        <Card shadow="sm" padding="lg" radius="16">
          <Box mb="lg">
            <Text size="lg" weight={500} mb="md">
              Редактировать статью
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

            <Text size="sm" mb="xs">
              Обложка статьи
            </Text>
            <Button
              variant="outline"
              leftSection={<IconUpload size={16} />}
              onClick={() => fileInputRef.current?.click()}
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
                  src={`https://hltback.parfumetrika.ru${coverImage || '/images/placeholder.jpg'}`}
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
          <RichText setContent={setContent} initialContent={content} />

          <Group mb="lg" mt="20">
            <HCaptcha
              sitekey="c4923d66-7fe4-436e-bf08-068675b075d4"
              onVerify={(token) => setCaptchaToken(token)}
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
            Обновить статью
          </Button>
        </Card>
      </Container>
      <FooterLinks />
    </>
  );
}
