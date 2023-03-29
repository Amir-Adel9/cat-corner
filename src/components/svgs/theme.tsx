const ThemeIcon = (props: { activeTab: string }) => {
  return (
    <span>
      {props.activeTab === 'Theme' ? (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='32px'
          height='32px'
          viewBox='0 0 90 90'
          xmlSpace='preserve'
          {...props}
        >
          <g
            style={{
              stroke: 'none',
              strokeWidth: 0,
              strokeDasharray: 'none',
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeMiterlimit: 10,
              fill: 'none',
              fillRule: 'nonzero',
              opacity: 1,
            }}
          >
            <path
              d='M87.823 60.7a1.485 1.485 0 0 0-1.695-.214 33.03 33.03 0 0 1-44.232-12.718A33.03 33.03 0 0 1 52.997 3.103a1.481 1.481 0 0 0-.598-2.727c-9.843-1.265-19.59.692-28.193 5.66C13.8 12.041 6.356 21.743 3.246 33.35S1.732 57.08 7.741 67.487c6.008 10.407 15.709 17.851 27.316 20.961A45.26 45.26 0 0 0 46.774 90c7.795 0 15.489-2.044 22.42-6.046 8.601-4.966 15.171-12.43 18.997-21.586a1.484 1.484 0 0 0-.368-1.668z'
              style={{
                stroke: 'none',
                strokeWidth: 1,
                strokeDasharray: 'none',
                strokeLinecap: 'butt',
                strokeLinejoin: 'miter',
                strokeMiterlimit: 10,
                fill: '#000',
                fillRule: 'nonzero',
                opacity: 1,
              }}
            />
          </g>
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='32px'
          height='32px'
          viewBox='0 0 90 90'
          xmlSpace='preserve'
          {...props}
        >
          <g
            style={{
              stroke: 'none',
              strokeWidth: 0,
              strokeDasharray: 'none',
              strokeLinecap: 'butt',
              strokeLinejoin: 'miter',
              strokeMiterlimit: 10,
              fill: 'none',
              fillRule: 'nonzero',
              opacity: 1,
            }}
          >
            <path
              d='M46.756 90c-15.565 0-30.721-8.071-39.047-22.492C1.699 57.098.102 44.971 3.213 33.36 6.324 21.749 13.77 12.045 24.18 6.035 32.784 1.067 42.533-.891 52.381.374a2 2 0 0 1 .806 3.679 32.118 32.118 0 0 0-10.794 43.429 32.117 32.117 0 0 0 43.008 12.367 1.996 1.996 0 0 1 2.284.289c.624.569.823 1.47.498 2.249-3.829 9.159-10.4 16.626-19.004 21.593A44.724 44.724 0 0 1 46.756 90zm-.218-85.999C39.41 4.007 32.46 5.873 26.18 9.499 6.601 20.803-.131 45.929 11.173 65.508s36.428 26.311 56.008 15.007c6.28-3.625 11.371-8.712 14.941-14.882-16.184 5.635-34.346-.83-43.192-16.151-8.845-15.321-5.365-34.283 7.608-45.481z'
              style={{
                stroke: 'none',
                strokeWidth: 1,
                strokeDasharray: 'none',
                strokeLinecap: 'butt',
                strokeLinejoin: 'miter',
                strokeMiterlimit: 10,
                fill: '#000',
                fillRule: 'nonzero',
                opacity: 1,
              }}
            />
          </g>
        </svg>
      )}
    </span>
  );
};

export default ThemeIcon;
