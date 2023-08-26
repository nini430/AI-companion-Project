import React from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface IBotAvatarProps {
    src:string;
}

const BotAvatar = ({src}:IBotAvatarProps) => {
  return (
    <Avatar className='w-10 h-10'>
        <AvatarImage src={src} />
    </Avatar>
  )
}

export default BotAvatar;