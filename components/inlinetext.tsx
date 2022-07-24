import { Typography } from "@mui/material"

interface TextProps {
    children: React.ReactNode
    color: string
}

const InlineText = ({ children, color }: TextProps) => (
    <Typography color={color} display="inline">{children}</Typography>
)

export default InlineText;
