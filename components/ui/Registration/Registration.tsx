'use client';

import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Stack,
  Checkbox,
  Divider,
  Anchor,
  PinInput, // Импортируем PinInput для ввода кода активации
} from '@mantine/core';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import $api from '@/components/api/axiosInstance';
import { GoogleButton } from '@/components/ui/GoogleButton/GoogleButton';
import { VkButton } from '@/components/ui/VkButton/VkButton';

export function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredUserEmail, setRegisteredUserEmail] = useState('');
  const [awaitingActivation, setAwaitingActivation] = useState(false);
  const [activationCode, setActivationCode] = useState(''); // Код активации
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Некорректный email'),
      password: (val) => (val.length <= 6 ? 'Пароль должен содержать не менее 6 символов' : null),
    },
  });

  // Регистрация пользователя
  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const { email, password, name } = form.values;

      const response = await $api.post('/auth/register', {
        email,
        password,
        username: name,
      });

      setRegisteredUserEmail(email);
      setAwaitingActivation(true); // Переключаемся на форму активации
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  // Активация аккаунта
  const handleActivationSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await $api.post('/auth/activate', {
        email: registeredUserEmail,
        activationCode, // Отправляем код активации
      });

      if (response.data.msg === 'Аккаунт успешно активирован') {
        setAwaitingActivation(false);
        router.push('/login'); // Перенаправляем на страницу логина после успешной активации
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Неправильный код активации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder style={{ maxWidth: 600, margin: '50px auto' }}>
      {awaitingActivation ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text size="lg" fw={500}>
            Введите код активации, отправленный на ваш email
          </Text>
          {error && <Text color="red">{error}</Text>}
          <form
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              width: '100%',
            }}
            onSubmit={(e) => e.preventDefault()}
          >
            <Stack
              mt="20"
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
              }}
            >
              {/* Компонент PinInput для ввода 4-значного кода */}
              <PinInput
                length={4}
                value={activationCode}
                onChange={setActivationCode}
                type="number"
                required
              />
            </Stack>

            <Group
              position="apart"
              mt="xl"
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                width: '100%',
                alignItems: 'center',
              }}
            >
              <Button type="button" radius="xl" loading={loading} onClick={handleActivationSubmit}>
                Активировать аккаунт
              </Button>
            </Group>
          </form>
        </div>
      ) : (
        <>
          <Text size="lg" fw={500}>
            Зарегистрируйтесь с помощью:
          </Text>

          <Group grow mb="md" mt="md">
            <GoogleButton
              radius="xl"
              onClick={() => (window.location.href = 'https://hltback.parfumetrika.ru/auth/google')}
            >
              Google
            </GoogleButton>
            <VkButton
              radius="xl"
              onClick={() =>
                (window.location.href = 'https://hltback.parfumetrika.ru/auth/vkontakte')
              }
            >
              ВКонтакте
            </VkButton>
          </Group>

          <Divider label="Или зарегистрируйтесь с email" labelPosition="center" my="lg" />

          {error && <Text color="red">{error}</Text>}
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Имя"
                placeholder="Ваше имя"
                {...form.getInputProps('name')}
                radius="md"
              />
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
              <Checkbox
                label="Я принимаю условия использования"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            </Stack>

            <Group justify="space-between" mt="xl">
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                onClick={() => router.push('/login')}
                size="xs"
              >
                Уже есть аккаунт? Войти
              </Anchor>
              <Button type="submit" radius="xl" loading={loading}>
                Зарегистрироваться
              </Button>
            </Group>
          </form>
        </>
      )}
    </Paper>
  );
}
