import React, { createContext, useContext, useEffect, useState } from 'react';

interface RouterContextType {
  pathname: string;
  navigate: (href: string) => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType>({
  pathname: '/',
  navigate: () => {},
  params: {},
});

export function useRouter() {
  return useContext(RouterContext);
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'doi-ngu' || hash === 'team') return '/doi-ngu';
      if (hash === 'dien-dan' || hash === 'forum') return '/dien-dan';
      if (hash === 'nen-tang-ai' || hash === 'ai') return '/nen-tang-ai';
      if (hash === 'tin-tuc' || hash === 'news') return '/tin-tuc';
      if (hash === 'ban-word' || hash === 'word' || hash === 'toan-van') return '/ban-word';
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'doi-ngu' || hash === 'team') {
        setPathname('/doi-ngu');
      } else if (hash === 'dien-dan' || hash === 'forum') {
        setPathname('/dien-dan');
      } else if (hash === 'nen-tang-ai' || hash === 'ai') {
        setPathname('/nen-tang-ai');
      } else if (hash === 'tin-tuc' || hash === 'news') {
        setPathname('/tin-tuc');
      } else if (hash === 'ban-word' || hash === 'word' || hash === 'toan-van') {
        setPathname('/ban-word');
      } else {
        setPathname(window.location.pathname || '/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.getElementById(href.slice(1));
      el?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      window.location.href = href;
      return;
    }

    window.history.pushState({}, '', href);
    const cleanPath = (href.split('#')[0] || '/').split('?')[0] || '/';
    setPathname(cleanPath);

    if (href.includes('#')) {
      const hash = href.split('#')[1];
      setTimeout(() => {
        const el = document.getElementById(hash);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const params: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((val, key) => {
      params[key] = val;
    });
  }

  return (
    <RouterContext.Provider value={{ pathname, navigate, params }}>
      {children}
    </RouterContext.Provider>
  );
}

export function Link({
  href,
  children,
  className,
  onClick,
  target,
  rel,
  'aria-label': ariaLabel,
  ...props
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: string;
  rel?: string;
  'aria-label'?: string;
  [key: string]: unknown;
}) {
  const { navigate } = useRouter();

  const isExternal =
    href.startsWith('http') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    target === '_blank';

  if (isExternal) {
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        target={target}
        rel={rel || (target === '_blank' ? 'noreferrer' : undefined)}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
          e.preventDefault();
          navigate(href);
        }
      }}
      {...props}
    >
      {children}
    </a>
  );
}

export default Link;
