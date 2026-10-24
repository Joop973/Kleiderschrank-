import { Text as RNText, type TextProps } from 'react-native';

import { schrift, useThema } from './thema';

type Art = 'titel' | 'gross' | 'text' | 'klein';

export function Text({
  art = 'text',
  leise = false,
  style,
  ...rest
}: TextProps & { art?: Art; leise?: boolean }) {
  const { farben } = useThema();
  return (
    <RNText
      {...rest}
      style={[
        {
          color: leise ? farben.textLeise : farben.text,
          fontSize: schrift[art],
          fontWeight: art === 'titel' ? '700' : art === 'gross' ? '600' : '400',
          lineHeight: Math.round(schrift[art] * 1.35),
        },
        style,
      ]}
    />
  );
}
