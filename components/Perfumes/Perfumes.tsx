'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Flex,
  Text,
  Box,
  Group,
  Image,
  Title,
  Rating,
  Stack,
  Divider,
  Button,
  Avatar,
  useMantineTheme,
  Skeleton,
  Textarea,
  TextInput,
  AspectRatio,
  TagsInput,
  ActionIcon,
  Tooltip,
  Breadcrumbs,
  Anchor,
} from '@mantine/core';
import { slugify } from '@/utils/slugify';
import axios from 'axios'; // используем axios для запросов
import { Header } from '@/components/Header/Header';
import {
  IconMars,
  IconVenus,
  IconGenderBigender,
  IconHeart,
  IconCheck,
  IconPlus,
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandVk,
  IconBrandOkRu,
  IconBrandPinterest,
} from '@tabler/icons-react';
import { generateMetadata } from './metadata';

import InputSimiliar from '@/components/ui/inputSimiliar/inputSimiliar';

import RatingModal from '@/components/ui/RatingModal/RatingModal';
import ImageUploadModal from '@/components/ui/ImageUploadModal/ImageUploadModal';
import GallerySection from '@/components/ui/GalleryImages/GalleryImages';
import $api from '@/components/api/axiosInstance';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import debounce from 'lodash.debounce';
import { FooterLinks } from '@/components/ui/Footer/Footer';
import Link from 'next/link';
import ImageMainUploadModal from '@/components/ui/ImageMainUpload/ImageMainUpload';

dayjs.extend(relativeTime);
dayjs.locale('ru');

