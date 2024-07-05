"use client";

const IconBroadcast = ({
  size,
  color,
  className,
}: {
  size: number;
  color?: string;
  className?: string;
}) => {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.93942 12.6464L7.69217 11.8973L7.69217 11.8973L7.69216 11.8973C5.33896 11.1129 4.16235 10.7207 4.16235 9.99997C4.16235 9.27921 5.33896 8.88701 7.69218 8.10261L16.2053 5.26488C17.8611 4.71295 18.689 4.43699 19.126 4.87401C19.5631 5.31102 19.2871 6.13892 18.7352 7.79471L15.8974 16.3079L15.8974 16.3079L15.8974 16.3079C15.113 18.6611 14.7208 19.8377 14.0001 19.8377C13.2793 19.8377 12.8871 18.6611 12.1027 16.3079L11.3536 14.0606L15.7072 9.70708C16.0977 9.31656 16.0977 8.68339 15.7072 8.29287C15.3167 7.90234 14.6835 7.90234 14.293 8.29287L9.93942 12.6464Z"
        fill={color}
      />
    </svg>
  );
};

export default IconBroadcast;
