'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextInput,
  Modal,
  Loader,
  Title,
  Card,
  Group,
  Avatar,
  FileButton,
  PasswordInput,
  Textarea,
} from '@mantine/core';
import { IconUpload, IconCheck, IconLock } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import axios from 'axios';
import { Header } from '@/components/Header/Header';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  description?: string;
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [avatarModal, setAvatarModal] = useState<boolean>(false);
  const [changePasswordModal, setChangePasswordModal] = useState<boolean>(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [editingData, setEditingData] = useState({
    username: '',
    email: '',
    avatar: '',
    description: '',
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setEditingData({
        username: parsedUser.username,
        email: parsedUser.email,
        avatar: parsedUser.avatar || '',
        description: parsedUser.description || '',
      });
    }
    setLoading(false);
  }, []);

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      await axios.put(`https://hltback.parfumetrika.ru/users/${user.id}`, editingData);
      const updatedUser = { ...user, ...editingData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      notifications.show({
        title: 'Успешно',
        message: 'Данные профиля обновлены',
        color: 'green',
      });
      window.location.reload();
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось обновить данные профиля',
        color: 'red',
      });
    }
  };

  const handleAvatarUpload = (file: File) => {
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      setEditingData((prevData) => ({ ...prevData, avatar: imageUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = async () => {
    if (!user) return;
    try {
      await axios.put(
        `https://hltback.parfumetrika.ru/users/${user.id}/change-password`,
        passwordData
      );
      notifications.show({
        title: 'Успешно',
        message: 'Пароль успешно изменен',
        color: 'green',
      });
      setPasswordData({ oldPassword: '', newPassword: '' });
      setChangePasswordModal(false);
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось изменить пароль. Проверьте введенные данные.',
        color: 'red',
      });
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setEditingData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handlePasswordInputChange = (field: 'oldPassword' | 'newPassword', value: string) => {
    setPasswordData((prevData) => ({ ...prevData, [field]: value || '' }));
  };

  if (loading) {
    return (
      <Box display="flex">
        <Loader size="lg" />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Container mt="40">
        <Title order={2} mb="lg" align="center">
          Профиль пользователя
        </Title>

        {user && (
          <Card radius={20} padding="lg" mb="lg" withBorder>
            <Grid justify="center">
              <Grid.Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  size={120}
                  radius="260"
                  src={editingData.avatar}
                  alt="User Avatar"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setAvatarModal(true)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  radius={9}
                  label="Имя"
                  value={editingData.username}
                  onChange={(e) => handleInputChange('username', e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={12} mt="6" mb="6">
                <TextInput
                  radius={9}
                  label="Email"
                  value={editingData.email}
                  onChange={(e) => handleInputChange('email', e.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={12} mt="6" mb="6">
                <Textarea
                  radius={9}
                  label="Описание"
                  placeholder="Добавьте описание профиля"
                  value={editingData.description}
                  onChange={(e) => handleInputChange('description', e.currentTarget.value)}
                  autosize
                  minRows={3}
                />
              </Grid.Col>
            </Grid>

            <Group mt="md">
              <Button radius={12} onClick={handleUpdateProfile}>
                Редактировать профиль
              </Button>
              <Button radius={12} color="blue" onClick={() => setChangePasswordModal(true)}>
                Сменить пароль
              </Button>
            </Group>
          </Card>
        )}

        {/* Avatar upload modal */}
        <Modal
          opened={avatarModal}
          radius={14}
          onClose={() => setAvatarModal(false)}
          title="Загрузить аватар"
        >
          <FileButton onChange={handleAvatarUpload} accept="image/png,image/jpeg">
            {(props) => (
              <Button fullWidth radius={9} {...props} leftSection={<IconUpload size={16} />}>
                Загрузить изображение
              </Button>
            )}
          </FileButton>
          {avatarFile && (
            <Box mt="md" display="flex" style={{ justifyContent: 'center' }}>
              <Avatar src={URL.createObjectURL(avatarFile)} size={100} radius="260" />
            </Box>
          )}
          <Button
            mt="md"
            fullWidth
            onClick={() => {
              handleUpdateProfile();
              setAvatarModal(false);
            }}
            leftSection={<IconCheck />}
            radius={9}
          >
            Сохранить аватар
          </Button>
        </Modal>

        {/* Change password modal */}
        <Modal
          opened={changePasswordModal}
          radius={14}
          onClose={() => setChangePasswordModal(false)}
          title="Сменить пароль"
        >
          <PasswordInput
            label="Старый пароль"
            radius={9}
            value={passwordData.oldPassword || ''}
            onChange={(e) => handlePasswordInputChange('oldPassword', e.currentTarget.value || '')}
          />
          <PasswordInput
            label="Новый пароль"
            radius={9}
            value={passwordData.newPassword || ''}
            onChange={(e) => handlePasswordInputChange('newPassword', e.currentTarget.value || '')}
            mt="md"
          />
          <Button
            mt="md"
            fullWidth
            onClick={handlePasswordChange}
            leftSection={<IconLock />}
            radius={9}
          >
            Сменить пароль
          </Button>
        </Modal>
      </Container>
    </>
  );
};

export default UserProfile;
