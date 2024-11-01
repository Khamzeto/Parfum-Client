'use client';
import React, { useState, useEffect } from 'react';
import { Avatar, Button, Text, Title, Image } from '@mantine/core';
import { Header } from '@/components/Header/Header';
import $api from '@/components/api/axiosInstance';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const ProfileCard = () => {
  const [selectedTab, setSelectedTab] = useState('Коллекция');
  const [id, setId] = useState(null);
  const [username, setUsername] = useState<string | null>(null);
  const [collectionPerfumes, setCollectionPerfumes] = useState([]);
  const [wishlistPerfumes, setWishlistPerfumes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [proposedRequests, setProposedRequests] = useState([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingProposed, setLoadingProposed] = useState(false);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setAvatar(parsedUser?.avatar);
      setUsername(parsedUser?.username || 'Пользователь');
      setDescription(parsedUser?.description);
      setId(parsedUser?.id);
    }
  }, []);

  const fetchCollection = async () => {
    if (!id) return;
    setLoadingCollection(true);
    try {
      const response = await $api.get(`/users/${id}/collection`);
      setCollectionPerfumes(response.data.perfumeCollection || []);
    } catch (error) {
      console.error('Ошибка при получении коллекции:', error);
    } finally {
      setLoadingCollection(false);
    }
  };

  const fetchWishlist = async () => {
    if (!id) return;
    setLoadingWishlist(true);
    try {
      const response = await $api.get(`/users/${id}/wishlist`);
      setWishlistPerfumes(response.data.wishlist || []);
    } catch (error) {
      console.error('Ошибка при получении списка желаемого:', error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  const fetchPosts = async () => {
    if (!id) return;
    setLoadingPosts(true);
    try {
      const response = await $api.get(`/article/requests/user/${id}`);
      setPosts(response.data.requests || []);
    } catch (error) {
      console.error('Ошибка при получении постов:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchGalleryImages = async () => {
    setLoadingGallery(true);
    try {
      const response = await $api.get(`/gallery/gallery-requests/user/${id}`);
      const images = response.data.requests.flatMap((request: any) => request.images);
      setGalleryImages(response.data.requests);
    } catch (error) {
      console.error('Ошибка при загрузке галереи:', error);
    } finally {
      setLoadingGallery(false);
    }
  };

  const fetchProposedRequests = async () => {
    if (!id) return;
    setLoadingProposed(true);
    try {
      const response = await $api.get(`/requests/user/${id}`);
      setProposedRequests(response.data.requests || []);
    } catch (error) {
      console.error('Ошибка при получении предложенных:', error);
    } finally {
      setLoadingProposed(false);
    }
  };

  useEffect(() => {
    if (id) {
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
  }, [id, selectedTab]);

  useEffect(() => {
    if (selectedTab === 'Коллекция') {
      fetchCollection();
    } else if (selectedTab === 'Я хочу') {
      fetchWishlist();
    } else if (selectedTab === 'Статьи') {
      fetchPosts();
    } else if (selectedTab === 'Галерея') {
      fetchGalleryImages();
    }
  }, [selectedTab]);

  return (
    <>
      <head>
        <title>Профиль</title>
        <meta name="description" content="Профиль,Parfumetrika" />
      </head>
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
            <div>
              <Title order={1}>{username}</Title>
              <Text style={{ fontSize: '18px', color: '#6b6b6b' }}>{description}</Text>
            </div>
            <Button
              size="md"
              variant="outline"
              style={{ maxWidth: '300px' }}
              radius="12"
              onClick={() => router.push(`/change-profile`)}
            >
              Редактировать профиль
            </Button>
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
                        src="https://pimages.parfumo.de/720/266320_img-8741-louis-vuitton-lv-lovers_720.jpg"
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
                        src="https://pimages.parfumo.de/720/266320_img-8741-louis-vuitton-lv-lovers_720.jpg"
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
                <Text>Нет парфюмов в списке желаемого.</Text>
              )}
            </div>
          )}

          {selectedTab === 'Статьи' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Title order={3} style={{ marginBottom: '16px' }}>
                  Мои Статьи
                </Title>
                <Button
                  onClick={() => router.push(`/create-article`)}
                  style={{ borderRadius: '12px' }}
                >
                  Создать статью
                </Button>
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
