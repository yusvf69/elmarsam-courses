import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Al Marsam - Admin",
  description: "Al Marsam Learning Management System Admin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main>{children}</main>;
}
