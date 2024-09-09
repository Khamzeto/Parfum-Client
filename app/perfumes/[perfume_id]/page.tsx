'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Flex,
  Text,
  Box,
  Group,
  Image,
  Badge,
  Title,
  Paper,
  Rating,
  Stack,
  Divider,
  Button,
  Avatar,
  useMantineTheme,
} from '@mantine/core';
import $api from '@/components/api/axiosInstance';
import { Header } from '@/components/Header/Header';
import { IconMars, IconVenus, IconGenderBigender } from '@tabler/icons-react';


import { Textarea, TextInput } from '@mantine/core';

const PerfumeDetailsPage = () => {            
  const { perfume_id } = useParams();
  const [perfume, setPerfume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularPerfumes, setPopularPerfumes] = useState([]);
  const [reviewsToShow, setReviewsToShow] = useState(4); // Начальное количество отзывов
  const [newReview, setNewReview] = useState(''); // состояние для нового отзыва
  const [newUsername, setNewUsername] = useState(''); // состояние для имени пользователя
                                                     
  const theme = useMantineTheme();                  

  useEffect(() => {
    if (perfume_id) {
      fetchPerfumeDetails(perfume_id);
    }
  }, [perfume_id]);

  const getGenderIcon = (gender) => {
    switch (gender.toLowerCase()) {
      case 'male':
        return <IconMars size={30} color={theme.colors.blue[6]} style={{ verticalAlign: 'middle', marginLeft: 4 }} />;
      case 'female':
        return <IconVenus size={30} color={theme.colors.pink[6]} style={{ verticalAlign: 'middle', marginLeft: 4 }} />;
      case 'unisex':
        return <IconGenderBigender size={30} color={theme.colors.green[6]} style={{ verticalAlign: 'middle', marginLeft: 4 }} />;
      default:
        return null;
    }
  };

  const fetchPerfumeDetails = async (id) => {
    setLoading(true);
    try {
      const response = await $api.get(`/perfumes/${id}`);
      setPerfume(response.data);

      if (response.data?.brand) {
        fetchPopularPerfumes(response.data.brand);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch perfume data');
    } finally {
      setLoading(false);
    }
  };                                         

  const fetchPopularPerfumes = async (brandSlug) => {
    try {
      const response = await $api.get(`/brands/perfumes?slug=${brandSlug}`);
      setPopularPerfumes(response.data.perfumes || []);
    } catch (err) {
      console.error('Failed to fetch popular perfumes', err);
    }
  };

  const handleShowMoreReviews = () => {
    setReviewsToShow((prevCount) => prevCount + 4); // Увеличиваем количество видимых отзывов на 4
  };

  const handleSubmitReview = () => {
    if (newUsername && newReview) {
      const newReviewObj = {
        username: newUsername,
        nickname: newUsername.toLowerCase(), // Допустим, никнейм будет таким же как и имя пользователя
        body: newReview,
        awards: 0,
        comments: 0,
      };

      // Добавляем новый отзыв в список отзывов
      setPerfume((prevState) => ({
        ...prevState,
        reviews: [newReviewObj, ...prevState.reviews],
      }));

      // Очищаем поля после добавления
      setNewReview('');
      setNewUsername('');
    }
  };

  if (error) return <Text color="red">{error}</Text>;
  if (loading) return <Text>Loading...</Text>;
  if (!perfume) return null;

  const renderNotes = (notes, title) => (
    <div>
      <Text weight={500} mb="20">{title}</Text>
      <Group spacing="" mb='30'>
        {notes.map((note, index) => (
          <Box
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: 'center',
            }}
          >
            <Avatar
              src='https://img.parfumo.de/notes/6e/6e_ea3972f0972c9d58b2661c05224d457fcd95aebc_320.jpg'
              radius="xl"
              size="24px"
            />
            <Text
              size="14px"
              style={{
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              {note}
            </Text>
          </Box>
        ))}
      </Group>
    </div>
  );

  return (
    <>
      <Header />
      <Container style={{ marginTop: '40px', width: '100%', maxWidth: '1120px' }}>
        <Flex direction={{ customBreakpoint: 'row', base: 'column' }} gap="40" align="flex-start">
          <Stack style={{ flex: 1 }}>
            {/* Perfume Details */}
            <Box className="perfume-info">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Title 
              size='30px' 
              pr='6' // Предотвращаем сжатие заголовка
            >
              {perfume?.name}
            </Title>
            {getGenderIcon(perfume?.gender)}
          </div>

              <Text color="dimmed" style={{ whiteSpace: 'pre-wrap' }}>
                <Text component="span" weight={500}>{perfume?.brand}</Text> • {perfume?.release_year} •{' '}
              </Text>

              <Group spacing="xs" align="center"  mt='2' mb='-22' >
                <Rating value={perfume?.rating_value / 2} readOnly />
                <Text size="sm">{perfume?.rating_value} / 10</Text>
                <Text size="xs" color="dimmed">
                  ({perfume?.rating_count} оценок)
                </Text>
              </Group>
            </Box>

            {/* Main Image and Buttons */}
            <Image
              src='https://pimages.parfumo.de/720/74_img-1003-gucci-gucci_pour_homme_ii_eau_de_toilette_720.webp'
              alt={perfume?.name}
              radius="md"
              style={{ width: '100%', marginBottom: '10px' }}
            />
            <Group mt="2" mb='2' style={{display: 'flex',justifyContent: 'center',flexWrap: 'nowrap'}} >
  <Button 
    radius="8" 

    style={{

      color: 'white',
      width: '100%',
      fontWeight: 600,
      fontSize: '14px'
    }}
  >
    Я хочу
  </Button>
  <Button 
    radius="8" 


    style={{
      backgroundColor: theme.colors.green[6], 
      color: 'white',
      width: '100%',
      fontWeight: 600,
      fontSize: '14px'
    }}
  >
    У меня есть
  </Button>
</Group>

            {/* Description for desktop */}
            <Text  className="description-desktop"  mt="8" mb="6"   style={{
            fontSize: '14px', // Уменьшение размера текста
            lineHeight: '1.4', // Можно добавить высоту строки для улучшения читаемости
          }}>
              {perfume?.description}
            </Text>
            

            {/* Popular Perfumes */}
            <Title order={3} mb="sm" className="popular-perfumes-desktop">Популярные ароматы</Title>
            <Flex wrap="wrap" gap="md" mb='14' justify="flex-start" className="popular-perfumes-desktop">
              {popularPerfumes.slice(0, 8).map((perfume) => (
                <div 
                  key={perfume.id} 
                  style={{ 
                    width: '90px', 
                    display: 'flex', 
                    justifyContent: 'start', 
                    alignItems: 'center', 
                    backgroundColor: 'white',
                    padding: '10px',
                    borderRadius: '12px'
                  }}
                >
                  <Image
                    src='https://pimages.parfumo.de/13889_img-2650-dior-christian-dior-dior-homme-intense-2011.webp'
                    radius="md"
                    height={80}
                    alt={`Similar perfume ${perfume.name}`}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </div>
              ))}
            </Flex>

            {/* Description for mobile */}
          
          </Stack>

          {/* Perfume Information and Accords */}
          <Stack spacing="md" style={{ flex: 2,width: '100%' }}>
            <div className='perfume-info-desk'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Title order={1} pr='6'>{perfume?.name}</Title>
                {getGenderIcon(perfume?.gender)}
              </div>
              <Text color="dimmed" mt='6' style={{ whiteSpace: 'pre-wrap' }}>
                <Text component="span" weight={500}>{perfume?.brand}</Text> • {perfume?.release_year} •{' '}
              </Text>

              <Group spacing="0" mt='10' align="center">
                <Rating value={perfume?.rating_value / 2} readOnly />
                <Text size="sm">{perfume?.rating_value} / 10</Text>
                <Text size="xs" mt='' color="dimmed">
                  ({perfume?.rating_count} оценок)
                </Text>
              </Group>
            </div>

            <Stack spacing="xs" mt="8" className='accords' mb="20">
  <Text weight={500}>Основные аккорды:</Text>
  
  {perfume?.accords?.length > 0 ? (
    <Group spacing="4">
      {perfume.accords.map((accord, index) => (
        <Box 
          key={index} 
          style={{
            backgroundColor: theme.colors.teal[2], 
            borderRadius: '12px', 
            padding: '4px 12px',
            fontSize: '14px',
            color: theme.colors.teal[7],
          }}
        >
          {accord}
        </Box>
      ))}
    </Group>
  ) : (
    <>
    <Text style={{fontSize: '14px', color: theme.colors.gray[5]}}>
      Информация отсутствует, хотите <Text
        component="a"
        href="#"
        style={{fontSize: '14px'}}
        color="blue"
      >
        добавить?
      </Text>
    </Text>
    <Divider/>
    </>
  )}
</Stack>


            {/* Notes Section */}
           {/* Notes Section */}
           <div>
  {perfume?.notes?.top_notes?.length > 0 ? (
    renderNotes(perfume?.notes.top_notes, 'Верхние ноты')
  ) : null}
  
  {perfume?.notes?.heart_notes?.length > 0 ? (
    renderNotes(perfume?.notes.heart_notes, 'Средние ноты')
  ) : null}
  
  {perfume?.notes?.base_notes?.length > 0 ? (
    renderNotes(perfume?.notes.base_notes, 'Базовые ноты')
  ) : null}

  {!perfume?.notes?.top_notes?.length && 
   !perfume?.notes?.heart_notes?.length && 
   !perfume?.notes?.base_notes?.length && (
    <>
         <Text weight={500} mb="20">Основные ноты</Text>
      <Text style={{fontSize: '14px', color: theme.colors.gray[5]}}>
        Информация отсутствует, хотите   <Text
          component="a"
          href="#"
          style={{fontSize: '14px'}}
          color="blue"
        >
           добавить? 
        </Text>
      </Text>
    </>
  )}
</div>


{/* Перфюмеры Section */}
<Divider />
<Text weight={500} mt="2px">Парфюмеры:</Text>
<Group spacing="xs" mb="20" wrap="wrap">
  {perfume?.perfumers?.length > 0 ? (
    perfume?.perfumers.map((perfumer, index) => (
      <Box 
        key={index} 
        style={{
          backgroundColor: theme.colors.blue[2], 
          borderRadius: '12px', 
          padding: '4px 12px',
          fontSize: '14px',
          color: 'black'
        }}
      >
        {perfumer}
      </Box>
    ))
  ) : (
    <Text
      style={{fontSize: '14px',color: theme.colors.gray[5 ]}}
    >
      Информация отсутствует, хотите     <Text
      component="a"
      href="#"
      style={{fontSize: '14px'}}
      color="blue"
    >добавить?</Text> 
    </Text>
  )}
</Group>




            {/* Tags Section */}
            <Divider />
            <Text weight={500} mt="2px">Ассоциации:</Text>
            <Group spacing="xs" mb="20" wrap="wrap">
              {perfume?.tags.map((tag, index) => (
                <Box 
                  key={index} 
                  style={{
                    backgroundColor: theme.colors.gray[2], 
                    borderRadius: '12px', 
                    padding: '4px 8px',
                    fontSize: '12px',
                    color: 'black'
                  }}
                >
                  {tag}
                </Box>
              ))}
            </Group>

            {/* Reviews Section */}
            <Divider />
            <Text weight={500}>Отзывы:</Text>
            <Stack spacing="md">
              {perfume?.reviews.slice(0, reviewsToShow).map((review, index) => (
                <Box
                  key={index}
                  p="md"
                  radius="14"
                  style={{
                    backgroundColor: 'var(--mantine-color-default-hover)',
                    borderRadius: '12px',
                  }}
                >
                  <Text weight={500}>{review.username} ({review.nickname})</Text>
                  <Text size="sm" mt="xs">{review.body}</Text>
                  <Text size="xs" color="dimmed">
                    {review.awards} награды, {review.comments} комментарии
                  </Text>
                </Box>
              ))}
              {reviewsToShow < perfume?.reviews.length && (
                <Button onClick={handleShowMoreReviews} radius='8' mb='12' variant="light">
                  Показать еще
                </Button>
              )}
            </Stack>

            {/* Review Form */}
            <Divider  />
            <Text weight={500} mt="0px">Оставить отзыв:</Text>
            <TextInput
              label="Ваше имя"
              placeholder="Введите ваше имя"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <Textarea
              label="Ваш отзыв"
              placeholder="Напишите свой отзыв"
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              mt="md"
            />
            <Button onClick={handleSubmitReview} radius='8' mb='12' mt="md">
              Отправить отзыв
            </Button>
          </Stack>
        </Flex>
      </Container>

      <style jsx>{`
        /* Styles for mobile layout */
        @media (max-width: 768px) {
          .description-desktop {
            display: none;
          }
          .description-mobile {
            display: block;
          }
          .perfume-actions {
            order: 2;
            margin-bottom: 20px;
          }

          .popular-perfumes-mobile {
            display: flex;
          }

          .popular-perfumes-desktop {
            display: none;
          }

          /* Move notes section to be displayed on top on mobile */
          .notes-mobile {
            order: -1;
          }
        }

        @media (min-width: 768px) {
          .description-mobile {
            display: none;
          }
          .popular-perfumes-mobile {
            display: none;
          }

          .popular-perfumes-desktop {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};

export default PerfumeDetailsPage;


