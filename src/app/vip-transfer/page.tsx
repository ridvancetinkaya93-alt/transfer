import type { Metadata } from 'next';
import VipTransferClient from './VipTransferClient';

export const metadata: Metadata = {
  title: 'VIP Transfer Hizmeti | Lüks Araç Kiralama',
  description: 'Havalimanı karşılama, şehir içi VIP transfer ve özel sürücü hizmetleri. Mercedes Vito, E-Serisi, V-Serisi ve daha fazlası. 7/24 hizmet.',
  keywords: ['VIP transfer', 'havalimanı transfer', 'lüks araç', 'özel şoför', 'Antalya transfer', 'Bodrum transfer'],
};

export default function VipTransferPage() {
  return <VipTransferClient />;
}
