import { Box, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import { useState } from "react";

const Item = ({ item }) => {
  const [show, setShow] = useState(false);
  const masked =
    item.soTaiKhoan.length <= 5
      ? "".padStart(item.soTaiKhoan.length, "*")
      : `${item.soTaiKhoan.slice(0, item.soTaiKhoan.length - 5)}*****`;

  return (
    <>
      <Box
        sx={{
          background: "url(/assets/images/background_bank.png) no-repeat 50%",
          backgroundSize: "100% 100%",
          padding: "1rem",
          minHeight: "20rem",
          alignItems: "center",
          gap: "1rem",
          color: (theme) => theme.palette.text.primary,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "2rem",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.8rem",
            }}
          >
            {item.tenChuTaiKhoan}
          </Typography>
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "2.5rem",
            }}
          >
            {show ? item.soTaiKhoan : masked}
            {/* {!show && (
              <VisibilityIcon
                sx={{
                  fontSize: "2rem",
                  marginLeft: "1.5rem",
                  cursor: "pointer",
                }}
                onClick={() => setShow(!show)}
              />
            )}
            {show && (
              <VisibilityOffIcon
                sx={{
                  fontSize: "2rem",
                  marginLeft: "1.5rem",
                  cursor: "pointer",
                }}
                onClick={() => setShow(!show)}
              />
            )}
            <ContentCopyIcon
              sx={{
                fontSize: "2rem",
                marginLeft: "1.2rem",
                cursor: "pointer",
              }}
              onClick={() => {
                navigator.clipboard.writeText(item.soTaiKhoan);
                toast.success("Copy thành công");
              }}
            /> */}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            margin: "2rem",
            alignItems: "center",
          }}
        >
          <img src="/assets/images/credit_card.png" />
          <Typography
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "2.5rem",
            }}
          >
            {item.tenNganHang}
          </Typography>
        </Box>
      </Box>
    </>
  );
};
export default Item;
