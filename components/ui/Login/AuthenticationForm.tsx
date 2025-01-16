'use client';

import { useForm } from '@mantine/form';
import { TextInput, PasswordInput, Text, Paper, Group, Button, Stack, Anchor } from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import $api from '@/components/api/axiosInstance';
import { GoogleButton } from '@/components/ui/GoogleButton/GoogleButton';
import { VkButton } from '@/components/ui/VkButton/VkButton';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Некорректный email'),
      password: (val) => (val.length <= 6 ? 'Пароль должен содержать не менее 6 символов' : null),
    },
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const { email, password } = form.values;
      const response = await $api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/profile');
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder style={{ maxWidth: 600, margin: '50px auto' }}>
      <Text size="lg" mb="20" fw={500}>
        Войти
      </Text>

      {error && <Text color="red">{error}</Text>}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            required
            label="Email"
            placeholder="hello@example.com"
            {...form.getInputProps('email')}
            radius="md"
          />
          <PasswordInput
            required
            label="Пароль"
            placeholder="Ваш пароль"
            {...form.getInputProps('password')}
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => router.push('/forgot-password')}
            size="xs"
          >
            Забыли пароль?
          </Anchor>
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => router.push('/register')}
            size="xs"
          >
            Нет аккаунта? Зарегистрироваться
          </Anchor>
          <Button type="submit" radius="xl" loading={loading}>
            Войти
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
