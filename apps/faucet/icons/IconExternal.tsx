"use client";

const IconExternal = ({
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
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 4H21V3H20V4ZM11 6C11.5523 6 12 5.55228 12 5C12 4.44772 11.5523 4 11 4V6ZM20 13C20 12.4477 19.5523 12 19 12C18.4477 12 18 12.4477 18 13H20ZM14 5H20V3H14V5ZM19 4V10H21V4H19ZM19.2929 3.29289L11.2929 11.2929L12.7071 12.7071L20.7071 4.70711L19.2929 3.29289ZM4 7V17H6V7H4ZM7 20H17V18H7V20ZM11 4H7V6H11V4ZM20 17V13H18V17H20ZM17 20C18.6569 20 20 18.6569 20 17H18C18 17.5523 17.5523 18 17 18V20ZM4 17C4 18.6569 5.34315 20 7 20V18C6.44772 18 6 17.5523 6 17H4ZM6 7C6 6.44772 6.44772 6 7 6V4C5.34315 4 4 5.34315 4 7H6Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconExternal;
