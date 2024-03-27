import { ThumbnailLayer } from "../../components/ol";

const Thumbnail = () => {
  const coordinates = [
    [
      [113.627365357825056, 22.701099714979932],
      [113.6293724341906, 22.69861761401171],
      [113.625795775554707, 22.694155224783856],
      [113.625325686431324, 22.693649860652613],
      [113.621881694884337, 22.689214312590479],
      [113.621248264595806, 22.688456649954503],
      [113.617029325443127, 22.691164782928468],
      [113.615423156053907, 22.692307847329346],
      [113.627365357825056, 22.701099714979932],
    ],
  ];

  return <ThumbnailLayer coordinates={coordinates} width={200} height={140} color={"red"} />;
};

export default Thumbnail;
