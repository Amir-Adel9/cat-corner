const ProfileIcon = (props: { activeTab: string; isOwnProfile: boolean }) => {
  console.log('active', props.activeTab);
  console.log('user', props.isOwnProfile);
  return (
    <span>
      {props.activeTab === '/[slug]' && props.isOwnProfile ? (
        <svg
          width='42px'
          height='42px'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g id='style=fill'>
            <g id='profile'>
              <path
                id='vector (Stroke)'
                fillRule='evenodd'
                clipRule='evenodd'
                d='M6.75 6.5C6.75 3.6005 9.1005 1.25 12 1.25C14.8995 1.25 17.25 3.6005 17.25 6.5C17.25 9.3995 14.8995 11.75 12 11.75C9.1005 11.75 6.75 9.3995 6.75 6.5Z'
                className='fill-constant'
              />
              <path
                id='rec (Stroke)'
                fillRule='evenodd'
                clipRule='evenodd'
                d='M4.25 18.5714C4.25 15.6325 6.63249 13.25 9.57143 13.25H14.4286C17.3675 13.25 19.75 15.6325 19.75 18.5714C19.75 20.8792 17.8792 22.75 15.5714 22.75H8.42857C6.12081 22.75 4.25 20.8792 4.25 18.5714Z'
                className='fill-constant'
              />
            </g>
          </g>
        </svg>
      ) : (
        <svg
          width='42px'
          height='42px'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          {...props}
        >
          <g id='style=linear'>
            <g id='profile'>
              <path
                className='stroke-constant'
                id='vector'
                d='M12 11C14.4853 11 16.5 8.98528 16.5 6.5C16.5 4.01472 14.4853 2 12 2C9.51472 2 7.5 4.01472 7.5 6.5C7.5 8.98528 9.51472 11 12 11Z'
                strokeWidth={1.5}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                className='stroke-constant'
                id='rec'
                d='M5 18.5714C5 16.0467 7.0467 14 9.57143 14H14.4286C16.9533 14 19 16.0467 19 18.5714C19 20.465 17.465 22 15.5714 22H8.42857C6.53502 22 5 20.465 5 18.5714Z'
                strokeWidth={1.5}
              />
            </g>
          </g>
        </svg>
      )}
    </span>
  );
};

export default ProfileIcon;
