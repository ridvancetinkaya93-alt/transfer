import type { Metadata } from 'next';
import TransferlerClient from './TransferlerClient';

export const metadata: Metadata = {
  title: 'Transfer Talepleri',
};

export default function TransferlerPage() {
  return <TransferlerClient />;
}
