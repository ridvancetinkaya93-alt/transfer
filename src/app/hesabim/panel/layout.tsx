import CustomerShell from './CustomerShell';

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell>{children}</CustomerShell>;
}
