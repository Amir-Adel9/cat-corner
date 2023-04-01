const LikeInterface = (props: { likes: number; isLiked: boolean }) => (
  <span className='flex duration-200  items-center group gap-2 cursor-pointer '>
    {!props.isLiked ? (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        className='duration-200 fill-content group-hover:fill-[#f91880] opacity-70 group-hover:opacity-100'
        width={24}
        height={24}
        {...props}
      >
        <path d='M16.5 3C13.605 3 12 5.09 12 5.09S10.395 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 4.171 4.912 8.213 6.281 9.49C9.858 19.46 12 21.35 12 21.35s2.142-1.89 3.719-3.36C17.088 16.713 22 12.671 22 8.5A5.5 5.5 0 0 0 16.5 3zm-1.689 13.11c-.177.16-.331.299-.456.416-.751.7-1.639 1.503-2.355 2.145a175.713 175.713 0 0 1-2.355-2.145c-.126-.117-.28-.257-.456-.416C7.769 14.827 4 11.419 4 8.5 4 6.57 5.57 5 7.5 5c1.827 0 2.886 1.275 2.914 1.308L12 8l1.586-1.692C13.596 6.295 14.673 5 16.5 5 18.43 5 20 6.57 20 8.5c0 2.919-3.769 6.327-5.189 7.61z' />
      </svg>
    ) : (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 256 256'
        width={24}
        height={24}
        {...props}
      >
        <path
          d='M16.256 3.005C13.515 3.117 12 5.09 12 5.09s-1.515-1.973-4.256-2.085c-1.838-.075-3.523.84-4.633 2.307-3.862 5.104 3.45 11.075 5.17 12.678 1.029.959 2.299 2.098 3.057 2.773a.99.99 0 0 0 1.323 0c.758-.675 2.028-1.814 3.057-2.773 1.72-1.603 9.033-7.574 5.17-12.678-1.109-1.467-2.794-2.382-4.632-2.307z'
          transform='scale(10.66667)'
          fill='#f91880'
          strokeMiterlimit={10}
          fontFamily='none'
          fontWeight='none'
          fontSize='none'
          textAnchor='none'
          style={{
            mixBlendMode: 'normal',
          }}
        />
      </svg>
    )}
    <span className='duration-200 group-hover:text-[#f91880] opacity-70 group-hover:opacity-100'>
      {props.likes}
    </span>
  </span>
);

export default LikeInterface;
