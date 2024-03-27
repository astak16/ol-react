import Map from "../../components/map";
import styled from "styled-components";
import { Button, Space } from "antd";
import { BaseLayer } from "../../components/ol";
import { useState } from "react";

type TianDiTuType = "satellite" | "vector";

const TianDiTu = () => {
  const [showAnnotation, setShowAnnotation] = useState(true);
  const [type, setType] = useState<TianDiTuType>("satellite");

  return (
    <Map>
      <BaseLayer type={type} showAnnotation={showAnnotation} />
      <Rooted>
        <Space>
          <Button onClick={() => setType("satellite")}>卫星地图</Button>
          <Button onClick={() => setType("vector")}>电子地图</Button>
          <Button onClick={() => setShowAnnotation(!showAnnotation)}>{showAnnotation ? "隐藏注记" : "显示注记"}</Button>
        </Space>
      </Rooted>
    </Map>
  );
};

const Rooted = styled.div`
  position: absolute;
  z-index: 10;
  background-color: #fff;
  padding: 8px;
  border-radius: 4px;
`;

export default TianDiTu;
