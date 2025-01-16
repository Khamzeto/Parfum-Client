'use client';
import React, { useState } from 'react';
import {
  TextInput,
  Button,
  Container,
  Paper,
  Title,
  Text,
  Notification,
  PasswordInput,
} from '@mantine/core';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import $api from '@/components/api/axiosInstance';
import { Header } from '@/components/Header/Header';
import { FooterLinks } from '@/components/ui/Footer/Footer';

const ResetPassword: React.FC = () => {
  const { token } = useParams(); // useParams для получения токена из URL
  const router = useRouter(); // useRouter для навигации
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await $api.post('/api/users/reset-password', { token, newPassword });
      setMessage(response.data.msg);
      setTimeout(() => router.push('/login'), 2000); // Перенаправление на страницу логина
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Ошибка при сбросе пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container size={420} my={40}>
        <Title align="center">Сброс пароля</Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Введите новый пароль для вашей учетной записи.
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <PasswordInput
            label="Новый пароль"
            placeholder="Введите новый пароль"
            value={newPassword}
            onChange={(event) => setNewPassword(event.currentTarget.value)}
            required
          />
          <Button fullWidth mt="md" onClick={handleResetPassword} loading={loading}>
            Сбросить пароль
          </Button>

          {message && (
            <Notification mt="md" color="green">
              {message}
            </Notification>
          )}
          {error && (
            <Notification mt="md" color="red">
              {error}
            </Notification>
          )}
        </Paper>
      </Container>
      <FooterLinks />
    </>
  );
};

export default ResetPassword;
