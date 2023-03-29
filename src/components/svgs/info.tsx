const InfoIcon = (props: {
  activeTab: string;
  isActiveHandler: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <span onClick={() => props.isActiveHandler('Info')}>
      {props.activeTab === 'Info' ? (
        <svg
          fill='#000000'
          id='Layer_1'
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
          width='32px'
          height='32px'
          viewBox='0 0 48.296 48.257'
          xmlSpace='preserve'
          {...props}
        >
          <path d='M24.149,0C10.812,0,0,10.8,0,24.125c0,13.326,10.812,24.132,24.149,24.132c13.334,0,24.147-10.807,24.147-24.132 C48.296,10.8,37.483,0,24.149,0z M26.171,35.919c0,1.115-0.907,2.021-2.022,2.021c-1.12,0-2.025-0.908-2.025-2.021V22.507 c0-1.114,0.905-2.022,2.025-2.022c1.115,0,2.022,0.908,2.022,2.022V35.919z M26.171,15.101c0,1.119-0.907,2.022-2.022,2.022 c-1.12,0-2.025-0.903-2.025-2.022v-0.633c0-1.119,0.905-2.022,2.025-2.022c1.115,0,2.022,0.903,2.022,2.022V15.101z' />
        </svg>
      ) : (
        <svg
          width='32px'
          height='32px'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
          {...props}
        >
          <defs>
            <style>
              {
                '\n      .cls-1 {\n        fill: #101010;\n        fill-rule: evenodd;\n      }\n    '
              }
            </style>
          </defs>
          <path
            id='info'
            className='cls-1'
            d='M936,360a12,12,0,1,1,12-12A12,12,0,0,1,936,360Zm0-22a10,10,0,1,0,10,10A10,10,0,0,0,936,338Zm0,16a1,1,0,0,1-.993-1v-5.99a0.993,0.993,0,1,1,1.985,0V353A0.994,0.994,0,0,1,936,354Zm0-10a0.992,0.992,0,1,1,.991-0.992A0.994,0.994,0,0,1,936,344Zm-0.993-1s0,0,0,0a0.043,0.043,0,0,1,0,.005V343Zm1.985,0v0.01a0.043,0.043,0,0,1,0-.005S936.992,343,936.992,343Z'
            transform='translate(-924 -336)'
          />
        </svg>
      )}
    </span>
  );
};

export default InfoIcon;
