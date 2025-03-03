const IconArrow = ({ size = 20, color = "currentColor", ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        {...props}
    >
        <path
            d="M10.25 10.25V6.96763C10.25 6.87116 10.3547 6.81105 10.438 6.85966L16.0675 10.1435C16.1496 10.1914 16.1503 10.3098 16.0688 10.3587L6.43931 16.1364C6.356 16.1864 6.25 16.1264 6.25 16.0292V4C6.25 3.89699 6.3676 3.8382 6.45 3.9L8.25 5.25"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);

export default IconArrow;
