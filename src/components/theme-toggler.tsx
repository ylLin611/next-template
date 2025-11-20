'use client';

import { animateThemeSwitch } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

export const ThemeToggler = () => {
  const { theme, setTheme } = useTheme();
  const handleThemeChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    animateThemeSwitch(e.nativeEvent, () => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    });
  };
  return <Button onClick={handleThemeChange}>切换主题</Button>;
};
