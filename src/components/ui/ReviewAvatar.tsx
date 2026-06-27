import { getInitials, getAvatarColor } from '@/lib/utils/avatar';

interface Props {
  name: string;
  avatar?: string;
  className?: string;
}

export default function ReviewAvatar({ name, avatar, className }: Props) {
  if (avatar) {
    return <img src={avatar} alt={name} className={className} />;
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: getAvatarColor(name),
        color: '#fff',
        fontWeight: 700,
        fontSize: '14px',
        borderRadius: '50%',
      }}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  );
}
