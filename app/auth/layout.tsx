import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — ForeverWish',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
