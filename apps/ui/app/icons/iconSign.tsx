"use client";

const IconSign = ({
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
        d="M6.79741 17.6936C6.80056 17.7664 6.80442 17.8393 6.80898 17.9123L6.99807 20.9376L5.00196 21.0624L4.81288 18.0371C4.33746 10.4304 10.3786 4 18 4H20.8508L17.4074 6.75474C15.2537 8.47766 14 11.0861 14 13.8442C14 16.6197 11.4408 18.6886 8.72691 18.107L6.79741 17.6936Z"
        fill={color}
        className={className}
      />
    </svg>
  );
};

export default IconSign;
