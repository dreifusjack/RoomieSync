import React from "react";

interface SidebarElementProps {
  title?: string;
  icon: React.ReactNode;
  href: string;
}

const SidebarElement: React.FC<SidebarElementProps> = ({
  title,
  icon,
  href,
}) => {
  return (
    <a href={href} className="block">
      <div className="h-20 flex flex-col justify-center items-center text-gray-400 hover:bg-gray-800 cursor-pointer transition-colors duration-200">
        {icon}
        {title && (
          <span className="text-xs mt-1 text-center px-1">{title}</span>
        )}
      </div>
    </a>
  );
};

export default SidebarElement;
