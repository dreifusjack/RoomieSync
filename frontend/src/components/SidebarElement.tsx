import { Box } from "@mui/material";

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
    <a href={href}>
      <Box
        sx={{
          height: "75px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#a2a2a2",
          "&:hover": {
            backgroundColor: "#090909",
          },
          cursor: "pointer",
        }}
      >
        {icon}
        {title}
      </Box>
    </a>
  );
};

export default SidebarElement;
