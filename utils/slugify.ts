export function slugify(text: string): string {
  return text
    .toString() // Преобразование в строку
    .normalize('NFD') // Нормализация для разложения комбинированных букв (например, ä -> a)
    .replace(/[\u0300-\u036f]/g, '') // Удаление диакритических знаков (акцентов)
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Удаление неалфавитно-цифровых символов, кроме пробелов
    .trim() // Обрезка пробелов
    .replace(/\s+/g, '_') // Замена пробелов на подчеркивания
    .replace(/_+$/g, ''); // Удаление завершающих подчеркиваний
}


export function deslugify(slug: string): string {
  return slug
    .replace(/_/g, ' ')  // Преобразуем подчеркивания обратно в пробелы
    .replace(/\s+/g, ' ')  // Заменим несколько пробелов одним пробелом
    .trim();  // Удалим начальные и конечные пробелы
}
