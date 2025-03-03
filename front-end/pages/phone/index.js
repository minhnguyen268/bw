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
  const { data: session, status } = useSession();
  const [loginStatus, setLoginStatus] = useState(null);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const { data, isLoading } = useGetInformationUser();

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
      toast.success(result?.data?.message ?? "Đổi số điện thoại thành công");
      setLoginStatus("success");
      await refetch();
      reset({ phone: "" });
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log(err);
    }
  };

  if (isLoading) return;

  return (
    <>
      <NextSeo title="Đổi số điện thoại" />
      <LoadingBox
        isSuccess={loginStatus === "success"}
        isLoading={loginStatus === "loading"}
      />
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
                navigator.clipboard.writeText(data.soDienThoai);
                toast.success("Copy thành công");
              }}
            /> */}
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
            <ErrorMessageLabel>
              {errors.phone ? errors.phone.message : ""}
            </ErrorMessageLabel>
          </FormControl>

          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            variant="contained"
          >
            Xác nhận
          </Button>
        </form>
      </Layout>
    </>
  );
};

export default Phone;
