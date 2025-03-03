import Layout from "@/components/Layout";
import Button from "@/components/button/Button";
import LoadingBox from "@/components/homePage/LoadingBox";
import ErrorMessageLabel from "@/components/input/ErrorMessageLabel";
import OutlinedInput from "@/components/input/OutlinedInput";
import { MIN_LENGTH_PASSWORD } from "@/configs/user.config";
import UserService from "@/services/UserService";
import { yupResolver } from "@hookform/resolvers/yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormControl, IconButton, InputAdornment } from "@mui/material";
import { useSession } from "next-auth/react";
import { NextSeo } from "next-seo";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useGetInformationUser from "@/hooks/useGetInformationUser";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Phone = () => {
  const { t } = useTranslation("common");
  const { data: session, status } = useSession();
  const [loginStatus, setLoginStatus] = useState(null);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [show, setShow] = useState(false);

  const { data, isLoading, refetch } = useGetInformationUser();

  // form validation rules
  const validationSchema = Yup.object().shape({
    phone: Yup.string()
      .required("Vui lòng nhập số điện thoại")
      .trim("Số điện thoại không hợp lệ")
      .matches(/^0\d{9,10}$/, "Số điện thoại không hợp lệ")
      .strict(true),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm(formOptions);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status]);

  const onSubmit = async (data) => {
    try {
      setLoginStatus("loading");
      const result = await UserService.changePhone(data.phone);
      toast.success(t(result?.data?.message) ?? "Đổi mật khẩu thành công");
      setLoginStatus("success");
      await refetch();
      reset({ phone: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log(err);
    }
  };

  if (isLoading) return;

  const maskedPhone = `${data.soDienThoai.slice(0, 3)}***${data.soDienThoai.slice(-3)}`;

  return (
    <>
      <NextSeo title="Đổi số điện thoại" />
      <LoadingBox isSuccess={loginStatus === "success"} isLoading={loginStatus === "loading"} />
      <Layout>
        <h1 className="title-h1">Đổi số điện thoại</h1>

        <form
          style={{
            paddingTop: "5rem",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "1.5rem",
          }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div style={{ fontSize: "20px", paddingBottom: "10px" }}>
            Số điện thoại hiện tại: {show ? data.soDienThoai : maskedPhone}{" "}
          </div>
          <div style={{ fontSize: "20px" }}>Đổi số điện thoại mới</div>

          <FormControl
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Controller
              name="phone"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <OutlinedInput
                  placeholder="Số điện thoại"
                  type={"text"}
                  size="small"
                  fullWidth
                  error={errors.phone ? true : false}
                  inputRef={ref}
                  {...field}
                />
              )}
            />
            <ErrorMessageLabel>{errors.phone ? errors.phone.message : ""}</ErrorMessageLabel>
          </FormControl>

          <Button type="submit" onClick={handleSubmit(onSubmit)} variant="contained">
            {t("Confirm")}
          </Button>
        </form>
      </Layout>
    </>
  );
};

export default Phone;