const PerfumeDetailsPage = () => {
  const { perfume_id } = useParams();
  const router = useRouter();
  const perfumeId = Array.isArray(perfume_id) ? perfume_id[0] : perfume_id;
  const [perfume, setPerfume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularPerfumes, setPopularPerfumes] = useState([]);
  const [reviewsToShow, setReviewsToShow] = useState(4);
  const [newReview, setNewReview] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [showAssociations, setShowAssociations] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false); // состояние: парфюм в "Я хочу"
  const [isInCollection, setIsInCollection] = useState(false); // состояние: парфюм в коллекции
  const [similarPerfumes, setSimilarPerfumes] = useState<string[]>(perfume?.similar_perfumes || []);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [editTags, setEditTags] = useState([]);

  const handleCaptchaVerification = (token: string | null) => {
    setCaptchaToken(token); // Устанавливаем токен капчи при верификации
  };
  const captchaRef = useRef<HCaptcha>(null);
  // Function to handle adding a new similar perfume
  const handleAddSimiliar = (id: string) => {
    setSimilarPerfumes((prev) => [...prev, id]);
    setIsEditing(true); // Add the new perfume ID to the list
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratingModalOpened, setRatingModalOpened] = useState(false);

  const handleRatingSubmit = (ratings) => {
    console.log('Оценки:', ratings);
    // Тут можно обработать отправку оценок на сервер
  };
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleModalOpen = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const [uploadModalOpened, setUploadModalOpened] = useState(false);
  const [uploadMainModalOpened, setMainUploadModalOpened] = useState(false);
  const handleImageUpload = (base64Image: string) => {
    console.log('Загруженное изображение в формате base64:', base64Image);
    // Здесь можно выполнить обработку загруженного изображения
  };
  // State variables for editing
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editAccords, setEditAccords] = useState([]);
  const [editPerfumers, setEditPerfumers] = useState([]);
  const [editNotes, setEditNotes] = useState({
    top_notes: [],
    heart_notes: [],
    base_notes: [],
  });

  // Data arrays for TagsInput components
  const [accordsData, setAccordsData] = useState(['React', 'Angular', 'Svelte']);
  const [perfumersData, setPerfumersData] = useState(['React', 'Angular', 'Svelte']);
  const [topNotesData, setTopNotesData] = useState(['React', 'Angular', 'Svelte']);
  const [heartNotesData, setHeartNotesData] = useState(['React', 'Angular', 'Svelte']);
  const [baseNotesData, setBaseNotesData] = useState(['React', 'Angular', 'Svelte']);

  const theme = useMantineTheme();
  useEffect(() => {
    const checkUserCollections = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = storedUser._id;

      try {
        const response = await $api.get(`/users/${userId}/collections`);
        const { wishlist, perfumeCollection } = response.data;

        // Проверка на наличие perfumeId в списках
        setIsInWishlist(wishlist.includes(perfumeId));
        setIsInCollection(perfumeCollection.includes(perfumeId));
      } catch (error) {
        console.error('Ошибка при проверке списков:', error);
      }
    };

    if (localStorage.getItem('token')) {
      checkUserCollections();
    }
  }, [perfumeId]);

  useEffect(() => {
    if (perfume && !isEditing) {
      // Initialize all editable fields with current perfume data
      setEditName(perfume.name || '');
      setEditDescription(perfume.description || '');
      setEditYear(perfume.release_year || '');
      setEditAccords(perfume.accords || []);
      setEditPerfumers(perfume.perfumers || []);
      setEditNotes(perfume.notes || { top_notes: [], heart_notes: [], base_notes: [] });
      if (perfume?.tags?.length > 0) {
        setEditTags(perfume.tags);
      }
      // Initialize data arrays for TagsInput components
      setAccordsData(perfume.accords || []);
      setPerfumersData(perfume.perfumers || []);
      setTopNotesData(perfume.notes?.top_notes || []);
      setHeartNotesData(perfume.notes?.heart_notes || []);
      setBaseNotesData(perfume.notes?.base_notes || []);
    }
  }, [perfume, isEditing]);
  useEffect(() => {
    if (perfume) {
      const viewedPerfumesKey = 'viewedPerfumes'; // ключ для хранения в localStorage
      const newPerfume = {
        id: perfume.perfume_id,
        brand: perfume.brand,
        name: perfume.name,
        image: perfume.main_image,
      };

      // Получаем уже просмотренные духи из localStorage или пустой массив
      const existingPerfumes = JSON.parse(localStorage.getItem(viewedPerfumesKey) || '[]');

      // Проверяем, есть ли текущий дух в уже просмотренных
      const isAlreadyViewed = existingPerfumes.some((item: any) => item.id === newPerfume.id);

      // Если духа ещё нет в списке, добавляем его
      if (!isAlreadyViewed) {
        const updatedPerfumes = [newPerfume, ...existingPerfumes];

        // Сохраняем только последние 10 просмотренных духов
        localStorage.setItem(viewedPerfumesKey, JSON.stringify(updatedPerfumes.slice(0, 10)));
      }
    }
  }, [perfume]); // обновление сработает каждый раз при изменении perfume

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return (
          <IconMars
            size={30}
            color={theme.colors.blue[6]}
            style={{ verticalAlign: 'middle', marginLeft: 4 }}
          />
        );
      case 'female':
        return (
          <IconVenus
            size={30}
            color={theme.colors.pink[6]}
            style={{ verticalAlign: 'middle', marginLeft: 4 }}
          />
        );
      case 'unisex':
        return (
          <IconGenderBigender
            size={30}
            color={theme.colors.green[6]}
            style={{ verticalAlign: 'middle', marginLeft: 4 }}
          />
        );
      default:
        return null;
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
  const colors = [
    theme.colors.teal[2],
    theme.colors.blue[2],
    theme.colors.green[2],
    theme.colors.orange[2],
    theme.colors.red[2],
    theme.colors.violet[2],
  ];
  const handleNoteClick = async (noteName: string) => {
    try {
      // Отправляем запрос, чтобы получить _id ноты по её name
      const response = await $api.get(`/notes/noteId/${encodeURIComponent(noteName)}`);
      const noteId = response.data.noteId;

      // Переходим на страницу ноты с полученным ID
      if (noteId) {
        router.push(`/note/${noteId}`);
      }
    } catch (error) {
      console.error('Failed to fetch note ID:', error);
    }
  };

  useEffect(() => {
    if (perfume_id) {
      fetchPerfumeDetails(perfume_id);
    }
  }, [perfume_id]);
  const jsonLdData = useMemo(() => {
    if (!perfume) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: perfume.name || 'Название парфюма',
      description: perfume.description || 'Описание парфюма',
      image: perfume.main_image || 'https://yourdomain.com/default-image.jpg',
      brand: {
        '@type': 'Brand',
        name: perfume.brand || 'Бренд парфюма',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: perfume.rating_value ? perfume.rating_value.toString() : '0',
        reviewCount: perfume.rating_count ? perfume.rating_count.toString() : '0',
      },
      review: perfume.reviews?.map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.userId?.username || review.username || 'Аноним',
        },
        datePublished: review.createdAt,
        reviewBody: review.body,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.ratingValue ? review.ratingValue.toString() : '0',
        },
      })),
    };
  }, [perfume]);

  const fetchPerfumeDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://hltback.parfumetrika.ru/perfumes/${id}`);
      setPerfume(response.data);

      const storedUser = localStorage.getItem('user');
      console.log(storedUser);
      if (storedUser) {
        const user = JSON.parse(storedUser); // Преобразуем строку в объект
        console.log(user);
      }
      if (response.data?.brand) {
        fetchPopularPerfumes(response.data.brand);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось загрузить данные о парфюме');
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistClick = async () => {
    try {
      // Получаем user из localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser._id; // Получаем ID пользователя

      if (isInWishlist) {
        // Отправляем DELETE запрос с параметром userId и perfumeId
        await axios.delete(`https://hltback.parfumetrika.ru/users/wishlist/${userId}`, {
          data: { perfumeId: perfume_id }, // передаем perfumeId в теле запроса
        });
        setIsInWishlist(false);
      } else {
        // Отправляем POST запрос с параметром userId и perfumeId
        await axios.post(`https://hltback.parfumetrika.ru/users/wishlist/${userId}`, {
          perfumeId: perfume_id,
        });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Ошибка при обновлении списка желаемого', error);
    }
  };

  const handleCollectionClick = async () => {
    try {
      // Получаем user из localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const userId = storedUser._id; // Получаем ID пользователя

      if (isInCollection) {
        // Отправляем DELETE запрос с параметром userId и perfumeId
        await axios.delete(`https://hltback.parfumetrika.ru/users/collection/${userId}`, {
          data: { perfumeId: perfume_id }, // передаем perfumeId в теле запроса
        });
        setIsInCollection(false);
      } else {
        // Отправляем POST запрос с параметром userId и perfumeId
        await axios.post(`https://hltback.parfumetrika.ru/users/collection/${userId}`, {
          perfumeId: perfume_id,
        });
        setIsInCollection(true);
      }
    } catch (error) {
      console.error('Ошибка при обновлении коллекции', error);
    }
  };

  const handleShowMoreReviews = () => {
    setReviewsToShow((prevCount) => prevCount + 4);
  };
  const [loadingReview, setLoadingReview] = useState(false);
  const handleSubmitReview = async () => {
    if (newReview) {
      try {
        setLoadingReview(true); // Начало загрузки
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser?._id;

        if (!userId) {
          setError('Пользователь не найден');
          setLoadingReview(false);
          return;
        }

        // Отправка отзыва на сервер
        await $api.post(`/perfumes/${perfumeId}/reviews`, {
          userId,
          body: newReview,
        });

        // Очистка поля отзыва после отправки
        setNewReview('');

        await fetchPerfumeDetails(perfume_id);
      } catch (error) {
        console.error('Ошибка при отправке отзыва', error);
        setError('Не удалось отправить отзыв');
      } finally {
        setLoadingReview(false);
      }
    } else {
      setError('Пожалуйста, введите текст отзыва');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setShowAssociations(false);
  };

  const handleSaveClick = async () => {
    try {
      // Combine the original and updated similar perfumes, removing duplicates
      const combinedSimilarPerfumes = Array.from(
        new Set([
          ...(perfume.similar_perfumes || []), // если null, заменяем на пустой массив
          ...similarPerfumes, // new perfumes added via the InputSimiliar
        ])
      );

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = storedUser._id;
      // Filter out any perfumes that need to be removed
      const updatedPerfume = {
        ...perfume, // Keep original fields from the perfume object
        name: editName || perfume.name, // If edited, take the new value; otherwise, keep the original
        description: editDescription || perfume.description,
        release_year: editYear || perfume.release_year,
        accords: editAccords.length > 0 ? editAccords : perfume.accords,
        perfumers: editPerfumers.length > 0 ? editPerfumers : perfume.perfumers,
        notes: {
          top_notes: editNotes.top_notes.length > 0 ? editNotes.top_notes : perfume.notes.top_notes,
          heart_notes:
            editNotes.heart_notes.length > 0 ? editNotes.heart_notes : perfume.notes.heart_notes,
          base_notes:
            editNotes.base_notes.length > 0 ? editNotes.base_notes : perfume.notes.base_notes,
        },
        rating_value: perfume.rating_value, // Retain non-editable fields
        rating_count: perfume.rating_count,
        brand: perfume.brand,
        gender: perfume.gender,
        type: perfume.type,
        meta_description: perfume.meta_description,
        tags: editTags || perfume.tags,
        similar_perfumes: combinedSimilarPerfumes, // Merged similar perfumes
        main_image: perfume.main_image,
        gallery_images: perfume.gallery_images || [],
      };

      const requestPayload = {
        userId,
        perfumeId: perfume._id, // ID of the perfume being edited
        changes: updatedPerfume, // Send the complete changes
      };

      // Make the API request
      await axios.post(`https://hltback.parfumetrika.ru/requests`, requestPayload);

      setPerfume(updatedPerfume); // Update local state with saved data
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      // Enhanced error logging for better debugging
      console.error('Error saving data:', error.response?.data || error.message);
      setError('Ошибка сохранения данных');
    }
  };

  const handleOtherButtonClick = () => {
    setShowAssociations(false);
    setIsEditing(false);
  };

  if (error) return <Text color="red">{error}</Text>;
  const [noteSearchValue, setNoteSearchValue] = useState('');
  const [noteOptions, setNotesOptions] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);

  // Функция для поиска нот с сервера
  const fetchNotes = async (query) => {
    if (!query.trim()) return setNotesOptions([]); // Очищаем результаты, если запрос пустой
    try {
      const response = await axios.get(
        `https://hltback.parfumetrika.ru/notes/search?query=${encodeURIComponent(query)}`
      );
      const notesData = response.data.notes.map((note) => ({ value: note.name, label: note.name }));
      setNotesOptions(notesData); // Обновляем варианты для TagsInput
    } catch (err) {
      console.error('Ошибка при загрузке нот:', err);
    }
  };

  // Дебаунс функция для поиска
  const fetchNotesDebounced = useMemo(() => debounce(fetchNotes, 300), []);

  const renderNotes = (notes, title, noteKey, dataArray, setDataArray) => (
    <div>
      {isEditing ? (
        <>
          <Text weight={500} mb="10">
            {title}
          </Text>
          <TagsInput
            data={noteOptions} // Опции нот
            value={editNotes[noteKey]}
            onChange={(value) =>
              setEditNotes((prev) => ({
                ...prev,
                [noteKey]: value,
              }))
            }
            placeholder={`Введите ${title.toLowerCase()}`}
            onSearchChange={(value) => {
              setNoteSearchValue(value);
              fetchNotesDebounced(value); // Вызов функции поиска с дебаунсом
            }}
            // Управляемое значение поиска
            mb="20"
            acceptValueOnBlur
            clearable
          />
        </>
      ) : (
        <>
          <Text weight={500} mb="20">
            {title}
          </Text>
          <Group spacing="" mb="30">
            {notes.map((note, index) => (
              <Box
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => handleNoteClick(note)} // Передаем имя ноты
              >
                <Avatar
                  src={`https://parfumetrika.ru/note_images/${note}.jpg`}
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
        </>
      )}
    </div>
  );
  const title = perfume
    ? `${perfume.name} от ${perfume.brand} - отзывы, ноты и характеристики парфюма`
    : 'Perfume Details';

  const description = `${perfume?.name} - аромат для ${
    perfume?.gender === 'male'
      ? 'Мужчин'
      : perfume?.gender === 'female'
        ? 'Женщин'
        : 'Мужчин и Женщин'
  } от ${perfume?.brand}, выпущенный в ${perfume?.release_year}. Оценка ${perfume?.rating_value} из 10.`;

  const ogImageUrl = perfume?.main_image || 'https://yourdomain.com/default-image.jpg';

  return (
    <>
      <Header />

      <div
        style={{
          maxWidth: '1440px',
          margin: '30px auto 0 auto',
          paddingLeft: '20px',
          paddingRight: '20px',
        }}
      >
        <Breadcrumbs
          separator=">"
          style={{
            fontSize: '14px',
            color: '#555',
          }}
        >
          <Anchor href="/" style={{ textDecoration: 'none', color: '#007bff' }}>
            Главная
          </Anchor>
          <Anchor href="/brands" style={{ textDecoration: 'none', color: '#007bff' }}>
            Бренды
          </Anchor>
          <Anchor
            href={`/brand/${slugify(perfume?.brand || '', { lower: true })}`}
            style={{ textDecoration: 'none', color: '#007bff' }}
          >
            {perfume?.brand}
          </Anchor>
          <span style={{ color: '#6c757d' }}>{perfume?.name}</span>
        </Breadcrumbs>
      </div>

      <Container style={{ marginTop: '40px', width: '100%', maxWidth: '1120px' }}>
        <Flex direction={{ customBreakpoint: 'row', base: 'column' }} gap="40" align="flex-start">
          <Stack style={{ flex: 1 }}>
            {/* Perfume Details */}
            <Box className="perfume-info">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}
              >
                {loading ? (
                  <Skeleton height={30} width="60%" radius="sm" />
                ) : isEditing ? (
                  <TextInput
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Название аромата"
                    size="lg"
                  />
                ) : (
                  <>
                    <Title size="30px" pr="6">
                      {perfume?.name}
                    </Title>
                    {getGenderIcon(perfume?.gender)}
                  </>
                )}
              </div>

              {loading ? (
                <Skeleton height={20} width="40%" radius="sm" mt="sm" />
              ) : isEditing ? (
                <TextInput
                  value={editYear}
                  onChange={(e) => setEditYear(e.target.value)}
                  placeholder="Год выпуска"
                  mt="sm"
                />
              ) : (
                <Text color="dimmed" style={{ whiteSpace: 'pre-wrap' }}>
                  <Text
                    component="span"
                    onClick={() =>
                      router.push(`/brand/${slugify(perfume?.brand || '', { lower: true })}`)
                    }
                    style={{ cursor: 'pointer' }}
                  >
                    {perfume?.brand}
                  </Text>{' '}
                  • {perfume?.release_year} •{' '}
                </Text>
              )}

              {loading ? (
                <Skeleton height={20} width="30%" radius="sm" mt="sm" />
              ) : (
                <Group spacing="xs" align="center" mt="2" mb="-22">
                  <Rating value={perfume?.rating_value / 2} readOnly />
                  <Text size="sm">{perfume?.rating_value} / 10</Text>
                  <Text size="xs" color="dimmed">
                    ({perfume?.rating_count} оценок)
                  </Text>
                </Group>
              )}
            </Box>

            {/* Main Image and Buttons */}
            {loading ? (
              <AspectRatio ratio={1} style={{ marginBottom: '10px' }}>
                <Skeleton width="100%" radius="md" />
              </AspectRatio>
            ) : (
              <Image
                src={`https://parfumetrika.ru/${perfume.main_image}` || '/roman.jpg'}
                alt={perfume?.name}
                radius="md"
                onError={(e) => {
                  const target = e.target as HTMLImageElement; // Явно указываем, что target — это изображение
                  target.src = '/roman.jpg'; // Подмена изображения при ошибке загрузки
                }}
                style={{ width: '100%', marginBottom: '10px' }}
              />
            )}

            {loading ? (
              <Skeleton height={40} width="100%" radius="md" />
            ) : (
              <Group
                mt="2"
                mb="2"
                style={{ display: 'flex', justifyContent: 'center', flexWrap: 'nowrap' }}
              >
                <Button
                  radius="8"
                  style={{
                    backgroundColor: isInWishlist ? theme.colors.red[6] : theme.colors.blue[6],
                    color: 'white',
                    width: '100%',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                  onClick={() => {
                    if (localStorage.getItem('token')) {
                      handleWishlistClick();
                    } else {
                      window.location.href = '/register';
                    }
                  }}
                >
                  {isInWishlist ? 'Удалить' : 'Я хочу'}
                </Button>

                <Button
                  radius="8"
                  style={{
                    backgroundColor: isInCollection ? theme.colors.green[6] : theme.colors.blue[6],
                    color: 'white',
                    width: '100%',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                  onClick={() => {
                    if (localStorage.getItem('token')) {
                      handleCollectionClick();
                    } else {
                      window.location.href = '/register';
                    }
                  }}
                >
                  {isInCollection ? 'Удалить' : 'У меня есть'}
                </Button>
              </Group>
            )}

            {/* Description */}
            {loading ? (
              <Skeleton height={80} width="100%" radius="sm" mt="sm" />
            ) : isEditing ? (
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Описание"
                mt="8"
                mb="6"
                autosize
                minRows={4}
              />
            ) : (
              <Text
                className="description-desktop"
                mt="8"
                mb="6"
                style={{
                  fontSize: '14px',
                  lineHeight: '1.4',
                }}
              >
                {perfume?.description}
              </Text>
            )}

            {loading ? (
              <>
                <Skeleton height={30} width="30%" radius="sm" mt="sm" />
                <Group spacing="md" mb="14" justify="flex-start">
                  {[...Array(8)].map((_, index) => (
                    <Skeleton key={index} height={90} width={90} radius="md" />
                  ))}
                </Group>
              </>
            ) : (
              <>
                <Title order={3} mb="sm" className="popular-perfumes-desktop">
                  Популярные ароматы
                </Title>
                <Flex
                  wrap="wrap"
                  gap="md"
                  mb="14"
                  justify="flex-start"
                  className="popular-perfumes-desktop"
                >
                  {popularPerfumes.slice(0, 8).map((perfumeItem) => (
                    <Link
                      href={`/perfumes/${perfumeItem.perfume_id}`} // Динамический путь для перехода
                      key={perfumeItem.id}
                      style={{
                        textDecoration: 'none', // Убираем стандартное подчеркивание ссылки
                        color: 'inherit', // Унаследовать цвет от родителя
                      }}
                    >
                      <div
                        style={{
                          width: '90px',
                          display: 'flex',
                          justifyContent: 'start',
                          alignItems: 'center',
                          backgroundColor: 'white',
                          padding: '10px',
                          borderRadius: '12px',
                        }}
                      >
                        <Image
                          src={`https://parfumetrika.ru/${perfumeItem.main_image}`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement; // Явно указываем, что target — это изображение
                            target.src = '/roman.jpg'; // Подмена изображения при ошибке загрузки
                          }}
                          radius="md"
                          height={80}
                          alt={`Similar perfume ${perfumeId}`}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                      </div>
                    </Link>
                  ))}
                </Flex>
                <Flex align="center" gap="sm" mb="sm" className="popular-perfumes-desktop">
                  {/* Title */}
                  <Title order={3}>Похожие ароматы</Title>

                  {/* Plus Icon */}
                  <InputSimiliar onAddSimiliar={handleAddSimiliar} />
                </Flex>

                <Flex
                  wrap="wrap"
                  gap="md"
                  mb="14"
                  justify="flex-start"
                  className="popular-perfumes-desktop"
                >
                  {perfume?.similar_perfumes?.length > 0 ? (
                    perfume.similar_perfumes.slice(0, 8).map((perfumeId, index) => (
                      <Link
                        href={`/perfumes/${perfumeId.perfume_id}`} // Переход на страницу парфюма
                        key={perfumeId.perfume_id}
                        style={{
                          textDecoration: 'none', // Убираем стандартное подчеркивание ссылки
                          color: 'inherit', // Унаследовать цвет от родителя
                        }}
                      >
                        <div
                          style={{
                            width: '90px',
                            display: 'flex',
                            position: 'relative',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            padding: '10px',
                            borderRadius: '12px',
                          }}
                        >
                          {/* Display the perfume image */}
                          <Image
                            src={`https://parfumetrika.ru/${perfumeId.main_image}`}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement; // Явно указываем, что target — это изображение
                              target.src = '/roman.jpg'; // Подмена изображения при ошибке загрузки
                            }}
                            radius="md"
                            height={80}
                            alt={`Similar perfume ${perfumeId}`}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          />
                        </div>
                      </Link>
                    ))
                  ) : (
                    <Text size="sm" color="dimmed">
                      Похожие ароматы не найдены.
                    </Text>
                  )}
                </Flex>

                <Stack>
                  {' '}
                  <GallerySection perfume={perfume} />
                </Stack>
              </>
            )}
          </Stack>

          {/* Perfume Information and Accords */}
          <Stack style={{ flex: 2, width: '100%' }}>
            {/* Perfume Info */}
            <div className="perfume-info-desk">
              {loading ? (
                <>
                  <Skeleton height={30} width="60%" radius="sm" />
                  <Skeleton height={20} width="40%" radius="sm" mt="sm" />
                  <Skeleton height={20} width="30%" radius="sm" mt="sm" />
                </>
              ) : isEditing ? (
                <>
                  <TextInput
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Название аромата"
                    size="xl"
                  />
                  <TextInput
                    value={editYear}
                    onChange={(e) => setEditYear(e.target.value)}
                    placeholder="Год выпуска"
                    mt="sm"
                  />
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Title order={1} pr="6">
                      {perfume?.name}
                    </Title>
                    {getGenderIcon(perfume?.gender)}
                  </div>
                  <Text color="dimmed" mt="6" style={{ whiteSpace: 'pre-wrap' }}>
                    <Text
                      component="span"
                      onClick={() =>
                        router.push(`/brand/${slugify(perfume?.brand || '', { lower: true })}`)
                      }
                      style={{ cursor: 'pointer' }}
                    >
                      {perfume?.brand}
                    </Text>{' '}
                    • {perfume?.release_year} •{' '}
                  </Text>

                  <Group spacing="0" mt="10" align="center">
                    <Rating value={perfume?.rating_value / 2} readOnly />
                    <Text size="sm">{perfume?.rating_value} / 10</Text>
                    <Text size="xs" mt="" color="dimmed">
                      ({perfume?.rating_count} оценок)
                    </Text>
                  </Group>
                </>
              )}
            </div>

            {/* Accords */}
            {loading ? (
              <>
                <Skeleton height={20} width="40%" radius="sm" mt="sm" />
                <Group spacing="4">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} height={20} width={60} radius="md" />
                  ))}
                </Group>
              </>
            ) : (
              <Stack spacing="xs" mt="8" className="accords" mb="20">
                <Text weight={500}>Основные аккорды:</Text>

                {isEditing ? (
                  <TagsInput
                    data={accordsData}
                    value={editAccords}
                    onChange={setEditAccords}
                    placeholder="Введите аккорды"
                    acceptValueOnBlur
                  />
                ) : perfume?.accords?.length > 0 ? (
                  <Group spacing="4">
                    {perfume.accords.map((accord, index) => (
                      <Box
                        key={index}
                        style={{
                          backgroundColor: colors[index % colors.length], // Выбираем цвет из массива по индексу
                          borderRadius: '12px',
                          padding: '4px 12px',
                          fontSize: '14px',
                          color: theme.colors.dark[7], // Текст темного цвета для контраста
                        }}
                      >
                        {accord}
                      </Box>
                    ))}
                  </Group>
                ) : (
                  <>
                    <Text style={{ fontSize: '14px', color: theme.colors.gray[5] }}>
                      Информация отсутствует, хотите{' '}
                      <Text
                        onClick={() => {
                          if (localStorage.getItem('token')) {
                            handleEditClick();
                          } else {
                            window.location.href = '/register';
                          }
                        }}
                        component="a"
                        href="#"
                        style={{ fontSize: '14px' }}
                        color="blue"
                      >
                        добавить?
                      </Text>
                    </Text>
                    <Divider />
                  </>
                )}
              </Stack>
            )}

            {/* Notes Section */}
            {loading ? (
              <>
                <Skeleton height={20} width="40%" radius="sm" mt="sm" />
                <Group spacing="xs">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} height={40} width={80} radius="md" />
                  ))}
                </Group>
              </>
            ) : (
              <div>
                {isEditing || perfume?.notes?.top_notes?.length > 0
                  ? renderNotes(
                      isEditing ? editNotes.top_notes : perfume?.notes.top_notes,
                      'Верхние ноты',
                      'top_notes',
                      topNotesData,
                      setTopNotesData
                    )
                  : null}

                {isEditing || perfume?.notes?.heart_notes?.length > 0
                  ? renderNotes(
                      isEditing ? editNotes.heart_notes : perfume?.notes.heart_notes,
                      'Средние ноты',
                      'heart_notes',
                      heartNotesData,
                      setHeartNotesData
                    )
                  : null}

                {isEditing || perfume?.notes?.base_notes?.length > 0
                  ? renderNotes(
                      isEditing ? editNotes.base_notes : perfume?.notes.base_notes,
                      'Базовые ноты',
                      'base_notes',
                      baseNotesData,
                      setBaseNotesData
                    )
                  : null}

                {!perfume?.notes?.top_notes?.length &&
                  !perfume?.notes?.heart_notes?.length &&
                  !perfume?.notes?.base_notes?.length &&
                  !isEditing && (
                    <>
                      <Text weight={500} mb="20">
                        Основные ноты
                      </Text>
                      <Text style={{ fontSize: '14px', color: theme.colors.gray[5] }}>
                        Информация отсутствует, хотите{' '}
                        <Text
                          onClick={() => {
                            if (localStorage.getItem('token')) {
                              handleEditClick();
                            } else {
                              window.location.href = '/register';
                            }
                          }}
                          component="a"
                          href="#"
                          style={{ fontSize: '14px' }}
                          color="blue"
                        >
                          добавить?
                        </Text>
                      </Text>
                    </>
                  )}
              </div>
            )}

            {/* Perfumers Section */}
            <Divider />
            {loading ? (
              <Skeleton height={20} width="40%" radius="sm" mt="sm" />
            ) : (
              <Text weight={500} mt="2px">
                Парфюмеры:
              </Text>
            )}

            {loading ? (
              <Group spacing="xs" mb="20" wrap="wrap">
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} height={20} width={80} radius="md" />
                ))}
              </Group>
            ) : isEditing ? (
              <TagsInput
                data={perfumersData}
                value={editPerfumers}
                onChange={setEditPerfumers}
                placeholder="Введите парфюмеров"
                acceptValueOnBlur
              />
            ) : (
              <Group spacing="xs" mb="20" wrap="wrap">
                {perfume?.perfumers?.length > 0 && perfume?.perfumers_en?.length > 0 ? (
                  perfume?.perfumers.map((perfumer, index) => (
                    <Box
                      key={index}
                      style={{
                        backgroundColor: theme.colors.blue[2],
                        borderRadius: '12px',
                        padding: '4px 12px',
                        fontSize: '14px',
                        color: 'black',
                        cursor: 'pointer',
                      }}
                      onClick={() =>
                        router.push(`/parfumer/${slugify(perfume.perfumers_en[index])}`)
                      }
                    >
                      {perfumer} {/* Отображаем на русском */}
                    </Box>
                  ))
                ) : (
                  <Text style={{ fontSize: '14px', color: theme.colors.gray[5] }}>
                    Информация отсутствует, хотите{' '}
                    <Text
                      onClick={() => {
                        if (localStorage.getItem('token')) {
                          handleEditClick();
                        } else {
                          window.location.href = '/register';
                        }
                      }}
                      component="a"
                      href="#"
                      style={{ fontSize: '14px' }}
                      color="blue"
                    >
                      добавить?
                    </Text>
                  </Text>
                )}
              </Group>
            )}

            {/* Buttons and Associations Section */}
            <Divider />
            {loading ? (
              <>
                <Skeleton height={20} width="40%" radius="sm" mt="sm" />
                <Group spacing="xs" mb="20" wrap="wrap">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} height={20} width={60} radius="md" />
                  ))}
                </Group>
              </>
            ) : (
              <>
                <Group mt="20" spacing="xs" mb="20" wrap="wrap">
                  <Button
                    radius="8"
                    onClick={() => {
                      if (localStorage.getItem('token')) {
                        setMainUploadModalOpened(true);
                      } else {
                        window.location.href = '/register';
                      }
                    }}
                  >
                    Загрузить главное фото
                  </Button>
                  <Button
                    radius="8"
                    onClick={() => {
                      if (localStorage.getItem('token')) {
                        setUploadModalOpened(true);
                      } else {
                        window.location.href = '/register';
                      }
                    }}
                  >
                    Загрузить фото
                  </Button>

                  <Button
                    radius="8"
                    onClick={() => {
                      if (localStorage.getItem('token')) {
                        handleEditClick();
                      } else {
                        window.location.href = '/register';
                      }
                    }}
                  >
                    Изменить
                  </Button>

                  <Button
                    radius="8"
                    onClick={() => {
                      if (localStorage.getItem('token')) {
                        setRatingModalOpened(true);
                      } else {
                        window.location.href = '/register';
                      }
                    }}
                  >
                    Оценить
                  </Button>

                  <Button
                    onClick={() => {
                      setShowAssociations(!showAssociations);
                      setIsEditing(false);
                    }}
                    radius="8"
                  >
                    Ассоциации
                  </Button>
                </Group>
                {showAssociations && <Text>Ассоциации</Text>}

                {showAssociations &&
                  (perfume?.tags?.length > 0 ? (
                    <Group spacing="xs" mb="20" wrap="wrap">
                      {perfume.tags.map((tag, index) => (
                        <Box
                          key={index}
                          style={{
                            backgroundColor: theme.colors.gray[2],
                            borderRadius: '12px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            color: 'black',
                          }}
                        >
                          {tag}
                        </Box>
                      ))}
                    </Group>
                  ) : (
                    <Text style={{ fontSize: '14px', color: theme.colors.gray[5] }}>
                      Информация отсутствует, хотите{' '}
                      <Text
                        onClick={() => {
                          if (localStorage.getItem('token')) {
                            handleEditClick();
                          } else {
                            window.location.href = '/register';
                          }
                        }}
                        component="a"
                        href="#"
                        style={{ fontSize: '14px' }}
                        color="blue"
                      >
                        добавить?
                      </Text>
                    </Text>
                  ))}
              </>
            )}
            {isEditing && <Text>Ассоциации</Text>}
            {isEditing && (
              <TagsInput
                data={editTags}
                value={editTags}
                onChange={(value) => {
                  // Проверяем, что каждый тег начинается с символа `#`
                  const formattedTags = value.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));
                  setEditTags(formattedTags);
                }}
                placeholder="Введите ассоциации"
                acceptValueOnBlur
              />
            )}
            {/* Reviews Section */}
            <Divider />
            {loading ? (
              <>
                <Skeleton height={20} width="40%" radius="sm" mt="sm" />
                {[...Array(2)].map((_, index) => (
                  <Box
                    key={index}
                    p="md"
                    radius="14"
                    style={{
                      backgroundColor: 'var(--mantine-color-default-hover)',
                      borderRadius: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <Skeleton height={20} width="30%" radius="sm" />
                    <Skeleton height={60} width="100%" radius="sm" mt="sm" />
                  </Box>
                ))}
              </>
            ) : (
              <>
                <Text weight={500}>Отзывы:</Text>
                <Stack spacing="md">
                  {perfume?.reviews && perfume.reviews.length > 0 ? (
                    perfume.reviews.slice(0, reviewsToShow).map((review, index) => (
                      <Box
                        key={index}
                        p="md"
                        radius="14"
                        style={{
                          backgroundColor: 'var(--mantine-color-default-hover)',
                          borderRadius: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Text
                            weight={500}
                            onClick={() => {
                              if (review?.userId?._id) {
                                router.push(`/user/${review.userId._id}`);
                              }
                            }}
                            style={{
                              cursor: review?.userId ? 'pointer' : 'default',
                            }}
                          >
                            {review?.userId?.username || review.username}
                          </Text>
                          {review?.userId?.isVerified && (
                            <Tooltip label="Подтвержденная личность" withArrow>
                              <div
                                style={{
                                  backgroundColor: '#007bff', // Blue background
                                  borderRadius: '50%',
                                  width: '16px',
                                  height: '16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <IconCheck size="0.6rem" color="white" />
                              </div>
                            </Tooltip>
                          )}
                        </div>
                        <Text size="sm" mt="xs">
                          {review.body}
                        </Text>
                        <Text size="xs" mt="6" color="dimmed">
                          {review?.userId?.username
                            ? dayjs(review.createdAt).fromNow()
                            : dayjs().subtract(1, 'month').fromNow()}
                        </Text>
                      </Box>
                    ))
                  ) : (
                    <Text size="sm" color="dimmed">
                      Отзывы пока отсутствуют.
                    </Text>
                  )}

                  {perfume?.reviews &&
                    perfume.reviews.length > 0 &&
                    reviewsToShow < perfume.reviews.length && (
                      <Button onClick={handleShowMoreReviews} radius="8" mb="12" variant="light">
                        Показать еще
                      </Button>
                    )}
                </Stack>
              </>
            )}

            {/* Review Form */}
            <Divider />
            {loading ? (
              <>
                <Skeleton height={20} width="40%" radius="sm" mt="sm" />
                <Skeleton height={40} width="100%" radius="sm" mt="sm" />
                <Skeleton height={80} width="100%" radius="sm" mt="sm" />
                <Skeleton height={40} width="100%" radius="sm" mt="sm" />
              </>
            ) : (
              <>
                <Text weight={500} mt="0px">
                  Оставить отзыв:
                </Text>
                {localStorage.getItem('token') ? (
                  <>
                    <Textarea
                      label="Ваш отзыв"
                      placeholder="Напишите свой отзыв"
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      mt="md"
                    />
                    <HCaptcha
                      sitekey="c4923d66-7fe4-436e-bf08-068675b075d4" // Укажите ваш сайт-ключ
                      onVerify={handleCaptchaVerification}
                      ref={captchaRef}
                    />
                    <Button
                      disabled={!captchaToken}
                      onClick={handleSubmitReview}
                      radius="8"
                      mb="12"
                      mt="md"
                    >
                      Отправить отзыв
                    </Button>
                  </>
                ) : (
                  <Text mt="md">
                    Чтобы оставить отзыв,{' '}
                    <Text
                      component="a"
                      href="/register"
                      variant="link"
                      color="blue"
                      style={{ cursor: 'pointer' }}
                    >
                      зарегистрируйтесь
                    </Text>
                    .
                  </Text>
                )}
              </>
            )}
          </Stack>

          {isEditing && (
            <Group
              style={{ position: 'fixed', right: '30px', top: '50px', gap: '10px', zIndex: 9999 }}
            >
              <Button onClick={handleSaveClick} radius="12">
                Сохранить
              </Button>
              <Button
                onClick={() => setIsEditing(false)} // Сброс isEditing в false
                radius="12"
                bg="white"
                style={{ zIndex: 999999 }}
                variant="outline" // Используем outline для кнопки отмены
              >
                Отменить
              </Button>
            </Group>
          )}

          <ImageUploadModal
            opened={uploadModalOpened}
            onClose={() => setUploadModalOpened(false)}
            onUpload={handleImageUpload}
            perfumeId={perfume ? perfume._id : ''} // Передаем perfume_id
          />
          <ImageMainUploadModal
            opened={uploadMainModalOpened}
            onClose={() => setMainUploadModalOpened(false)}
            onUpload={handleImageUpload}
            perfumeId={perfume ? perfume._id : ''} // Передаем perfume_id
          />

          <RatingModal
            opened={ratingModalOpened}
            perfumeId={perfumeId} // Проверка на массив
            onClose={() => setRatingModalOpened(false)}
            onRate={handleRatingSubmit}
          />
        </Flex>
        <Box mt="10" mb="20">
          <Title size="lg" mb="sm">
            Поделиться:
          </Title>
          <Group spacing="sm">
            <ActionIcon
              size="lg"
              component="a"
              href={`https://telegram.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(perfume?.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              color="blue"
            >
              <IconBrandTelegram size={24} strokeWidth={1.6} />
            </ActionIcon>

            <ActionIcon
              size="lg"
              component="a"
              href={`https://wa.me/?text=${encodeURIComponent(perfume?.name)} ${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              color="green"
            >
              <IconBrandWhatsapp strokeWidth={1.6} size={24} />
            </ActionIcon>

            <ActionIcon
              size="lg"
              component="a"
              href={`https://vk.com/share.php?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(perfume?.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              color="blue"
            >
              <IconBrandVk size={24} strokeWidth={1.6} />
            </ActionIcon>

            <ActionIcon
              size="lg"
              component="a"
              href={`https://connect.ok.ru/offer?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(perfume?.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              color="orange"
            >
              <IconBrandOkRu size={24} strokeWidth={1.6} />
            </ActionIcon>

            <ActionIcon
              size="lg"
              component="a"
              href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(perfume?.image || '')}&description=${encodeURIComponent(perfume?.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              color="red"
            >
              <IconBrandPinterest size={24} strokeWidth={1.6} />
            </ActionIcon>
          </Group>
        </Box>
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

          .popular-perfumes-desktop {
            display: none;
          }
        }

        @media (min-width: 768px) {
          .description-mobile {
            display: none;
          }
          .popular-perfumes-desktop {
            display: flex;
          }
        }
      `}</style>
      <FooterLinks />
    </>
  );
};

export default PerfumeDetailsPage;
