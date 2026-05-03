import { Spin } from "antd";

const LoaderPage = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      <Spin size="large" />
    </div>
  );
};

export default LoaderPage;
