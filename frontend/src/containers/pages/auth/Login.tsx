import { Form, Input, Button, Card, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import "./Login.scss";
import { useNavigate } from "react-router-dom";
import { PUBLIC_ROUTE } from "@/constants";

const { Title } = Typography;

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = (values: LoginFormValues) => {
    login(values);
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <Title level={3} className="login-title">
          Iniciar sesión
        </Title>

        <Form
          name="login"
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
            rules={[{ required: true, message: "Ingresa tu contraseña" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="********"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Ingresar
            </Button>
          </Form.Item>
        </Form>
        <Button
          className="login-back-btn"
          onClick={() => navigate(PUBLIC_ROUTE.REGISTER)}
        >
          Registrar
        </Button>
      </Card>
    </div>
  );
};

export default Login;
