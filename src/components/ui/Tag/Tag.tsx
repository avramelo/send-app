import { Chip, ChipProps } from "@mui/material";

interface TagProps extends Omit<ChipProps, "label"> {
  value: string;
  onClick?: () => void;
}

const Tag = ({ value, onClick, ...props }: TagProps) => {
  return (
    <Chip
      label={value}
      onClick={onClick}
      sx={{
        backgroundColor: "grey.800",
        color: "grey.200",
        "&:hover": {
          backgroundColor: "grey.700",
        },
        fontFamily: "monospace",
        fontSize: "0.875rem",
      }}
      {...props}
    />
  );
};

export default Tag;
