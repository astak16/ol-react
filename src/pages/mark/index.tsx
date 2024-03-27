import Map from "../../components/map";
import { BaseLayer, MarkerLayer } from "../../components/ol";
import { useState } from "react";
import greenIcon from "./images/green-icon.png";
import yellowIcon from "./images/yellow-icon.png";
import styled from "styled-components";
import { Button } from "antd";
import { useEvent } from "../../components/ol/hooks/useEvent";
import { pointerMove } from "ol/events/condition";

const Mark = () => {
  const [showAnnotation, setShowAnnotation] = useState(true);
  const [type, setType] = useState<"satellite" | "vector">("satellite");
  const [open, setOpen] = useState(true);
  const [id, setId] = useState<string>();

  const points = {
    "1": [123.4561, 47.2778],
    "2": [123.1421, 47.0675],
    "3": [122.7917, 47.1084],
    "4": [123.373, 47.3168],
    "5": [122.9559, 47.0745],
    "6": [122.8213, 47.0719],
  };
  const points2 = {
    "7": [122.7465, 47.0781],
    "8": [123.0659, 47.1071],
    "9": [123.2078, 47.0494],
    "10": [123.1097, 47.1537],
    "11": [123.2962, 47.3107],
    "12": [123.3523, 47.3281],
    "13": [123.055, 47.0247],
    "14": [123.1246, 47.0427],
    "15": [122.8587, 47.0541],
  };

  const onClick = () => {
    setOpen(!open);
  };

  const onSelect = useEvent((id: string) => {
    console.log(id);
    setId(id);
  });

  return (
    <Map>
      <BaseLayer type={type} showAnnotation={showAnnotation} />
      {open && (
        <>
          <MarkerLayer
            condition={pointerMove}
            popover={<>{222}</>}
            points={points}
            image={greenIcon}
            scale={0.5}
            onSelect={onSelect}
          />
          <MarkerLayer
            condition={pointerMove}
            popover={<>{3333}</>}
            points={points2}
            image={yellowIcon}
            scale={0.5}
            onSelect={onSelect}
          />
        </>
      )}
      <BottomStyled>
        <Button onClick={onClick}>{open ? "隐藏 mark" : "显示 mark"}</Button>
      </BottomStyled>
    </Map>
  );
};

const BottomStyled = styled.div`
  position: absolute;
  z-index: 1;
`;

export default Mark;
