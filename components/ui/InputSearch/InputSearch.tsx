import { useSearchParams } from 'next/navigation'; // Для управления параметрами URL в Next.js 13+
import React, { useState } from 'react';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

const SearchInput = () => {
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || ''); // Извлекаем значение из URL

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);

    // Обновляем параметры запроса в URL
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('search', event.target.value);
    window.history.pushState({}, '', currentUrl.toString()); // Обновляем URL без перезагрузки страницы
  };

  return (
    <div style={{ width: '100%', marginTop: '12px', marginBottom: '12px', maxWidth: '1400px', margin: '12px auto' }}>
      <TextInput
        placeholder="Найти..."
        style={{ width: '100%' }}
        value={searchValue}
        leftSection={<IconSearch size={18} />}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchInput;
