import React from 'react';
import { useSelector } from 'react-redux';

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className='px-4 py-12 max-w-2xl mx-auto'>
      <h1 className='text-3xl font-bold  mb-4 text-slate-800'>
        Welcome {currentUser ? 
              currentUser.username
            : ""} to Home !
      </h1>
      <p className='mb-4 text-slate-700'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
        Libero molestiae quod quis nisi nesciunt fugit non. 
        Accusantium, dignissimos, assumenda molestiae id pariatur iste quod eum et debitis sunt architecto in.
      </p>
    </div>
  );
}