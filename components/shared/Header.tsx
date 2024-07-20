import React from 'react';


type PropsType = {
  title: string,
  subTitle?: string,
  TitleClassName?: string
  subTitleClassName?: string
}


const Header = ({ title, subTitle, TitleClassName,subTitleClassName }: PropsType) => {
  return (
    <div className='truncate'>
      <h2 className={`${TitleClassName?TitleClassName:"text-3xl"} font-bold`}>{title}</h2>
      {subTitle && <p className={`${subTitleClassName} p-16-regular  mt-1 text-muted-foreground`}>{subTitle}</p>}
    </div>
  );
}

export default Header;
