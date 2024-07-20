'use client'
import { useState } from 'react';
import Image from 'next/image';
import { EllipsisVertical } from 'lucide-react';
import { ProjectProps } from '@/types';
import {
    Avatar,
    AvatarImage,
} from "@/components/ui/avatar"
import { AvatarFallback } from '@radix-ui/react-avatar';
import moment from 'moment';
import DropMenu from './DropMenu';
import Link from 'next/link';

const ProjectCard = ({ project, role, author }: { project: ProjectProps, role: string | null, author: boolean }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <div className='relative w-[280px] max-w-[280px] h-[200px] '>
            {/* Loader */}
            {!imageLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center ">
                    <div className="loader">
                        <Image
                            src="/assets/loader.svg"
                            alt="loader"
                            width={24}
                            height={24}
                            className="animate-spin"
                        />
                    </div>
                </div>
            ) : (
                //Folder content
                
                <Link href={`/${project.id}`} target="_blank">
                    <div className='absolute z-10 inset-0'>
                        {(role == "org:admin" || author) &&
                            <div onClick={(e) => e.stopPropagation()} className='h-[20%] pt-2 flex items-center pl-2'>
                                <DropMenu project={project}>
                                    <EllipsisVertical />
                                </DropMenu>
                            </div>
                        }
                        <div className='pl-2 m-3 flex flex-col justify-between h-[150px] flex-1'>
                            <div className='flex flex-col gap-y-1 flex-grow'>
                                <h3 className='font-bold text-xl truncate'>
                                    {project.title}
                                </h3>
                                <p className='text-[0.8rem] h-[60px] overflow-hidden text-ellipsis line-clamp-3'>
                                    {project.description}
                                </p>
                            </div>
                            <div className='flex justify-between items-center mb-2'>
                                <div className='flex -space-x-7'>
                                    {!project.group ?
                                        (<Avatar className='scale-75 m-0'>
                                            <AvatarImage src={project.creator.photo} alt="author" />
                                            <AvatarFallback className='flex justify-center items-center w-full'>{project.creator.username.slice(0, 2)}</AvatarFallback>
                                        </Avatar>) :
                                        (
                                            project.group.members.slice(0, 6).map((member, index) => (
                                                <Avatar key={index} className='scale-75 -space-x-1'>
                                                    <AvatarImage src={member.photo} alt="members" />
                                                    <AvatarFallback className='flex justify-center items-center w-full'>{member.username.slice(0, 2)}</AvatarFallback>
                                                </Avatar>
                                            ))
                                        )
                                    }
                                </div>
                                <div className='flex items-center justify-center'>
                                    {moment(project.createdAt).format('DD/MM/YYYY')}
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            )}
        {/* Folder skelton */}
            <Image
                src={"/assets/Folder.png"}
                alt='folder'
                fill
                loading='lazy'
                className={`absolute inset-0 transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoadingComplete={() => setImageLoaded(true)}
            />
            <div className='absolute bottom-0 w-full h-[158px] rounded-[18px] bg-transparent rounded-tl-none shadow-xl hover:shadow-2xl' />


        </div>
    );
}

export default ProjectCard;
