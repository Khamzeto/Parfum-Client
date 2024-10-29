import { Header } from '@/components/Header/Header';
import { AuthenticationForm } from '@/components/ui/Login/AuthenticationForm';
import { RegistrationForm } from '@/components/ui/Registration/Registration';
import { Box } from '@mantine/core';

export default function RegPage() {
  return (
    <>
      <Header />

      <RegistrationForm />
    </>
  );
}
