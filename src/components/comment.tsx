const CommentInterface = (props: { postComments: number }) => (
  <span className='flex duration-200  items-center group gap-2 cursor-pointer '>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 32 32'
      className='duration-200 fill-content group-hover:fill-[#01A66F] opacity-70 group-hover:opacity-100'
      width={24}
      height={24}
    >
      <path d='M16 3c-3.79 0-7.234 1.113-9.781 2.977C3.668 7.836 2 10.507 2 13.5c0 3.629 2.473 6.7 6 8.55V29l6.746-5.063c.41.032.824.063 1.254.063 3.79 0 7.234-1.113 9.781-2.973C28.332 19.164 30 16.492 30 13.5s-1.668-5.664-4.219-7.523C23.234 4.113 19.79 3 16 3Zm0 2c3.39 0 6.445 1.016 8.602 2.59C26.758 9.164 28 11.246 28 13.5s-1.242 4.336-3.398 5.91C22.445 20.984 19.39 22 16 22c-.492 0-.984-.027-1.477-.074l-.382-.031L10 25v-4.14l-.578-.266C6.07 19.02 4 16.387 4 13.5c0-2.254 1.242-4.336 3.398-5.91C9.555 6.016 12.61 5 16 5Z' />
    </svg>
    <span className='duration-200 group-hover:text-[#01A66F] opacity-70 group-hover:opacity-100'>
      {props.postComments}
    </span>
  </span>
);

export default CommentInterface;
