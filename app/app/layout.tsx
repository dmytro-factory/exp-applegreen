import { PwaShell } from "@/components/pwa/pwa-shell";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return <PwaShell>{children}</PwaShell>;
}
