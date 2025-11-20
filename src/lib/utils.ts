import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function addCustomStyles() {
  let style = document.getElementById('vt-custom-styles');
  if (!style) {
    style = document.createElement('style');
    style.id = 'vt-custom-styles';
    document.head.appendChild(style);
  }
  style.textContent = `.light::view-transition-old(root) { z-index: -1 !important; }`;
}

export function animateThemeSwitch(e: MouseEvent, toggleTheme: () => void) {
  if (!document.startViewTransition) {
    toggleTheme();
    return;
  }

  const { clientX, clientY } = e;
  const innerWidth = window.innerWidth;
  const innerHeight = window.innerHeight;

  const radius = Math.hypot(Math.max(clientX, innerWidth - clientX), Math.max(clientY, innerHeight - clientY));

  const isDark =
    document.documentElement.classList.contains('dark') || document.documentElement.dataset.theme === 'dark';

  const transition = document.startViewTransition(() => {
    toggleTheme();
  });

  transition.ready.then(() => {
    const style = document.getElementById('vt-custom-styles');
    if (style) style.remove();

    const clip = [`circle(0px at ${clientX}px ${clientY}px)`, `circle(${radius}px at ${clientX}px ${clientY}px)`];

    document.documentElement.animate(
      {
        clipPath: isDark ? [...clip].reverse() : clip,
      },
      {
        duration: 600,
        easing: 'ease-out',
        pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
      },
    );
  });
  setTimeout(() => {
    addCustomStyles();
  }, 500);
}
