import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

export default getRequestConfig(async () => {
  // Try to get locale from cookie first
  const cookieStore = await cookies();
  let locale = cookieStore.get('NEXT_LOCALE')?.value;

  // If no cookie, try to detect from Accept-Language header
  if (!locale) {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    
    if (acceptLanguage) {
      // Simple parsing - check if Hindi is preferred
      const languages = acceptLanguage.split(',').map(lang => lang.split(';')[0].trim());
      if (languages.some(lang => lang.startsWith('hi'))) {
        locale = 'hi';
      }
    }
  }

  // Default to English
  if (!locale || !['en', 'hi'].includes(locale)) {
    locale = 'en';
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
