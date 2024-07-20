import React, { ReactNode } from 'react';
import { Skeleton } from '../ui/skeleton';

const SkeltonWrapper = ({ children, isLoading, className }: { children: ReactNode, isLoading: boolean, className?: string }) => {

  if (!isLoading) return <>{children}</>;

  return (
    <Skeleton className={className}>
      <div className='opacity-0'>{children}</div>
    </Skeleton>
  );
}


export default SkeltonWrapper;
