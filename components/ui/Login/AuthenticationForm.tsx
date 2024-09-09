'use client'
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';
import { GoogleButton } from '@/components/ui/GoogleButton/GoogleButton';
import { upperFirst, useToggle } from '@mantine/hooks';
import { VkButton } from '../VkButton/VkButton';

export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Некорректный email'),
      password: (val) =>
        val.length <= 6 ? 'Пароль должен содержать не менее 6 символов' : null,
    },
  });

  return (
    <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <Paper
        radius="md"
        p="xl"
        withBorder
        {...props} // Spread other props
        style={{ maxWidth: 600, margin: '50px auto' }} // Using sx properly
      >
        <Text size="lg" fw={500}>
          Добро пожаловать в Mantine, {type === 'login' ? 'войдите' : 'зарегистрируйтесь'} с помощью
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
          <VkButton radius="xl">Вконтакте</VkButton>
        </Group>

        <Divider label="Или продолжите с email" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(() => {})}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Имя"
                placeholder="Ваше имя"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                radius="md"
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email && 'Некорректный email'}
              radius="md"
            />

            <PasswordInput
              required
              label="Пароль"
              placeholder="Ваш пароль"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={
                form.errors.password &&
                'Пароль должен содержать не менее 6 символов'
              }
              radius="md"
            />

            {type === 'register' && (
              <Checkbox
                label="Я принимаю условия использования"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              />
            )}
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === 'register'
                ? 'Уже есть аккаунт? Войти'
                : 'Нет аккаунта? Зарегистрироваться'}
            </Anchor>
            <Button type="submit" radius="xl">
              {type === 'register' ? 'Зарегистрироваться' : 'Войти'}
            </Button>
          </Group>
        </form>
      </Paper>
    </div>
  );
}
