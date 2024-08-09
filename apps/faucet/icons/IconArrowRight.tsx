"use client";

const IconArrowRight = ({
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
        d="M17 12H3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.7152 11.7966L16.265 7.90356C15.7355 7.52535 15 7.90385 15 8.55455V15.4454C15 16.0961 15.7355 16.4746 16.265 16.0964L21.7152 12.2034C21.8548 12.1037 21.8548 11.8963 21.7152 11.7966Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default IconArrowRight;
