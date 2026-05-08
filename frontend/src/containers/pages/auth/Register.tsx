import { Form, Input, Button, Card, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/api/reactQuery";
import { createNotification } from "@/components/NotificationCustom";
import "./Login.scss";
import { noOnlySpaces } from "@/utils/formValidators";

const { Title } = Typography;

type RegisterFormValues = {
  email: string;
  password: string;
};

const Register = () => {
  const navigate = useNavigate();
  const { mutate: registerMutation, isPending } = useRegisterMutation();

  const onFinish = (values: RegisterFormValues) => {
    registerMutation(values, {
      onSuccess: () => {
        createNotification.success({
          title: "Usuario creado",
          description: "Registro exitoso. Ahora puedes iniciar sesión.",
        });
        navigate(-1);
      },
      onError: (error) => {
        const message = error?.response?.data?.message || "Error desconocido";

        if (message === "Email already in use") {
          createNotification.error({
            title: "Email en uso",
            description: "Ya existe un usuario registrado con este correo.",
          });
          return;
        }

        createNotification.error({
          title: "Error de registro",
          description: "No se pudo completar el registro.",
        });
      },
    });
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={3} className="login-title">
          Registro
        </Title>

        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: "Ingresa tu correo" },
              { type: "email", message: "Correo inválido" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="ejemplo@email.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Contraseña"
            name="password"
            rules={[
              { required: true, message: "Ingresa tu contraseña" },
              {
                min: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
              noOnlySpaces("La contraseña no puede estar vacía"),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="********"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isPending}
            >
              Registrar
            </Button>
          </Form.Item>
        </Form>

        <Button className="login-back-btn" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </Card>
    </div>
  );
};

export default Register;
