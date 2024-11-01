import { Header } from '@/components/Header/Header';
import { LoginForm } from '@/components/ui/Login/AuthenticationForm';

export default function LoginPage() {
  return (
    <>
      <head>
        <title>Авторизация | Parfumetrika</title>
        <meta name="description" content="Авторизация,Parfumetrika" />
      </head>
      <Header />

      <LoginForm />
    </>
  );
}
