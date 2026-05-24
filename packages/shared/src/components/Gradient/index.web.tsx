import React from 'react';
import {View} from 'react-native';

import {
  buildWebGradient,
  DIRECTION_TO_START_END,
  gradientStyles,
  GradientProps,
  normalizeColors,
  normalizeLocations,
} from './shared';

export type {ColorStop, GradientDirection, GradientProps} from './shared';
export {createGradientColors, createMultiColorGradient} from './shared';

export const Gradient: React.FC<GradientProps> = ({
  colors,
  direction,
  start,
  end,
  locations,
  children,
  style,
}) => {
  const colorArray = normalizeColors(colors);
  const colorStopLocations = normalizeLocations(colors);
  const finalLocations = locations ?? colorStopLocations;

  let finalStart = start;
  let finalEnd = end;

  if (!finalStart || !finalEnd) {
    const directionMapping = DIRECTION_TO_START_END[direction ?? 'vertical'];
    finalStart = finalStart ?? directionMapping.start;
    finalEnd = finalEnd ?? directionMapping.end;
  }

  const webGradientStyle = buildWebGradient(colorArray, direction, finalStart, finalEnd, finalLocations);
  return <View style={[gradientStyles.container, webGradientStyle, style]}>{children}</View>;
};

export default Gradient;
