'use client'

import {useUser} from '@clerk/nextjs'
import { Avatar, AvatarImage } from "./ui/avatar";



const UserAvatar = () => {
    const {user}=useUser();
  return (
    <div className="w-10 h-10">
        <Avatar>
            <AvatarImage src={user?.imageUrl}  />
        </Avatar>
    </div>
  )
}

export default UserAvatar;