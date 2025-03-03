const CircleIcon = ({size = 20, color = "currentColor", ...props}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M10 3.75C6.5625 3.75 3.75 6.5625 3.75 10C3.75 13.4375 6.5625 16.25 10 16.25C13.4375 16.25 16.25 13.4375 16.25 10C16.25 6.5625 13.4375 3.75 10 3.75Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M10 12.5L10 9.375"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M10.0035 7.5L9.99793 7.5"
            stroke={color}
            strokeWidth="1.625"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default CircleIcon;