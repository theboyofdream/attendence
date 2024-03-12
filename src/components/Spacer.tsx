import React from 'react';
import { View as RNView } from 'react-native';

type SpacerProps = {
  horizontal?: boolean;
  size: number;
  stretch?: boolean;
};

export function Spacer({ horizontal = false, size, stretch }: SpacerProps) {
  return (
    <RNView
      style={{
        width: horizontal ? size : 'auto',
        height: !horizontal ? size : 'auto',
        flex: stretch ? 1 : 0,
      }}
    />
  );
}
