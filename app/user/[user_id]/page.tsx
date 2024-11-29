'use client';
import React, { useState, useEffect } from 'react';
import { Avatar, Button, Text, Title, Image, Tooltip, Group } from '@mantine/core';
import { Header } from '@/components/Header/Header';
import $api from '@/components/api/axiosInstance';
import { useParams, useRouter } from 'next/navigation';
import {
  IconBrandInstagram,
  IconBrandPinterest,
  IconBrandTelegram,
  IconBrandVk,
  IconBrandYoutube,
  IconCheck,
  IconWorld,
} from '@tabler/icons-react';
import Link from 'next/link';

const ProfileCard = () => {
  const [selectedTab, setSelectedTab] = useState('Коллекция');
  const params = useParams();
  const router = useRouter();

  const userId = params.user_id;
  const [username, setUsername] = useState<string | null>(null);
  const [avatar, setAvatar] = useState('');
  const [description, setDescription] = useState('');
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const [collectionPerfumes, setCollectionPerfumes] = useState([]);
  const [wishlistPerfumes, setWishlistPerfumes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [proposedRequests, setProposedRequests] = useState([]);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [loadingProposed, setLoadingProposed] = useState(false);
  const [socialLinks, setSocialLinks] = useState({
    vkUrl: null,
    instagramUrl: null,
    youtubeUrl: null,
    pinterestUrl: null,
    telegramUrl: null,
    website: null,
  });
  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await $api.get(`/users/${userId}`);
        const userData = response.data;
        setAvatar(userData.avatar);
        setUsername(userData.username || 'Пользователь');
        setDescription(userData.description);
        setVerified(userData.isVerified);
        setError(false);
        setSocialLinks({
          vkUrl: userData?.vkUrl || null,
          instagramUrl: userData?.instagramUrl || null,
          youtubeUrl: userData?.youtubeUrl || null,
          pinterestUrl: userData?.pinterestUrl || null,
          telegramUrl: userData?.telegramUrl || null,
          website: userData?.website || null,
        }); // Reset error if the request is successful
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);

        // Check for 500 status code
        if (error.response?.status === 500) {
          setError(true);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  // Data fetching functions for each tab
  const fetchCollection = async () => {
    if (!userId) return;
    setLoadingCollection(true);
    try {
      const response = await $api.get(`/users/${userId}/collection`);
      setCollectionPerfumes(response.data.perfumeCollection || []);
    } catch (error) {
      console.error('Ошибка при получении коллекции:', error);
    } finally {
      setLoadingCollection(false);
    }
  };

  const fetchWishlist = async () => {
    if (!userId) return;
    setLoadingWishlist(true);
    try {
      const response = await $api.get(`/users/${userId}/wishlist`);
      setWishlistPerfumes(response.data.wishlist || []);
    } catch (error) {
      console.error('Ошибка при получении списка желаемого:', error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const fetchPosts = async () => {
    if (!userId) return;
    setLoadingPosts(true);
    try {
      const response = await $api.get(`/article/requests/user/${userId}`);
      setPosts(response.data.requests || []);
    } catch (error) {
      console.error('Ошибка при получении постов:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchGalleryImages = async () => {
    if (!userId) return;
    setLoadingGallery(true);
    try {
      const response = await $api.get(`/gallery/gallery-requests/user/${userId}`);
      const images = response.data.requests.flatMap((request: any) => request.images);
      setGalleryImages(images);
    } catch (error) {
      console.error('Ошибка при загрузке галереи:', error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const fetchProposedRequests = async () => {
    if (!userId) return;
    setLoadingProposed(true);
    try {
      const response = await $api.get(`/requests/user/${userId}`);
      setProposedRequests(response.data.requests || []);
    } catch (error) {
      console.error('Ошибка при получении предложенных:', error);
    } finally {
      setLoadingProposed(false);
    }
  };

  useEffect(() => {
    if (userId) {
      if (selectedTab === 'Коллекция') {
        fetchCollection();
      } else if (selectedTab === 'Я хочу') {
        fetchWishlist();
      } else if (selectedTab === 'Статьи') {
        fetchPosts();
      } else if (selectedTab === 'Галерея') {
        fetchGalleryImages();
      } else if (selectedTab === 'Измененные') {
        fetchProposedRequests();
      }
    }
  }, [userId, selectedTab]);

  if (error) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text size="lg" weight={500} color="red">
            Такой пользователь не найден
          </Text>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0 30px',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '40px',
            alignItems: 'space-between',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            padding: '40px 0',
          }}
        >
          <Avatar size="250px" src={avatar} radius="xl" />

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'start',
              justifyContent: 'space-between',
              padding: '20px 0 20px  0',
            }}
          >
            <Title order={1} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {username}
              {verified && (
                <Tooltip label="Подтвержденная личность" withArrow>
                  <div
                    style={{
                      backgroundColor: '#007bff', // Blue background
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconCheck size="1.1rem" color="white" />
                  </div>
                </Tooltip>
              )}
            </Title>
            <Text>{description}</Text>

            {socialLinks.website && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginTop: '8px',
                  marginBottom: '8px',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  backgroundColor: '#f7f7f7',
                  cursor: 'pointer', // Указатель на курсоре при наведении
                }}
                onClick={() => router.push(socialLinks.website)} // Переход при клике на блок
              >
                <IconWorld size={20} color="#6c757d" />
                <div style={{ color: '#6c757d', fontSize: '14px', overflowWrap: 'break-word' }}>
                  {socialLinks.website}
                </div>
              </div>
            )}

            <Group mt="0" spacing="xs">
              {socialLinks.vkUrl && (
                <a href={socialLinks.vkUrl} target="_blank" rel="noopener noreferrer">
                  <IconBrandVk size={28} color="#0077ff" />
                </a>
              )}
              {socialLinks.instagramUrl && (
                <a href={socialLinks.instagramUrl} target="_blank" rel="noopener noreferrer">
                  <IconBrandInstagram size={28} color="#C13584" />
                </a>
              )}
              {socialLinks.youtubeUrl && (
                <a href={socialLinks.youtubeUrl} target="_blank" rel="noopener noreferrer">
                  <IconBrandYoutube size={28} color="#FF0000" />
                </a>
              )}
              {socialLinks.pinterestUrl && (
                <a href={socialLinks.pinterestUrl} target="_blank" rel="noopener noreferrer">
                  <IconBrandPinterest size={28} color="#E60023" />
                </a>
              )}
              {socialLinks.telegramUrl && (
                <a href={socialLinks.telegramUrl} target="_blank" rel="noopener noreferrer">
                  <IconBrandTelegram size={28} color="#0088cc" />
                </a>
              )}
            </Group>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            justifyContent: 'start',
            paddingBottom: '20px',
            paddingLeft: '30px',
            paddingRight: '30px',
          }}
        >
          {['Коллекция', 'Я хочу', 'Статьи', 'Галерея', 'Измененные'].map((tab) => (
            <Button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              style={{
                minWidth: '150px',
                borderRadius: '18px 18px 0 0',
              }}
              variant={selectedTab === tab ? 'filled' : 'outline'}
            >
              {tab}
            </Button>
          ))}
        </div>

        <div style={{ padding: '30px 0' }}>
          {selectedTab === 'Коллекция' && (
            <div>
              <Title order={3} style={{ marginBottom: '16px' }}>
                Любимые парфюмы
              </Title>
              {loadingCollection ? (
                <Text>Загрузка коллекции...</Text>
              ) : collectionPerfumes.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '30px',
                    marginTop: '20px',
                  }}
                >
                  {collectionPerfumes.map((perfume) => (
                    <div
                      key={perfume._id}
                      onClick={() => router.push(`/perfumes/${perfume.perfume_id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={
                          perfume.main_image ||
                          'https://pimages.parfumo.de/720/266320_img-8741-louis-vuitton-lv-lovers_720.jpg'
                        }
                        alt={perfume.name}
                        style={{
                          width: '60%',
                          borderRadius: '12px',
                          marginBottom: '8px',
                        }}
                      />
                      <Text size="md" weight={600}>
                        {perfume.name}
                      </Text>
                      <Text size="sm" color="dimmed">
                        {perfume.brand}
                      </Text>
                    </div>
                  ))}
                </div>
              ) : (
                <Text>В коллекции нет парфюмов.</Text>
              )}
            </div>
          )}

          {selectedTab === 'Я хочу' && (
            <div>
              <Title order={3} style={{ marginBottom: '16px' }}>
                Список желаемого
              </Title>
              {loadingWishlist ? (
                <Text>Загрузка списка желаемого...</Text>
              ) : wishlistPerfumes.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '30px',
                    marginTop: '20px',
                  }}
                >
                  {wishlistPerfumes.map((perfume) => (
                    <div
                      key={perfume._id}
                      onClick={() => router.push(`/perfumes/${perfume.perfume_id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={`https://parfumetrika.ru/${perfume.main_image}`}
                        alt={perfume.name}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement; // Явно указываем, что target — это изображение
                          target.src = '/roman.jpg'; // Подмена изображения при ошибке загрузки
                        }}
                        style={{
                          width: '60%',
                          borderRadius: '12px',
                          marginBottom: '8px',
                        }}
                      />
                      <Text size="md" weight={600}>
                        {perfume.name}
                      </Text>
                      <Text size="sm" color="dimmed">
                        {perfume.brand}
                      </Text>
                    </div>
                  ))}
                </div>
              ) : (
                <Text>Нет парфюмов в списке желаемого.</Text>
              )}
            </div>
          )}

          {selectedTab === 'Статьи' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title order={3} style={{ marginBottom: '16px' }}>
                  Статьи
                </Title>
              </div>
              {loadingPosts ? (
                <Text>Загрузка постов...</Text>
              ) : posts.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '30px',
                    marginTop: '20px',
                  }}
                >
                  {posts.map((post) => (
                    <div key={post._id}>
                      {post.coverImage && (
                        <Link href={`/article/${post._id}`} passHref>
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            height={180}
                            fit="cover"
                            radius="md"
                            style={{ cursor: 'pointer' }}
                          />
                        </Link>
                      )}
                      <Title order={5} mt={10} onClick={() => router.push(`/article/${post._id}`)}>
                        {post.title}
                      </Title>
                      <Text size="sm" color="dimmed">
                        {post.description}
                      </Text>
                    </div>
                  ))}
                </div>
              ) : (
                <Text>Нет опубликованных постов.</Text>
              )}
            </div>
          )}

          {selectedTab === 'Галерея' && (
            <div>
              <Title order={3} style={{ marginBottom: '16px' }}>
                Галерея
              </Title>
              {loadingGallery ? (
                <Text>Загрузка галереи...</Text>
              ) : galleryImages.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '30px',
                    marginTop: '20px',
                  }}
                >
                  {galleryImages.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image.images}
                        alt={`Gallery image ${index + 1}`}
                        style={{
                          width: '70%',
                          borderRadius: '12px',
                        }}
                      />

                      <Title
                        onClick={() => router.push(`/perfumes/${image?.perfumeId.perfume_id}`)}
                        style={{ cursor: 'pointer' }}
                        size="sm"
                        mt="xs"
                      >
                        {image?.perfumeId.name}
                      </Title>
                    </div>
                  ))}
                </div>
              ) : (
                <Text>Галерея пуста.</Text>
              )}
            </div>
          )}

          {selectedTab === 'Измененные' && (
            <div>
              <Title order={3} style={{ marginBottom: '16px' }}>
                Измененные парфюмы
              </Title>
              {loadingProposed ? (
                <Text>Загрузка предложенных...</Text>
              ) : proposedRequests.length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '30px',
                    marginTop: '20px',
                  }}
                >
                  {proposedRequests.map((request) => (
                    <div
                      key={request.perfumeId}
                      onClick={() => router.push(`/perfumes/${request.perfumeId}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={
                          request.main_image ||
                          'https://pimages.parfumo.de/720/266320_img-8741-louis-vuitton-lv-lovers_720.jpg'
                        }
                        alt={request.perfumeName}
                        style={{
                          width: '60%',
                          borderRadius: '12px',
                          marginBottom: '8px',
                        }}
                      />
                      <Text size="md" weight={600}>
                        {request.perfumeName}
                      </Text>
                      <Text size="sm" color="dimmed">
                        {request.perfumeBrand}
                      </Text>
                      <Text size="xs" color="gray">
                        Дата добавления: {new Date(request.createdAt).toLocaleDateString()}
                      </Text>
                    </div>
                  ))}
                </div>
              ) : (
                <Text>Нет предложенных парфюмов.</Text>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
