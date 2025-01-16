'use client';
import React, { useState } from 'react';
import { TextInput, Button, Container, Paper, Title, Text, Notification } from '@mantine/core';
import axios from 'axios';
import $api from '@/components/api/axiosInstance';
import { Header } from '@/components/Header/Header';
import { FooterLinks } from '@/components/ui/Footer/Footer';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await $api.post('/auth/forgot-password', { email });
      setMessage(response.data.msg);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Ошибка при запросе сброса пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container size={420} my={40}>
        <Title align="center">Забыли пароль?</Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Введите ваш email, чтобы получить инструкцию по сбросу пароля.
        </Text>

        <Paper withBorder shadow="0" p={30} mt={30} radius="18">
          <TextInput
            label="Email"
            placeholder="Введите ваш email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
          />
          <Button fullWidth mt="md" onClick={handleForgotPassword} loading={loading}>
            Отправить
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

export default ForgotPassword;
