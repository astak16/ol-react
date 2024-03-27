import styled from "styled-components";

export const RowContainer = styled.div<{
  $gap?: number;
  $alignItem?: "center" | "flex-start" | "flex-end" | "unset";
  $direction?: "row" | "column";
  $justifyContent?: "center" | "space-around" | "space-between" | "flex-start" | "flex-end";
}>`
  display: flex;
  align-items: ${(p) => p.$alignItem || "center"};
  justify-content: ${(p) => p.$justifyContent || "flex-start"};
  flex-direction: ${(p) => p.$direction || "row"};
  grid-gap: ${(p) => p.$gap || 0}px;
`;
