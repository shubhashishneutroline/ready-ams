import React from "react";

const CenterSection = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div
      className="absolute flex items-center justify-center top-0 right-0 min-w-[100vw] h-full
        p-4 text-white bg-black/20 z-[20]"
      style={{
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
      }}
    >
      {children}
    </div>
  );
};

export default CenterSection;
